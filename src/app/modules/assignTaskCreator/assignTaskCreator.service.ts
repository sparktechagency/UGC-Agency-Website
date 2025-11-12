import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TAssignTaskCreator } from './assignTaskCreator.interface';
import AssignTaskCreator from './assignTaskCreator.model';
import Creator from '../creator/creator.model';
import HireCreator from '../hireCreator/hireCreator.model';
import { User } from '../user/user.models';
import Subscription from '../subscription/subscription.model';
import { deleteFromS3, deleteManyFromS3, uploadManyToS3 } from '../../utils/s3';
import { unlink } from 'fs/promises';
import mongoose from 'mongoose';
import paypalClient from '../../utils/paypal';
import Chat from '../chat/chat.model';
import { CLIENT_RENEG_LIMIT } from 'tls';

const createAssignTaskCreator = async (payload: any) => {
  console.log('AssignTaskCreator payload=', payload);

  if (!payload.creatorsIds || !payload.hireCreatorId || !payload.price) {
    throw new AppError(
      403,
      'Creator ID, Hire Creator ID, and price are required',
    );
  }

  const existHireCreator = await HireCreator.findById(payload.hireCreatorId);
  if (!existHireCreator) {
    throw new AppError(404, 'Hire Creator not found');
  }
  if (existHireCreator.status !== 'approved') {
    throw new AppError(404, 'Hire Creator is not approved!');
  }
  if (existHireCreator.scriptStatus !== 'accepted') {
    throw new AppError(404, 'Hire Creator revision status is not accepted!');
  }

  if (payload.price <= 0) {
    throw new AppError(400, 'Price must be greater than zero!');
  }

  // const videoCount: any = await Subscription.findById(
  //   existHireCreator.subscriptionId,
  // );
  // console.log('videoCount', videoCount);
  // if (!videoCount) {
  //   throw new AppError(404, 'Subscription not found for this Hire Creator');
  // }

  const creatorData = await Promise.all(
    payload.creatorsIds.map(async (creatorId: string) => {
      const existCreator = await Creator.findById(creatorId);
      if (!existCreator) {
        throw new AppError(404, 'Creator not found');
      }

      const existingAssignTaskCreator = await AssignTaskCreator.findOne({
        creatorId: existCreator._id,
        hireCreatorId: existHireCreator._id,
      });

      if (!existingAssignTaskCreator) {
        return {
          creatorId: existCreator._id,
          creatorUserId: existCreator.userId,
          price: payload.price,
          hireCreatorId: existHireCreator._id,
          hireCreatorUserId: existHireCreator.userId,
          videoCount: existHireCreator.videoCount,
          isScript: existHireCreator.isScript,
        };
      }

      return null;
    }),
  );
  console.log('creatorData', creatorData);
  const validCreatorData = creatorData.filter((data) => data !== null);
  console.log('validCreatorData', validCreatorData);

  if (validCreatorData.length === 0) {
    throw new AppError(
      404,
      'No new tasks to assign, all creators are already assigned',
    );
  }

  const result = await AssignTaskCreator.insertMany(validCreatorData);

  if (!result) {
    throw new AppError(403, 'AssignTaskCreator creation failed!');
  }

  return result;
};

