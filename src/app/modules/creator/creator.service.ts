import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCreator } from './creator.interface';
import Creator from './creator.model';
import { deleteFromS3, deleteManyFromS3, uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { access, unlink } from 'fs/promises';
import { User } from '../user/user.models';
import mongoose from 'mongoose';
import { populate } from 'dotenv';
import { imageUrlGenarate } from '../../utils/imageUrl';
// import redisClient from '../../utils/redis';
import { CLIENT_RENEG_LIMIT } from 'tls';

const createCreator = async (files: any, payload: TCreator) => {
  const session = await mongoose.startSession(); 
  session.startTransaction(); 

  try {
    console.log('Creator payload=', payload);
    console.log('Creator files=', files);

    if(!payload.email || !payload.password || !payload.fullName){
      throw new AppError(
        403,
        'Email, Password, Full Name, profile is required',
      );
    }

    if (!files) {
      throw new AppError(403, 'At least one File is required');
    }

    const existCreator = await User.findOne({ email: payload.email });
    if (existCreator) {
      throw new AppError(403, 'Creator already exist');
    } 

    // buffer convert

    if (files && files?.introductionvideo && files?.introductionvideo?.length > 0) {
      const introductionVideo: any = await uploadToS3({
        file: files.introductionvideo[0],
        fileName: files.introductionvideo[0].originalname,
        folder: 'videos/',
      });
      payload.introductionvideo = introductionVideo;
    }

    if (files?.ugcExampleVideo && files?.ugcExampleVideo?.length > 0) {
      const ugcExampleVideo: any = await uploadManyToS3(files.ugcExampleVideo, 'videos/');
      payload.ugcExampleVideo = ugcExampleVideo;
    }
const userData:any = {
  password: payload.password,
  email: payload.email,
  fullName: payload.fullName,
  role: 'creator',
};
   

     if (files?.profile && files?.profile?.length > 0) {
       console.log('hit hise');
       const profile: any = await uploadToS3({
         file: files.profile[0],
         fileName: files.profile[0].originalname,
         folder: 'profiles/',
       });
       userData.profile = profile;
     }

    console.log('payload', payload);

    

    const user = await User.create([userData], { session }); 
    payload.userId = new mongoose.Types.ObjectId(user[0]._id);
    const result = await Creator.create([payload], { session }); 

    

    if (result) {
      const fileDeletePath = `${files.introductionvideo[0].path}`;
      await unlink(fileDeletePath);
      const allVideo = files.ugcExampleVideo.map(
        (video: any) => `${video.path}`,
      );
      await Promise.all(allVideo.map((path: any) => unlink(path)));
    }
    if (files?.profile && files?.profile?.length > 0) {
      const fileDeletePath = `${files.profile[0].path}`;
      await unlink(fileDeletePath);
      
    }

    await session.commitTransaction();

    return result[0];
  } catch (error : any) {
    console.log('error----', error);
    if (files?.profile && files?.profile?.length > 0) {
      const profileDeletePath = `${files.profile[0].path}`;
      await unlink(profileDeletePath);
       const key = `profiles/${files.profile[0].originalname}`;
       await deleteFromS3(key);

    }

    if (files?.introductionvideo && files?.ugcExampleVideo) {
       const allVideo = files.ugcExampleVideo.map(
         (video: any) => `${video.path}`,
       );
       await Promise.all(allVideo.map((path: any) => unlink(path)));

       const key = `videos/${files.introductionvideo[0].originalname}`;
       await deleteFromS3(key);

       await Promise.all(
         files.ugcExampleVideo.map((video: any) => {
           const videoKey = `videos/${video.originalname}`;
           return deleteFromS3(videoKey);
         }),
       );
    }
  
   

    throw error;
  
  } finally {
    session.endSession();
  }
};


const getAllCreatorQuery = async (query: Record<string, unknown>) => {
  // const cachedCreator = await redisClient.get('creators');
  // if (cachedCreator) {
  //   return JSON.parse(cachedCreator); // Return cached result
  // }
  const CreatorQuery = new QueryBuilder(
    Creator.find().populate({path:'userId', select:"profile fullName"}).select(
      'accountHolderName phone email country status',
    ),
    query,
  )
    .search(['phone', 'email', 'country'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CreatorQuery.modelQuery;

  const meta = await CreatorQuery.countTotal();

  const responseData = { meta, result };

//   await redisClient.set('creators', JSON.stringify(responseData),
//   //  {
//   //   EX: 600, // optional: set expire in seconds (600s = 10 mins)
//   // }
// );

  return responseData;
};
const getCreatorMeQuery = async (userId: string) => {
  console.log('me hit hoise');
  // const cachedCreator = await redisClient.get('creator');
  // if (cachedCreator) {
  //   return JSON.parse(cachedCreator); // Return cached result
  // }
  const result:any = await Creator.findOne({ userId }).populate({
    path: 'userId',
    select: 'profile fullName email phone',
  });
  if(!result){
    throw new AppError(404, 'Creator Not Found!!');
  }
  // await redisClient.set(
  //   'creator',
  //   JSON.stringify(result),
  //   //  {
  //   //   EX: 600, // optional: set expire in seconds (600s = 10 mins)
  //   // }
  // );
   const newResult = {
     ...result.toObject(),
     fullName: result?.userId?.fullName,
     profile: result?.userId?.profile,
     email: result?.userId?.email,
     phone: result?.userId?.phone
   };
  //  console.log('newResult =->>>>', newResult);
  return newResult;
};

const getSingleCreatorQuery = async (id: string) => {
  console.log('hit hoise!!');
  // const cachedCreatorme = await redisClient.get(`creatorMe${id}`);
  // if (cachedCreatorme) {
  //   return JSON.parse(cachedCreatorme); // Return cached result
  // }
  const creator: any = await Creator.findById(id).populate({
    path: 'userId',
    select: 'profile fullName email phone',
  });
  if (!creator) {
    throw new AppError(404, 'Creator Not Found!!');
  }
 
  // await redisClient.set(
  //   `creatorMe${id}`,
  //   JSON.stringify(creator),
  //   //  {
  //   //   EX: 600, // optional: set expire in seconds (600s = 10 mins)
  //   // }
  // );
  const newResult = {
    ...creator.toObject(),
    fullName: creator?.userId?.fullName,
    profile: creator?.userId?.profile,
    email: creator?.userId?.email,
    phone: creator?.userId?.phone,
  };
  return newResult;
};



const updateSingleCreatorQuery = async (userId: string, files:any, payload: any) => {
  console.log('userId', userId);
  console.log('updated payload', payload);

  console.log('file.length', files);


  try {

    const userExist = await User.findById(userId);

    if(!userExist){
      throw new AppError(404, 'User is not found!');
    }

    const creatorProduct: any = await Creator.findOne({userId});
    if (!creatorProduct) {
      throw new AppError(404, 'Creator is not found!');
    }


    if (files && files?.introductionvideo && files?.introductionvideo?.length > 0) {
      const introductionVideo: any = await uploadToS3({
        file: files.introductionvideo[0],
        fileName: files.introductionvideo[0].originalname,
        folder: 'videos/',
      });
      payload.introductionvideo = introductionVideo;
    }

    if (files && files?.ugcExampleVideo && files?.ugcExampleVideo?.length > 0) {
      const ugcExampleVideo: any = await uploadManyToS3(
        files.ugcExampleVideo,
        'videos/',
      );
      payload.ugcExampleVideo = ugcExampleVideo;
    }

    if (files && files?.profile && files?.profile?.length > 0) {
      const image = files.profile[0].path.replace(/^public[\\/]/, '');
      payload.profile = imageUrlGenarate(image);
    }

    const userUpdate = await User.findByIdAndUpdate(userId, {fullName: payload.fullName, profile:payload.profile, phone:payload.phone}, {new:true})
    console.log('userUpdate', userUpdate);


    const result = await Creator.findOneAndUpdate({userId}, payload, { new: true });
    console.log('result', result);
    if (!result) {
      throw new AppError(403, 'Creator updated faild!!');
    }

    

    if (files) {
      if (files.introductionvideo && files.introductionvideo.length > 0) {
        const fileDeletePath = `${files.introductionvideo[0].path}`;
        await unlink(fileDeletePath);
      }

      if (files.ugcExampleVideo && files.ugcExampleVideo.length > 0) {
        const allVideo = files.ugcExampleVideo.map((video:any) => `${video.path}`);
        await Promise.all(allVideo.map((path:any) => unlink(path)));
      }
    }
    

    return result;
    
  } catch (error) {

    console.log('error----', error);
    const fileDeletePath = `${files.introductionvideo[0].path}`;
    await unlink(fileDeletePath);
    const profileDeletePath = `${files.profile[0].path}`;
    await unlink(profileDeletePath);

    const allVideo = files.ugcExampleVideo.map((video: any) => `${video.path}`);
    await Promise.all(allVideo.map((path: any) => unlink(path)));

    const key = `videos/${files.introductionvideo[0].originalname}`;
    await deleteFromS3(key);

    await Promise.all(
      files.ugcExampleVideo.map((video: any) => {
        const videoKey = `videos/${video.originalname}`;
        return deleteFromS3(videoKey);
      }),
    );

    throw error;
    
  }
};


const approvedCancelSingleCreator = async (id: string, status: string) => {
  console.log('id', id);
  console.log('updated status', status);
  const creator: any = await Creator.findById(id);
  if (!creator) {
    throw new AppError(404, 'Creator is not found!');
  }
  if (creator.status === 'approved') {
    throw new AppError(404, 'Creator is already approved!');
  }
  const newStatus = status === 'approved' ? 'approved' : 'cancel';
  const result = await Creator.findByIdAndUpdate(
    id,
    { status: newStatus },
    { new: true },
  );

  if (!result) {
    throw new AppError(403, 'Creator updated faild!!');
  }

  return result;
};

const deletedCreatorQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const creator = await Creator.findById(id);
  if (!creator) {
    throw new AppError(404, 'Creator Not Found!!');
  }

  const result = await Creator.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Creator Result Not Found !');
  }

  return result;
};

export const creatorService = {
  createCreator,
  getAllCreatorQuery,
  getCreatorMeQuery,
  getSingleCreatorQuery,
  updateSingleCreatorQuery,
  approvedCancelSingleCreator,
  deletedCreatorQuery,
};
