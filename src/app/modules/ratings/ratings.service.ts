import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.models';
import { TReview } from './ratings.interface';
import { Review } from './ratings.model';
import HireCreator from '../hireCreator/hireCreator.model';
// import Business from '../business/business.model';

// const createReviewService = async (userId: string, payload: TReview) => {
//   try {
//     if(!payload.hireCreatorId) {
//       throw new AppError(400, 'Hire Creator ID is required');
//     }
//     // console.log('Payload:', payload);
//     const user = await User.findById(userId);
//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
//     }
//     const hireCreator = await HireCreator.findById(payload.hireCreatorId);
//     if (!hireCreator) {
//       throw new AppError(httpStatus.NOT_FOUND, 'hireCreator not found!');
//     }
//     // console.log({ business });

//     const result = await Review.create(payload);

//     if (!result) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         'Failed to add Business review!',
//       );
//     }
//     // console.log({ result });

//     if(user.role === 'user') {

//       if(hireCreator.userReviewStatus){
//         throw new AppError(400, 'User already reviewed');
//       }

//       if (userId !== hireCreator.userId.toString()) {
//         throw new AppError(400, 'You are not brand owner');
//       }



//       const creator = await User.findById(hireCreator.creatorUserId);
//       if (!creator) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Creator not found!');
//       }

//       let { reviews, rating } = creator;
//       const newRating = (rating * reviews + result.rating) / (reviews + 1);
//       const updatedRegistration = await User.findByIdAndUpdate(
//         creator._id,
//         {
//           reviews: reviews + 1,
//           rating: newRating,
//         },
//         { new: true },
//       );
  
//       if (!updatedRegistration) {
//         throw new AppError(
//           httpStatus.INTERNAL_SERVER_ERROR,
//           'Failed to update Business Ratings!',
//         );
//       }

//       const updatHirecreator = await HireCreator.findByIdAndUpdate(
//         hireCreator._id,
//         {
//           userReviewStatus: true
//         },
//         {
//           new: true,
//         },
//       );

     

//     }else{

//       if(hireCreator.creatorReviewStatus){
//         throw new AppError(400, 'Creator already reviewed');
//       }

//       if (userId !== hireCreator.creatorUserId.toString()) {
//         throw new AppError(400, 'You are not valid creator for this hire creator');
//       }


//        const brandUser = await User.findById(hireCreator.userId);
//        if (!brandUser) {
//          throw new AppError(httpStatus.NOT_FOUND, 'brandUser not found!');
//        }

//      let { reviews, rating } = brandUser;
//      const newRating = (rating * reviews + result.rating) / (reviews + 1);

//       const updatedUser = await User.findByIdAndUpdate(
//         brandUser._id,
//         {
//           reviews: reviews + 1,
//           rating: newRating,
//         },
//         { new: true },
//       );

//       if (!updatedUser) {
//         throw new AppError(
//           httpStatus.INTERNAL_SERVER_ERROR,
//           'Failed to update Business Ratings!',
//         );
//       }

//       const updatHirecreator = await HireCreator.findByIdAndUpdate(
//         hireCreator._id,
//         {
//           creatorReviewStatus: true,
//         },
//         {
//           new: true,
//         },
//       );

//     }

    

//     return result;
//   } catch (error) {
//     console.error('Error creating review:', error);

//     if (error instanceof AppError) {
//       throw error;
//     }

//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       'An unexpected error occurred while creating the review.',
//     );
//   }
// };