const finallyCreateAssignBrandCreator = async (
  creatorsAssign: any,
  hirecreatorId: any,
) => {
  console.log('finally creatorAssign=', creatorsAssign);

  if (!Array.isArray(creatorsAssign) || creatorsAssign.length === 0) {
    throw new AppError(400, 'ids must be a non-empty array');
  }

  const existHireCreator = await HireCreator.findById(hirecreatorId);
  if (!existHireCreator) {
    throw new AppError(404, 'Hire Creator not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (creatorsAssign.length === 0) {
      throw new AppError(403, 'creatorAssign is empty, no tasks to assign');
    }

    const findVideoCount = await AssignTaskCreator.findById(creatorsAssign[0]);
    if (!findVideoCount) {
      throw new AppError(404, 'AssignTaskCreator not found');
    }

    const assignCreatorCount = Number(findVideoCount.videoCount) / 2;
    if (creatorsAssign.length !== assignCreatorCount) {
      throw new AppError(
        404,
        `Creator assign count should be ${assignCreatorCount}, received ${creatorsAssign.length}`,
      );
    }

    // const normalizedIds = creatorsAssign?.map(async (id) => {
    //   const isExist = await AssignTaskCreator.findOne({
    //     _id: id,
    //     hireCreatorId: hirecreatorId,
    //   });
    //   if (!isExist) {
    //     throw new AppError(404, 'AssignTaskCreator not found');
    //   }
    // });

    const normalizedIds = await Promise.all(
      creatorsAssign.map(async (id) => {
        const isExist = await AssignTaskCreator.findOne({
          _id: id,
          hireCreatorId: hirecreatorId,
        });
        if (!isExist) {
          throw new AppError(404, `AssignTaskCreator not found for id ${id}`);
        }
        return id; // <-- must return the ID so it ends up in normalizedIds
      }),
    );

    const docs = await AssignTaskCreator.find({
      _id: { $in: normalizedIds },
    }).session(session);

    if (docs.length !== normalizedIds.length) {
      const foundIds = docs.map((d) => d._id.toString());
      const missing = creatorsAssign.filter(
        (id) => !foundIds.includes(id.toString()),
      );
      throw new AppError(
        404,
        `Some AssignTaskCreator documents not found: ${missing.join(', ')}`,
      );
    }

    const invalidStatus = docs.filter((d) => d.status !== 'approved_by_admin');
    if (invalidStatus.length > 0) {
      const details = invalidStatus
        .map((d) => `${d._id.toString()}: ${d.status}`)
        .join('; ');
      throw new AppError(
        400,
        `Some documents are not in 'request_approved' state: ${details}`,
      );
    }

    const updateResult = await AssignTaskCreator.updateMany(
      { _id: { $in: normalizedIds } },
      { $set: { status: 'approved' } },
      { session },
    );

    const hireCreatorUpdate = await HireCreator.findOneAndUpdate(
      { _id: existHireCreator._id },
      { status: 'ongoing' },
      { session },
    );

    if (!hireCreatorUpdate) {
      throw new AppError(403, 'HireCreator update failed!');
    }

    const deleteResult = await AssignTaskCreator.deleteMany(
      {
        _id: { $nin: normalizedIds },
        status: 'approved_by_admin',
        hireCreatorId: hirecreatorId,
      },
      { session },
    );

    const admin = await User.findOne({ role: 'admin' }).session(session);
    if (!admin) {
      throw new AppError(404, 'Admin user not found');
    }

    const approvedDocs = await AssignTaskCreator.find({
      _id: { $in: creatorsAssign },
      status: 'approved',
    }).session(session);

    // all creators chat create
    await Promise.all(
      approvedDocs.map(async (doc) => {
        const creatorUserId = doc.creatorUserId;

        // Check if chat already exists in this session
        const existChat = await Chat.findOne({
          participants: { $all: [admin._id, creatorUserId] },
        }).session(session);

        if (!existChat) {
          const chat = new Chat({
            participants: [admin._id, creatorUserId],
          });
          // save within the session
          await chat.save({ session });
        }
      }),
    );

    await session.commitTransaction();
    session.endSession();

    return updateResult;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof AppError) throw error;
    throw new AppError(
      error.statusCode || 500,
      error.message || 'Something went wrong!',
    );
  }
};

const getAllAssignTaskCreatorQuery = async (
  query: Record<string, unknown>,
  id: string,
) => {
  const hireCreator = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator not found');
  }
  if (query.status === 'approved') {
    query.status = ['cancel', 'revision', 'completed', 'delivered', 'approved'];
  }
  const AssignTaskCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({ hireCreatorId: id })
      // .populate('creatorId')
      // .populate('creatorUserId')
      // .populate('hireCreatorId')
      .populate({
        path: 'hireCreatorUserId',
        select: 'fullName email address phone',
      })
      .populate({
        path: 'creatorUserId',
        select: 'fullName email address phone',
      }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await AssignTaskCreatorQuery.modelQuery;

  const meta = await AssignTaskCreatorQuery.countTotal();
  return { meta, result };
};

const getAllAssignTaskCreatorOfUserQuery = async (
  query: Record<string, unknown>,
  userId: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // const updateUserId =
  //   user.role === 'creator' ? 'creatorUserId' : 'hireCreatorUserId';

  const assignTaskCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({ creatorUserId: userId })
      // .populate('creatorId')
      // .populate('creatorUserId')
      .populate({
        path: 'hireCreatorId',
        select:
          'brandInfo.name brandInfo.email brandInfo.phone brandInfo.productName status paymentStatus',
      }),
    // .populate('hireCreatorUserId'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await assignTaskCreatorQuery.modelQuery;

  const meta = await assignTaskCreatorQuery.countTotal();
  return { meta, result };
};

const getAssignTaskCreatorByUser = async (
  query: Record<string, unknown>,
  id: string,
) => {
  const hireCreator = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator not found');
  }

  const assignTaskCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({ hireCreatorId: id })
      // .populate('creatorId')
      // .populate('creatorUserId')
      .populate({
        path: 'hireCreatorId',
        select:
          'brandInfo.name brandInfo.email brandInfo.phone brandInfo.productName status paymentStatus',
      }),
    // .populate('hireCreatorUserId'),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await assignTaskCreatorQuery.modelQuery;

  const meta = await assignTaskCreatorQuery.countTotal();
  return { meta, result };
};

const getSingleAssignTaskCreatorQuery = async (id: string) => {
  const assignTaskCreator: any = await AssignTaskCreator.findById(id)
    .populate('creatorId')
    .populate('creatorUserId')
    .populate('hireCreatorId')
    .populate('hireCreatorUserId');
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator Not Found!!');
  }
  return assignTaskCreator;
};

const getSingleAssignTaskCreatorVideo = async (id: string) => {
  const assignTaskCreator: any = await AssignTaskCreator.findById(id)
    .select('creatorId')
    .populate({
      path: 'creatorId',
      select: 'ugcExampleVideo introductionvideo',
    });
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator Not Found!!');
  }
  return assignTaskCreator;
};

const getSingleHireCreatorToAssignTaskCreator = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }

  const assignTaskCreator: any = await AssignTaskCreator.findOne({
    hireCreatorId: id,
    status: { $nin: ['cancel', 'pending', 'request_approved'] },
  })
    .populate('creatorId')
    .populate('creatorUserId')
    .populate('hireCreatorId')
    .populate('hireCreatorUserId');
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator Not Found!!');
  }
  return assignTaskCreator;
};

const singleAssignTaskCreatorApprovedCancelQuery = async (
  id: string,
  status: any,
  userId: string,
) => {
  console.log('id', id);
  console.log('updated status', status);
  const assignTaskCreator: any = await AssignTaskCreator.findById(id);
  if (!assignTaskCreator) {
    throw new AppError(404, 'AssignTaskCreator is not found!');
  }
  if (assignTaskCreator.status !== 'pending') {
    throw new AppError(404, 'AssignTaskCreator is not pending!');
  }

  if (assignTaskCreator.creatorUserId.toString() !== userId.toString()) {
    throw new AppError(
      403,
      'You are not authorized to approve or cancel this task creator!',
    );
  }

  const creator = await Creator.findOne({ userId });

  if (!creator) {
    throw new AppError(404, 'Creator not found!');
  }

  if (status === 'request_approved') {
    // const creatorPaypalEmailValidation = creator.paypalEmail;
    // if (!creatorPaypalEmailValidation) {
    //   throw new AppError(403, 'Creator paypal email not found!');
    // }

    // const validEmal = paypalClient.

    if (assignTaskCreator.status === 'request_approved') {
      throw new AppError(403, 'AssignTaskCreator is already approved!');
    }
    const result = await AssignTaskCreator.findByIdAndUpdate(
      id,
      { status: 'request_approved' },
      {
        new: true,
      },
    );

    if (!result) {
      throw new AppError(403, 'updated faild!!');
    }

    return result;
  } else {
    if (assignTaskCreator.status === 'cancel') {
      throw new AppError(403, 'AssignTaskCreator is already cancel!');
    }

    const result = await AssignTaskCreator.findByIdAndDelete(id);

    if (!result) {
      throw new AppError(403, 'AssignTaskCreator updated faild!!');
    }

    return result;
  }
};

// const multipleAssignTaskCreatorApprovedByAdmin = async (ids: any) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     console.log('ids', ids);

//     ids.forEach(async (id: any) => {
//       const assignTaskCreator: any = await AssignTaskCreator.findById(id);
//       if (!assignTaskCreator) {
//         throw new AppError(404, 'AssignTaskCreator is not found!');
//       }
//       if (assignTaskCreator.status !== 'request_approved') {
//         throw new AppError(404, 'AssignTaskCreator is not approved yet!');
//       }

//       if (assignTaskCreator.status === 'approved_by_admin') {
//         throw new AppError(404, 'AssignTaskCreator approved by admin!!');
//       }

//       if (assignTaskCreator.status === 'approved') {
//         throw new AppError(404, 'AssignTaskCreator is already approved!');
//       }

//     })

//     ids.forEach(async (id: any) => {
//       const assignTaskCreator = await AssignTaskCreator.findByIdAndUpdate(
//         id,
//         { status: 'approved_by_admin' },
//         { new: true, session },
//       );
//       if (!assignTaskCreator) {
//         throw new AppError(403, 'AssignTaskCreator updated faild!!');
//       }
//     })

//     // const hireCreatorUpdate = await HireCreator.findByIdAndUpdate(
//     //   assignTaskCreatorProduct.hireCreatorId,
//     //   {
//     //     status: 'ongoing',
//     //     creatorId: assignTaskCreatorProduct.creatorId,
//     //     creatorUserId: assignTaskCreatorProduct.creatorUserId,
//     //     creatorPrice: assignTaskCreatorProduct.price,
//     //   },
//     //   { new: true, session },
//     // );
//     // if (!hireCreatorUpdate) {
//     //   throw new AppError(403, 'HireCreator update failed!');
//     // }