const createReviewService = async (userId: string, payload: any) => {
  try {
    if (!payload.hireCreatorId) {
      throw new AppError(400, 'Hire Creator ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const hireCreator:any = await HireCreator.findById(payload.hireCreatorId);
    if (!hireCreator) {
      throw new AppError(httpStatus.NOT_FOUND, 'HireCreator not found!');
    }

    let targetUserId: string; 
    let reviewFieldToUpdate: 'userReviewStatus' | 'creatorReviewStatus';

    if (user.role === 'user') {
      if (hireCreator.userReviewStatus) {
        throw new AppError(400, 'You have already reviewed this hireCreator.');
      }
     
      if (userId !== hireCreator.userId.toString()) {
        throw new AppError(
          400,
          'You are not the brand owner of this hireCreator.',
        );
      }

      targetUserId = hireCreator.creatorUserId.toString();
      reviewFieldToUpdate = 'userReviewStatus';
      payload.userId = userId;
      payload.creatorId = hireCreator.creatorUserId;
    } else {
      if (hireCreator.creatorReviewStatus) {
        throw new AppError(400, 'You have already reviewed this hireCreator.');
      }

      if (userId !== hireCreator.creatorUserId.toString()) {
        throw new AppError(400, 'You are not the creator of this hireCreator.');
      }

      targetUserId = hireCreator.userId.toString();
      reviewFieldToUpdate = 'creatorReviewStatus';
       payload.userId = hireCreator.userId;
       payload.creatorId = userId;
    }

    const review = await Review.create(payload);
    if (!review) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create review.');
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Target user not found!');
    }

    const newRating =
      (targetUser.rating * targetUser.reviews + review.rating) /
      (targetUser.reviews + 1);

    await User.findByIdAndUpdate(
      targetUser._id,
      {
        $inc: { reviews: 1 },
        rating: newRating,
      },
      { new: true },
    );

    await HireCreator.findByIdAndUpdate(hireCreator._id, {
      [reviewFieldToUpdate]: true,
    });

    return review;
  } catch (error) {
    console.error('Error creating review:', error);

    if (error instanceof AppError) throw error;

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred while creating the review.',
    );
  }
};


const getAllReviewByBusinessQuery = async (
  query: Record<string, unknown>,
  businessId: string,
) => {
  const reviewQuery = new QueryBuilder(
    Review.find({ businessId }).populate('businessId').populate('customerId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();
  return { meta, result };
};

const getSingleReviewQuery = async (id: string) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new AppError(404, 'Review Not Found!!');
  }
  const result = await Review.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
  ]);
  if (result.length === 0) {
    throw new AppError(404, 'Review not found!');
  }

  return result[0];
};

const updateReviewQuery = async (
  id: string,
  payload: Partial<TReview>,
  customerId: string,
) => {
  if (!id || !customerId) {
    throw new AppError(400, 'Invalid input parameters');
  }

  const result = await Review.findOneAndUpdate(
    { _id: id, customerId: customerId },
    payload,
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(404, 'Review Not Found or Unauthorized Access!');
  }
  return result;
};

const deletedReviewQuery = async (id: string, customerId: string) => {
  // if (!id || !customerId) {
  //   throw new AppError(400, 'Invalid input parameters');
  // }

  // const result = await Review.findOneAndDelete({
  //   _id: id,
  //   customerId: customerId,
  // });

  // if (!result) {
  //   throw new AppError(404, 'Review Not Found!');
  // }

  // const business = await Business.findById(result.businessId);
  // if (!business) {
  //   throw new AppError(404, 'Business not found!');
  // }

  // const { reviewCount, ratings } = business;
  // // console.log('reviewCount ratingCount', reviewCount, ratings);
  // // console.log('result.rating', result.rating);

  // const newRatingCount = ratings - result.rating;
  // // console.log('newRatingCount', newRatingCount);
  // const newReviewCount = reviewCount - 1;
  // // console.log('newReviewCount', newReviewCount);

  // let newAverageRating = 0;
  // // console.log('newAverageRating', newAverageRating);
  // if (newReviewCount > 0) {
  //   newAverageRating = newRatingCount / newReviewCount;
  // }

  // if (newReviewCount <= 0) {
  //   newAverageRating = 0;
  // }

  // // console.log('newAverageRating-2', newAverageRating);

  // const updateRatings = await Business.findByIdAndUpdate(
  //   business._id,
  //   {
  //     reviewCount: newReviewCount,
  //     ratings: newAverageRating,
  //   },
  //   { new: true },
  // );

  // if (!updateRatings) {
  //   throw new AppError(500, 'Failed to update Business Ratings!');
  // }

  // return result;
};

export const reviewService = {
  createReviewService,
  getAllReviewByBusinessQuery,
  getSingleReviewQuery,
  updateReviewQuery,
  deletedReviewQuery,
};