//     // const admin = await User.findOne({ role: 'admin' }).session(session);
//     // if (!admin) {
//     //   throw new AppError(404, 'Admin not found!');
//     // }
//     // console.log('Admin', admin);

//     // const existChat = await Chat.findOne({
//     //   participants: {
//     //     $all: [admin._id, assignTaskCreatorProduct.creatorUserId],
//     //   },
//     // }).session(session);
//     // console.log('existChat', existChat);

//     // if (!existChat) {
//     //   const chatCreate = await Chat.create(
//     //     {
//     //       participants: [admin._id, assignTaskCreatorProduct.creatorUserId],
//     //     },
//     //     { session },
//     //   );
//     //   if (!chatCreate || chatCreate.length === 0) {
//     //     throw new AppError(403, 'Chat creation failed!');
//     //   }
//     // }

//     await session.commitTransaction();
//     session.endSession();

//     return assignTaskCreator;
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();

//     throw new AppError(
//       error.statusCode || 500,
//       error.message || 'Something went wrong!',
//     );
//   }
// };

const multipleAssignTaskCreatorApprovedByAdmin = async (
  ids: any[],
  hirecreatorId: string,
) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError(400, 'ids must be a non-empty array');
  }

  const existHireCreator = await HireCreator.findById(hirecreatorId);
  if (!existHireCreator) {
    throw new AppError(404, 'HireCreator not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('ids', ids);
    const normalizedIds = await Promise.all(
      ids.map(async (id) => {
        const isExist = await AssignTaskCreator.findOne({
          _id: id,
          status: 'request_approved',
          hireCreatorId: hirecreatorId,
        });
        if (!isExist) {
          throw new AppError(404, `AssignTaskCreator not found for id ${id}`);
        }
        return id; // <-- must return the ID so it ends up in normalizedIds
      }),
    );

    // console.log('normalizedIds', normalizedIds);

    const docs = await AssignTaskCreator.find({
      _id: { $in: normalizedIds },
      status: 'request_approved',
      hireCreatorId: hirecreatorId,
    }).session(session);

    if (docs.length !== ids.length) {
      const foundIds = docs.map((d) => d._id.toString());
      const missing = ids.filter((id) => !foundIds.includes(id.toString()));
      throw new AppError(
        404,
        `Some AssignTaskCreator documents not found: ${missing.join(', ')}`,
      );
    }

    const updateResult = await AssignTaskCreator.updateMany(
      {
        _id: { $in: ids },
        status: 'request_approved',
        hireCreatorId: hirecreatorId,
      },
      { $set: { status: 'approved_by_admin' } },
      { session },
    );

    const deleteResult = await AssignTaskCreator.deleteMany(
      {
        _id: { $nin: ids },
        status: 'request_approved',
        hireCreatorId: hirecreatorId,
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return updateResult;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    if (error instanceof AppError) throw error;
    throw new AppError(
      error.statusCode || 500,
      error.message || 'Something went wrong!',
    );
  }
};

// const assignTaskCreatorUploadVideosByCreator = async (
//   id: string,
//   userId: string,
//   files: any,
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     if (!id || !userId) {
//       throw new AppError(400, 'Invalid input parameters');
//     }

//     const assignTaskCreatorProduct: any =
//       await AssignTaskCreator.findById(id).session(session);
//     if (!assignTaskCreatorProduct) {
//       throw new AppError(404, 'AssignTaskCreator is not found!!');
//     }

//     if (
//       (assignTaskCreatorProduct.status !== 'approved' &&
//         assignTaskCreatorProduct.status !== 'revision') ||
//       assignTaskCreatorProduct.creatorUserId.toString() !== userId.toString()
//     ) {
//       throw new AppError(
//         404,
//         'AssignTaskCreator is not approved or revision, you are not the creator!',
//       );
//     }

//     if (!files || files.uploadVideos.length === 0) {
//       throw new AppError(400, 'No video files uploaded');
//     }

//     if (files.uploadVideos.length > assignTaskCreatorProduct.videoCount) {
//       throw new AppError(
//         400,
//         `You can only upload ${assignTaskCreatorProduct.videoCount} videos`,
//       );
//     }

//     if (files.uploadVideos && files.uploadVideos.length > 0) {
//       const videos: any = await uploadManyToS3(
//         files.uploadVideos,
//         'uploadVideos/',
//       );

//       if (!videos || videos.length === 0) {
//         throw new AppError(400, 'Video upload failed');
//       }

//       const updateAssignTaskUploadVideos =
//         await AssignTaskCreator.findByIdAndUpdate(
//           id,
//           { uploadedFiles: videos, status: 'completed' },
//           { new: true, session },
//         );

//       const updateHireCreator = await HireCreator.findByIdAndUpdate(
//         assignTaskCreatorProduct.hireCreatorId,
//         { status: 'completed' },
//         { new: true, session },
//       );

//       if (!updateAssignTaskUploadVideos || !updateHireCreator) {
//         throw new AppError(
//           403,
//           'Failed to update AssignTaskCreator or HireCreator',
//         );
//       }

//       const allVideoPaths = files.uploadVideos.map(
//         (video: any) => `${video.path}`,
//       );
//       await Promise.all(allVideoPaths.map((path: any) => unlink(path)));

//       await session.commitTransaction();
//       session.endSession();

//       return updateAssignTaskUploadVideos;
//     }
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();

//     try {
//       const allVideoPaths = files?.uploadVideos?.map(
//         (video: any) => `${video.path}`,
//       );
//       if (allVideoPaths) {
//         await Promise.all(allVideoPaths.map((path: any) => unlink(path)));
//       }
//     } catch (fsError) {
//       console.error('Error accessing or deleting the video files:', fsError);
//     }

//     throw new AppError(
//       error.statusCode || 500,
//       error.message || 'An error occurred',
//     );
//   }
// };

// const assignTaskRevisionByUser = async (
//   id: string,
//   userId: string,
//   payload: any,
// ) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     if (!payload.revisionText && !payload.status) {
//       throw new AppError(400, 'Invalid input parameters: revisionText or status is required');
//     }

//     if (!id || !userId) {
//       throw new AppError(400, 'Invalid input parameters');
//     }

//     if (payload.revisionText) {
//       const assignTaskCreator: any =
//         await AssignTaskCreator.findById(id).session(session);
//       if (!assignTaskCreator) {
//         throw new AppError(404, 'AssignTaskCreator is not found!!');
//       }
//       if (assignTaskCreator.status === 'delivered') {
//         throw new AppError(404, 'AssignTaskCreator is already delivered!!');
//       }

//       if (
//         assignTaskCreator.status !== 'completed' ||
//         assignTaskCreator.hireCreatorUserId.toString() !== userId.toString()
//       ) {
//         throw new AppError(
//           404,
//           'AssignTaskCreator is not completed, you are not the brand creator!!',
//         );
//       }
//       const result = await AssignTaskCreator.findByIdAndUpdate(
//         id,
//         { status: 'revision', isScript: payload.revisionText },
//         { new: true, session },
//       );
//       if (!result) {
//         throw new AppError(403, 'AssignTaskCreator update failed!!');
//       }

//       const updateHireCreator = await HireCreator.findByIdAndUpdate(
//         assignTaskCreator.hireCreatorId,
//         { status: 'revision' },
//         { new: true, session },
//       );

//       if (!updateHireCreator) {
//         throw new AppError(403, 'HireCreator update failed!!');
//       }
//       await session.commitTransaction();
//       session.endSession();

//       return result;
//     } else if (payload.status && payload.status === 'delivered') {
//         const assignTaskCreator: any =
//             await AssignTaskCreator.findById(id).session(session);
//         if (!assignTaskCreator) {
//             throw new AppError(404, 'AssignTaskCreator is not found!!');
//         }

//         if (
//           assignTaskCreator.status !== 'completed' ||
//           assignTaskCreator.hireCreatorUserId.toString() !== userId.toString()
//         ) {
//           throw new AppError(
//             404,
//             'AssignTaskCreator is not revision, you are not the brand creator!!',
//           );
//         }
//         const result = await AssignTaskCreator.findByIdAndUpdate(
//             id,
//             { status: 'delivered' },
//             { new: true, session },
//         );
//         if (!result) {
//             throw new AppError(403, 'AssignTaskCreator update failed!!');
//         }

//         const updateHireCreator:any = await HireCreator.findByIdAndUpdate(
//             assignTaskCreator.hireCreatorId,
//             { status: 'delivered' },
//             { new: true, session },
//         );

//         const subscriptioinUpdate = await Subscription.findOneAndUpdate(
//           { _id: updateHireCreator.subscriptionId },
//           { status: 'completed' },
//           { new: true, session },
//         );

//         if (!updateHireCreator) {
//             throw new AppError(403, 'Hire Creator update failed!!');
//         }
//         await session.commitTransaction();
//         session.endSession();

//         return result;
//     }
//   } catch (error: any) {
//     await session.abortTransaction();
//     session.endSession();

//     throw new AppError(
//       error.statusCode || 500,
//       error.message || 'Something went wrong!',
//     );
//   }
// };

// const assignTaskCreatorReSubmitUploadVideosByCreator = async (
//   id: string,
//   userId: string,
//   files: any,
// ) => {

//   if (!id || !userId) {
//     throw new AppError(400, 'Invalid input parameters');
//   }
//   const assignTaskCreatorProduct: any = await AssignTaskCreator.findById(id);
//   if (!assignTaskCreatorProduct) {
//     throw new AppError(404, 'AssignTaskCreator is not found!!');
//   }

//   try {
//     if (
//       assignTaskCreatorProduct.status !== 'revision' ||
//       assignTaskCreatorProduct.creatorUserId.toString() !== userId.toString()
//     ) {
//       throw new AppError(
//         404,
//         'AssignTaskCreator is not approved, you are not the creator!',
//       );
//     }

//     if (!files || files.uploadVideos.length === 0) {
//       throw new AppError(400, 'No video files uploaded');
//     }

//     if (files.uploadVideos.length > assignTaskCreatorProduct.videoCount) {
//       throw new AppError(
//         400,
//         `You can only upload ${assignTaskCreatorProduct.videoCount} videos`,
//       );
//     }

//     console.log('assignTaskCreatorProduct.uploadedFiles', assignTaskCreatorProduct.uploadedFiles);

//      const keys = assignTaskCreatorProduct.uploadedFiles.map(
//        (key: any) => key.url.split('amazonaws.com/')[1],
//      );
//       console.log('keys', keys);

//       const deleteImage: any = await deleteManyFromS3(keys);
//       console.log('deleteImage', deleteImage);

//       if (deleteImage && files.uploadVideos && files.uploadVideos.length > 0) {
//         const videos: any = await uploadManyToS3(
//           files.uploadVideos,
//           'uploadVideos/',
//         );

//         if (!videos || videos.length === 0) {
//           throw new AppError(400, 'Video upload failed');
//         }

//         const updateAssignTaskUploadVideos =
//           await AssignTaskCreator.findByIdAndUpdate(
//             id,
//             { uploadedFiles: videos, status: 'completed' },
//             { new: true },
//           );

//         if (updateAssignTaskUploadVideos) {
//           const allVideo = files.uploadVideos.map(
//             (video: any) => `${video.path}`,
//           );
//           await Promise.all(allVideo.map((path: any) => unlink(path)));
//         }

//         return updateAssignTaskUploadVideos;
//       }

//   } catch (error:any) {
//     try {
//       const allVideo = files?.uploadVideos?.map(
//         (video: any) => `${video.path}`,
//       );
//       await Promise.all(allVideo?.map((path: any) => unlink(path)));
//     } catch (fsError) {
//       console.error('Error accessing or deleting the image file:', fsError);
//         throw new AppError(
//             error.statusCode || 500,
//             error.message || 'An error occurred while processing the request'
//         );
//     }
//     throw error;
//   }
// };

const assignTaskCreatorUploadVideosByCreator = async (
  id: string,
  userId: string,
  files: any,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('console-1');
    if (!id || !userId) {
      throw new AppError(400, 'Invalid input parameters');
    }

    const assignTaskCreator: any =
      await AssignTaskCreator.findById(id).session(session);
    if (!assignTaskCreator) {
      throw new AppError(404, 'AssignTaskCreator is not found!!');
    }

    const hireCreator = await HireCreator.findById(
      assignTaskCreator.hireCreatorId,
    ).session(session);

    if (!hireCreator) {
      throw new AppError(404, 'Hire creator not found!');
    }

    console.log('console-4');
    if (!files || files.uploadVideos.length === 0) {
      throw new AppError(400, 'No video files uploaded');
    }
    if (!files || files.uploadVideos.length > 2) {
      throw new AppError(400, 'You can only uploaded 2 videos!!');
    }

    console.log('console-5');

    const currentUploadCount = assignTaskCreator.uploadedFiles.length;
    const newUploadCount = files.uploadVideos.length;
    const totalVideosAfterUpload = currentUploadCount + newUploadCount;

    if (totalVideosAfterUpload > 2) {
      throw new AppError(400, 'You can only upload 2 videos total!!');
    }

    if (hireCreator.status === 'ongoing') {
      console.log('console-ongoing');
      if (assignTaskCreator.uploadedFiles.length === 2) {
        throw new AppError(400, `You can only upload 2 videos!!`);
      }

      if (files.uploadVideos && files.uploadVideos.length > 0) {
        console.log('file -upload-1');
        const videos: any = await uploadManyToS3(
          files.uploadVideos,
          'uploadVideos/',
        );
        console.log('file -upload-2');

        if (!videos || videos.length === 0) {
          throw new AppError(400, 'Video upload failed');
        }
        console.log('file -upload-3');

        const allVideos = [...assignTaskCreator.uploadedFiles, ...videos];

        const shouldComplete = allVideos.length === 2;

        const updateData: any = {
          uploadedFiles: allVideos,
        };

        if (shouldComplete) {
          updateData.status = 'completed';
        }

        const updateAssignCreator = await AssignTaskCreator.findByIdAndUpdate(
          id,
          updateData,
          { new: true, session },
        );

        if (!updateAssignCreator) {
          throw new AppError(403, 'Failed to update update AssignCreator');
        }

        const allVideoPaths = files.uploadVideos.map(
          (video: any) => `${video.path}`,
        );
        await Promise.all(allVideoPaths.map((path: any) => unlink(path)));

        await session.commitTransaction();
        session.endSession();

        return updateAssignCreator;
      }
    } else {
      console.log('dsakalf revision hit hoise');

      if (assignTaskCreator.uploadedFiles.length > 2) {
        throw new AppError(400, `You can only upload 2 videos!!`);
      }

      if (files.uploadVideos && files.uploadVideos.length > 0) {
        const videos: any = await uploadManyToS3(
          files.uploadVideos,
          'uploadVideos/',
        );

        if (!videos || videos.length === 0) {
          throw new AppError(400, 'Video upload failed');
        }

        const allVideos = [...assignTaskCreator.uploadedFiles, ...videos];

        // For non-ongoing status, complete when total reaches exactly 2
        const shouldComplete = allVideos.length === 2;

        const updateData: any = {
          uploadedFiles: allVideos,
        };

        if (shouldComplete) {
          updateData.status = 'completed';
        }

        const updateAssignCreator = await AssignTaskCreator.findByIdAndUpdate(
          id,
          updateData,
          { new: true, session },
        );

        if (!updateAssignCreator) {
          throw new AppError(403, 'Failed to update AssignCreator!');
        }
        const allVideoPaths = files.uploadVideos.map(
          (video: any) => `${video.path}`,
        );
        await Promise.all(allVideoPaths.map((path: any) => unlink(path)));

        await session.commitTransaction();
        session.endSession();

        return updateAssignCreator;
      }
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    try {
      const allVideoPaths = files?.uploadVideos?.map(
        (video: any) => `${video.path}`,
      );
      if (allVideoPaths) {
        await Promise.all(allVideoPaths.map((path: any) => unlink(path)));
      }
    } catch (fsError) {
      console.error('Error accessing or deleting the video files:', fsError);
    }

    throw new AppError(
      error.statusCode || 500,
      error.message || 'An error occurred',
    );
  }
};

const assignTaskCreatorReSubmitUploadVideosByCreator = async (
  id: string,
  userId: string,
  files: any,
) => {
  if (!id || !userId) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const hireCreator: any = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'Hire Creator is not found!!');
  }

  try {
    if (
      hireCreator.status !== 'revision' ||
      hireCreator.creatorUserId.toString() !== userId.toString()
    ) {
      throw new AppError(
        404,
        'AssignTaskCreator is not approved, you are not the creator!',
      );
    }

    const subscriptioin = await Subscription.findById(
      hireCreator.subscriptionId,
    );
    if (!subscriptioin) {
      throw new AppError(404, 'Subscription not found!!');
    }

    if (!files || files.uploadVideos.length === 0) {
      throw new AppError(400, 'No video files uploaded');
    }

    if (files.uploadVideos.length > subscriptioin.takeVideoCount) {
      throw new AppError(
        400,
        `You can only upload ${subscriptioin.takeVideoCount} videos`,
      );
    }

    console.log(
      'assignTaskCreatorProduct.uploadedFiles',
      hireCreator.uploadedFiles,
    );

    const keys = hireCreator.uploadedFiles.map(
      (key: any) => key.url.split('amazonaws.com/')[1],
    );
    console.log('keys', keys);

    const deleteImage: any = await deleteManyFromS3(keys);
    console.log('deleteImage', deleteImage);

    if (deleteImage && files.uploadVideos && files.uploadVideos.length > 0) {
      const videos: any = await uploadManyToS3(
        files.uploadVideos,
        'uploadVideos/',
      );

      if (!videos || videos.length === 0) {
        throw new AppError(400, 'Video upload failed');
      }

      const updateHireCreator = await HireCreator.findByIdAndUpdate(
        id,
        { uploadedFiles: videos, status: 'completed' },
        { new: true },
      );

      if (!updateHireCreator) {
        throw new AppError(403, 'Failed to update HireCreator');
      }
      if (updateHireCreator) {
        const allVideo = files.uploadVideos.map(
          (video: any) => `${video.path}`,
        );
        await Promise.all(allVideo.map((path: any) => unlink(path)));
      }

      return updateHireCreator;
    }
  } catch (error: any) {
    try {
      const allVideo = files?.uploadVideos?.map(
        (video: any) => `${video.path}`,
      );
      await Promise.all(allVideo?.map((path: any) => unlink(path)));
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
      throw new AppError(
        error.statusCode || 500,
        error.message || 'An error occurred while processing the request',
      );
    }
    throw error;
  }
};


const creatorPaymentByAdmin = async (
  id: string,
) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const assignCreator: any = await AssignTaskCreator.findById(id);
  if (!assignCreator) {
    throw new AppError(404, 'AssignCreator is not found!!');
  }
  if (assignCreator.paymentStatus === 'paid') {
    throw new AppError(404, 'AssignCreator is already paid!!');
  }

  const hireCreator: any = await HireCreator.findById(assignCreator.hireCreatorId);
  if (!hireCreator) {
    throw new AppError(404, 'Hire Creator is not found!!');
  }

  if (hireCreator.status !== 'delivered') {
    throw new AppError(404, 'HireCreator is not delivered!!');
  }

  const paymentAssignCreator = await AssignTaskCreator.findByIdAndUpdate(
    id,
    { paymentStatus: 'paid' },
    { new: true },
  );
  if (!paymentAssignCreator) {
    throw new AppError(403, 'Failed to update AssignCreator!');
  }
  return paymentAssignCreator;

};

const deleteSingleHireCreatorVideoDeleteByCreator = async (
  id: string,
  userId: string,
  payload: any,
) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const assignTaskCreator = await AssignTaskCreator.findOne({
    _id: id,
    creatorUserId: userId,
  });
  if (!assignTaskCreator) {
    throw new AppError(404, 'assignTaskCreator Not Found!!');
  }

  // if (hireCreator.creatorUserId?.toString() !== userId.toString()) {
  //   throw new AppError(404, 'You are a not valid creator!!');
  // }

  const key = payload.videourl.split('amazonaws.com/')[1];
  console.log('key', key);

  const videoDoc = await AssignTaskCreator.findOne({
    'uploadedFiles.url': payload.videourl,
  });

  console.log('videoDoc', videoDoc);

  if (!videoDoc) {
    throw new AppError(httpStatus.NOT_FOUND, 'Video not found in the database');
  }

  const deleteImage: any = await deleteFromS3(key);
  console.log('deleteImage', deleteImage);

  console.log('videoDoc', videoDoc);

  if (deleteImage) {
    const updatedDoc = await AssignTaskCreator.findOneAndUpdate(
      { 'uploadedFiles.url': payload.videourl },
      {
        $pull: { uploadedFiles: { url: payload.videourl } },
        status: 'approved',
      },
      { new: true },
    );
    console.log('updatedDoc', updatedDoc);

    return updatedDoc;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'Video not found in the database');
  }
};

const deletedAssignTaskCreatorQuery = async (id: string, userId: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const assignTaskCreator = await AssignTaskCreator.findOne({
    _id: id,
    creatorUserId: userId,
  });

  if (!assignTaskCreator) {
    throw new AppError(
      404,
      'AssignTaskCreator Not Found or Unauthorized Access',
    );
  }

  if (assignTaskCreator.status !== 'cancel') {
    throw new AppError(
      404,
      'AssignTaskCreator is not cancel, cannot be deleted',
    );
  }

  const result = await AssignTaskCreator.deleteOne({
    _id: id,
    creatorUserId: userId,
  });
  if (result.deletedCount === 0) {
    throw new AppError(
      404,
      'AssignTaskCreator not deleted or Result Not Found',
    );
  }

  return result;
};

export const assignTaskCreatorService = {
  createAssignTaskCreator,
  finallyCreateAssignBrandCreator,
  getAllAssignTaskCreatorQuery,
  getAllAssignTaskCreatorOfUserQuery,
  getAssignTaskCreatorByUser,
  getSingleAssignTaskCreatorQuery,
  getSingleAssignTaskCreatorVideo,
  getSingleHireCreatorToAssignTaskCreator,
  singleAssignTaskCreatorApprovedCancelQuery,
  multipleAssignTaskCreatorApprovedByAdmin,
  // assignTaskCreatorUploadVideosByCreator,
  // assignTaskRevisionByUser,
  // assignTaskCreatorReSubmitUploadVideosByCreator,
  assignTaskCreatorUploadVideosByCreator,
  assignTaskCreatorReSubmitUploadVideosByCreator,
  creatorPaymentByAdmin,
  deleteSingleHireCreatorVideoDeleteByCreator,
  deletedAssignTaskCreatorQuery,
};
