import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import {
  deleteFromS3,
  deleteManyFromS3,
  uploadManyToS3,
  uploadToS3,
} from '../../utils/s3';
import { access, unlink } from 'fs/promises';
import { User } from '../user/user.models';
import HireCreator from './hireCreator.model';
import Package from '../package/package.model';
import Subscription from '../subscription/subscription.model';
import { subscriptionService } from '../subscription/subscription.service';
import { paymentService } from '../payment/payment.service';
import mongoose from 'mongoose';
import { Payment } from '../payment/payment.model';
import { notificationService } from '../notification/notification.service';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { configDotenv } from 'dotenv';
import AssignTaskCreator from '../assignTaskCreator/assignTaskCreator.model';

// const createHireCreator = async ( payload: any) => {

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();
//     console.log('HireCreator payload=', payload);
//     if (!payload.packageId) {
//       throw new AppError(403, 'Package Id is required');
//     }

//     const packageExist = await Package.findById(payload.packageId).session(
//       session,
//     );
//     console.log('packageExist=', packageExist);
//     if (!packageExist) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
//     }
//     const user = await User.findById(payload.userId).session(session);
//     if (!user) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
//     }

//     if (packageExist.type === 'yearly' || packageExist.type === 'monthly') {
//       console.log('subscription');
//       if (!payload.takeVideoCount) {
//         throw new AppError(403, 'Take video count required!!');
//       }
//       const existingSubscription = await Subscription.findOne({
//         userId: payload.userId,
//         type: packageExist.type,
//         isDeleted: false,
//       }).session(session);

//       console.log('existingSubscription', existingSubscription);

//       if (existingSubscription) {
//         const runningubscription: any = await Subscription.findOne({
//           userId: payload.userId,
//           isDeleted: false,
//           endDate: { $gt: new Date() },
//           $expr: { $lt: ['$takeVideoCount', '$videoCount'] },
//         }).session(session);

//         if (!runningubscription) {
//           throw new AppError(
//             403,
//             'Your subscription has expired. Please renew your subscription to continue.',
//           );
//         }

//         if (
//           Number(runningubscription.takeVideoCount) +
//             Number(payload.takeVideoCount) >
//           Number(runningubscription.videoCount)
//         ) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'You have already reached the maximum video count for this package.',
//           );
//         }

//         if (runningubscription) {
//           console.log('running');

//           // if (files.ugcPhoto && files.ugcPhoto.length > 0) {
//           //   const ugcPhoto: any = await uploadToS3({
//           //     file: files.ugcPhoto[0],
//           //     fileName: files.ugcPhoto[0].originalname,
//           //     folder: 'ugcImage/',
//           //   });
//           //   payload.contentInfo.ugcPhoto = ugcPhoto;
//           // }

//           payload.subscriptionId = runningubscription._id;

//           const hireCreatorData = {
//             userId: payload.userId,
//             subscriptionId: payload.subscriptionId,
//             brandInfo: {
//               name: payload.brandInfo.name,
//               email: payload.brandInfo.email,
//               phone: payload.brandInfo.phone,
//               productName: payload.brandInfo.productName,
//               websiteUrl: payload.brandInfo.websiteUrl,
//               isScript: payload.brandInfo.isScript,
//               isVideoCaption: payload.brandInfo.isVideoCaption,
//             },
//             brandSocial: {
//               tiktokHandle: payload.brandSocial.tiktokHandle,
//               tiktokLink: payload.brandSocial.tiktokLink,
//               instragramHandle: payload.brandSocial.instragramHandle,
//               instragramLink: payload.brandSocial.instragramLink,
//               othersSocialLink: payload.brandSocial.othersSocialLink,
//             },
//             videoInfo: {
//               productName: payload.videoInfo.productName,
//               productLink: payload.videoInfo.productLink,
//               productType: payload.videoInfo.productType,
//               videoType: payload.videoInfo.videoType,
//               videoLink: payload.videoInfo.videoLink,
//               videoLanguage: payload.videoInfo.videoLanguage,
//               specificWordsOrFeatures:
//                 payload.videoInfo.specificWordsOrFeatures,
//               projectGoal: payload.videoInfo.projectGoal,
//             },
//             characteristicInfo: {
//               ageRange: payload.characteristicInfo.ageRange,
//               gender: payload.characteristicInfo.gender,
//               creatorLocation: payload.characteristicInfo.creatorLocation,
//               anySpecialRequest: payload.characteristicInfo.anySpecialRequest,
//               targetAudience: payload.characteristicInfo.targetAudience,
//               targetAudienceAgeGroup:
//                 payload.characteristicInfo.targetAudienceAgeGroup,
//               productSolveForThem:
//                 payload.characteristicInfo.productSolveForThem,
//               topPerformingAdsLast30Days:
//                 payload.characteristicInfo.topPerformingAdsLast30Days,
//             },
//             addOns: {
//               isExtraHook: payload.addOns.isExtraHook,
//               isExtraCta: payload.addOns.isExtraCta,
//               isRowFootagePerConcept: payload.addOns.isRowFootagePerConcept,
//               isOffSiteFilming: payload.addOns.isOffSiteFilming,
//               isUgc5Photos: payload.addOns.isUgc5Photos,
//               isExpressDelivery: payload.addOns.isExpressDelivery,
//               isFilmingEssentials: payload.addOns.isFilmingEssentials,
//               isAdditionalPerson: payload.addOns.isAdditionalPerson,
//             },

//             takeVideoCount: payload.takeVideoCount,
//           };

//           const result = await HireCreator.create([hireCreatorData], {
//             session,
//           });
//           if (!result) {
//             throw new AppError(403, 'HireCreator created faild!!');
//           }

//           const updateTakeVideoCount =
//             Number(runningubscription.takeVideoCount) +
//             Number(result[0].takeVideoCount);

//           const updateSubscription = await Subscription.findOneAndUpdate(
//             {
//               _id: runningubscription._id,
//             },
//             { status: 'running' , takeVideoCount: updateTakeVideoCount },
//             { new: true, session },
//           );

//           if (!updateSubscription) {
//             throw new AppError(403, 'Subscription update faild!!');
//           }

//           const updateHireCreator = await HireCreator.findOneAndUpdate(
//             {
//               _id: result[0]?._id,
//             },
//             { status: 'pending', paymentStatus:"paid" },
//             { new: true, session },
//           );

//           if(!updateHireCreator){
//             throw new AppError(403, 'HireCreator update faild!!');
//           }

//           await session.commitTransaction();
//           session.endSession();

//           return result;
//         }
//       } else {
//         console.log('create subscriptioin');

//         // if (files.ugcPhoto && files.ugcPhoto.length > 0) {
//         //   const ugcPhoto: any = await uploadToS3({
//         //     file: files.ugcPhoto[0],
//         //     fileName: files.ugcPhoto[0].originalname,
//         //     folder: 'ugcImage/',
//         //   });
//         //   payload.contentInfo.ugcPhoto = ugcPhoto;
//         // }

//         // const runningPackage = await Subscription.findOne({
//         //   userId: payload.userId,
//         //   isDeleted: false,
//         //   type:"one_time",
//         //   status: 'pending',
//         // });

//         // if (runningPackage) {
//         //   throw new AppError(
//         //     httpStatus.BAD_REQUEST,
//         //     'You currently have an active package. Please use this package before purchasing a new subscription.',
//         //   );
//         // }

//         const subscriptionData = {
//           packageId: packageExist._id,
//           userId: payload.userId,
//         };

//         const subcriptionResult: any =
//           await subscriptionService.createSubscription(
//             subscriptionData,
//             session,
//           );

//         if (!subcriptionResult) {
//           throw new AppError(403, 'Subscription created faild!!');
//         }
//         console.log('subcriptionResult==', subcriptionResult);
//         if (
//           Number(subcriptionResult.takeVideoCount) +
//             Number(payload.takeVideoCount) >
//           Number(subcriptionResult.videoCount)
//         ) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'You have already reached the maximum video count for this package.',
//           );
//         }

//         payload.subscriptionId = subcriptionResult._id;

//         const hireCreatorData = {
//           userId: payload.userId,
//           subscriptionId: payload.subscriptionId,
//           brandInfo: {
//             name: payload.brandInfo.name,
//             email: payload.brandInfo.email,
//             phone: payload.brandInfo.phone,
//             productName: payload.brandInfo.productName,
//             websiteUrl: payload.brandInfo.websiteUrl,
//             isScript: payload.brandInfo.isScript,
//             isVideoCaption: payload.brandInfo.isVideoCaption,
//           },
//           brandSocial: {
//             tiktokHandle: payload.brandSocial.tiktokHandle,
//             tiktokLink: payload.brandSocial.tiktokLink,
//             instragramHandle: payload.brandSocial.instragramHandle,
//             instragramLink: payload.brandSocial.instragramLink,
//             othersSocialLink: payload.brandSocial.othersSocialLink,
//           },
//           videoInfo: {
//             productName: payload.videoInfo.productName,
//             productLink: payload.videoInfo.productLink,
//             productType: payload.videoInfo.productType,
//             videoType: payload.videoInfo.videoType,
//             videoLink: payload.videoInfo.videoLink,
//             videoLanguage: payload.videoInfo.videoLanguage,
//             specificWordsOrFeatures: payload.videoInfo.specificWordsOrFeatures,
//             projectGoal: payload.videoInfo.projectGoal,
//           },
//           characteristicInfo: {
//             ageRange: payload.characteristicInfo.ageRange,
//             gender: payload.characteristicInfo.gender,
//             creatorLocation: payload.characteristicInfo.creatorLocation,
//             anySpecialRequest: payload.characteristicInfo.anySpecialRequest,
//             targetAudience: payload.characteristicInfo.targetAudience,
//             targetAudienceAgeGroup:
//               payload.characteristicInfo.targetAudienceAgeGroup,
//             productSolveForThem: payload.characteristicInfo.productSolveForThem,
//             topPerformingAdsLast30Days:
//               payload.characteristicInfo.topPerformingAdsLast30Days,
//           },
//           addOns: {
//             isExtraHook: payload.addOns.isExtraHook,
//             isExtraCta: payload.addOns.isExtraCta,
//             isRowFootagePerConcept: payload.addOns.isRowFootagePerConcept,
//             isOffSiteFilming: payload.addOns.isOffSiteFilming,
//             isUgc5Photos: payload.addOns.isUgc5Photos,
//             isExpressDelivery: payload.addOns.isExpressDelivery,
//             isFilmingEssentials: payload.addOns.isFilmingEssentials,
//             isAdditionalPerson: payload.addOns.isAdditionalPerson,
//           },

//           takeVideoCount: payload.takeVideoCount,
//         };
//         const result = await HireCreator.create([hireCreatorData], { session });
//         if (!result) {
//           throw new AppError(403, 'HireCreator created faild!!');
//         }

//         if (result.length > 0) {
//           const paymentData = {
//             userId: payload.userId,
//             amount: subcriptionResult.price,
//             orderId: result[0]._id,
//           };

//           const paymentUrl =
//             paymentService.createPaypalPaymentService(paymentData);

//           await session.commitTransaction();
//           session.endSession();

//           return paymentUrl;
//         }
//       }
//     } else {
//       console.log('package ');

//       // return;
//       const runningubscription = await Subscription.findOne({
//         userId: payload.userId,
//         isDeleted: false,
//         endDate: { $gt: new Date() },
//         $expr: { $lt: ['$takeVideoCount', '$videoCount'] },
//       }).session(session);

//       // if (runningubscription) {
//       //   throw new AppError(400, 'Your Subscription is already running!');
//       // }

//       const runningPackage:any = await Subscription.findOne({
//         type: 'one_time',
//         userId: payload.userId,
//         packageId: packageExist._id,
//         isDeleted: false,
//         status:"pending"
//       })
//       console.log('runningPackage==', runningPackage);

//       if (runningPackage) {

//         const alreadyCreateHireCreatorBySubscriptionId =
//           await HireCreator.findOne({
//             subscriptionId: runningPackage._id,
//           });

//         if (alreadyCreateHireCreatorBySubscriptionId) {
//           throw new AppError(
//             400,
//             'You have already created a hire creator for this package.',
//           );
//         }

//       payload.subscriptionId = runningPackage._id;

//       const hireCreatorData = {
//         userId: payload.userId,
//         subscriptionId: payload.subscriptionId,
//         brandInfo: {
//           name: payload.brandInfo.name,
//           email: payload.brandInfo.email,
//           phone: payload.brandInfo.phone,
//           productName: payload.brandInfo.productName,
//           websiteUrl: payload.brandInfo.websiteUrl,
//           isScript: payload.brandInfo.isScript,
//           isVideoCaption: payload.brandInfo.isVideoCaption,
//         },
//         brandSocial: {
//           tiktokHandle: payload.brandSocial.tiktokHandle,
//           tiktokLink: payload.brandSocial.tiktokLink,
//           instragramHandle: payload.brandSocial.instragramHandle,
//           instragramLink: payload.brandSocial.instragramLink,
//           othersSocialLink: payload.brandSocial.othersSocialLink,
//         },
//         videoInfo: {
//           productName: payload.videoInfo.productName,
//           productLink: payload.videoInfo.productLink,
//           productType: payload.videoInfo.productType,
//           videoType: payload.videoInfo.videoType,
//           videoLink: payload.videoInfo.videoLink,
//           videoLanguage: payload.videoInfo.videoLanguage,
//           specificWordsOrFeatures: payload.videoInfo.specificWordsOrFeatures,
//           projectGoal: payload.videoInfo.projectGoal,
//         },
//         characteristicInfo: {
//           ageRange: payload.characteristicInfo.ageRange,
//           gender: payload.characteristicInfo.gender,
//           creatorLocation: payload.characteristicInfo.creatorLocation,
//           anySpecialRequest: payload.characteristicInfo.anySpecialRequest,
//           targetAudience: payload.characteristicInfo.targetAudience,
//           targetAudienceAgeGroup:
//             payload.characteristicInfo.targetAudienceAgeGroup,
//           productSolveForThem: payload.characteristicInfo.productSolveForThem,
//           topPerformingAdsLast30Days:
//             payload.characteristicInfo.topPerformingAdsLast30Days,
//         },
//         addOns: {
//           isExtraHook: payload.addOns.isExtraHook,
//           isExtraCta: payload.addOns.isExtraCta,
//           isRowFootagePerConcept: payload.addOns.isRowFootagePerConcept,
//           isOffSiteFilming: payload.addOns.isOffSiteFilming,
//           isUgc5Photos: payload.addOns.isUgc5Photos,
//           isExpressDelivery: payload.addOns.isExpressDelivery,
//           isFilmingEssentials: payload.addOns.isFilmingEssentials,
//           isAdditionalPerson: payload.addOns.isAdditionalPerson,
//         },

//         takeVideoCount: payload.takeVideoCount,
//       };
//       console.log('hireCreatorData package data', hireCreatorData);

//       console.log('dsafafaafasfasfasfa')

//       const result = await HireCreator.create([hireCreatorData], { session });
//       console.log('result', result);
//       if (!result) {
//         throw new AppError(403, 'HireCreator created faild!!');
//       }

//       const updateSubscription = await Subscription.findOneAndUpdate(
//         {
//           _id: runningPackage._id,
//         },
//         { status: 'running', takeVideoCount: runningPackage.videoCount },
//         { new: true, session },
//       );

//       if (!updateSubscription) {
//         throw new AppError(403, 'Subscription update faild!!');
//       }

//       const updateHireCreator = await HireCreator.findOneAndUpdate(
//         {
//           _id: result[0]?._id,
//         },
//         { status: 'pending', paymentStatus: 'paid' },
//         { new: true, session },
//       );

//       if (!updateHireCreator) {
//         throw new AppError(403, 'HireCreator update faild!!');
//       }

//         await session.commitTransaction();
//         session.endSession();

//         return result[0];
//       }else{

//         console.log('not running package')

//       const subscriptionData = {
//         packageId: packageExist?._id,
//         userId: payload.userId,
//       };

//       const subcriptionResult: any =
//         await subscriptionService.createSubscription(subscriptionData);

//       console.log('subcriptionResult==', subcriptionResult);
//       if (!subcriptionResult) {
//         throw new AppError(403, 'Subscription created faild!!');
//       }

//       payload.subscriptionId = subcriptionResult?._id;

//       const hireCreatorData = {
//         userId: payload.userId,
//         subscriptionId: payload.subscriptionId,
//         brandInfo: {
//           name: payload.brandInfo.name,
//           email: payload.brandInfo.email,
//           phone: payload.brandInfo.phone,
//           productName: payload.brandInfo.productName,
//           websiteUrl: payload.brandInfo.websiteUrl,
//           isScript: payload.brandInfo.isScript,
//           isVideoCaption: payload.brandInfo.isVideoCaption,
//         },
//         brandSocial: {
//           tiktokHandle: payload.brandSocial.tiktokHandle,
//           tiktokLink: payload.brandSocial.tiktokLink,
//           instragramHandle: payload.brandSocial.instragramHandle,
//           instragramLink: payload.brandSocial.instragramLink,
//           othersSocialLink: payload.brandSocial.othersSocialLink,
//         },
//         videoInfo: {
//           productName: payload.videoInfo.productName,
//           productLink: payload.videoInfo.productLink,
//           productType: payload.videoInfo.productType,
//           videoType: payload.videoInfo.videoType,
//           videoLink: payload.videoInfo.videoLink,
//           videoLanguage: payload.videoInfo.videoLanguage,
//           specificWordsOrFeatures: payload.videoInfo.specificWordsOrFeatures,
//           projectGoal: payload.videoInfo.projectGoal,
//         },
//         characteristicInfo: {
//           ageRange: payload.characteristicInfo.ageRange,
//           gender: payload.characteristicInfo.gender,
//           creatorLocation: payload.characteristicInfo.creatorLocation,
//           anySpecialRequest: payload.characteristicInfo.anySpecialRequest,
//           targetAudience: payload.characteristicInfo.targetAudience,
//           targetAudienceAgeGroup:
//             payload.characteristicInfo.targetAudienceAgeGroup,
//           productSolveForThem: payload.characteristicInfo.productSolveForThem,
//           topPerformingAdsLast30Days:
//             payload.characteristicInfo.topPerformingAdsLast30Days,
//         },
//         addOns: {
//           isExtraHook: payload.addOns.isExtraHook,
//           isExtraCta: payload.addOns.isExtraCta,
//           isRowFootagePerConcept: payload.addOns.isRowFootagePerConcept,
//           isOffSiteFilming: payload.addOns.isOffSiteFilming,
//           isUgc5Photos: payload.addOns.isUgc5Photos,
//           isExpressDelivery: payload.addOns.isExpressDelivery,
//           isFilmingEssentials: payload.addOns.isFilmingEssentials,
//           isAdditionalPerson: payload.addOns.isAdditionalPerson,
//         },

//         takeVideoCount: payload.takeVideoCount,
//       };

//       console.log('hireCreatorData package data', hireCreatorData);

//       console.log('dsafafaafasfasfasfa****');
//       console.log('dsafafaafasfasfasfa=====', hireCreatorData.subscriptionId);
//       const subscriptionId = new mongoose.Types.ObjectId(
//         hireCreatorData.subscriptionId,
//       );

//       const subscriptioinCompleted = await Subscription.findOne({
//         _id: subscriptionId,
//         status: 'completed',
//       }).session(session);

//       console.log('subscriptioinCompleted', subscriptioinCompleted);
//       if (subscriptioinCompleted) {
//         throw new AppError(403, 'Subscription already completed!!');
//       }
//       console.log('ddssasfaf======================');
//       console.log('ddssasfaf======================*****');
//       console.log('hireCreatorData======================', hireCreatorData);

//       const result = await HireCreator.create([hireCreatorData], { session });
//       console.log('result', result);
//       if (!result) {
//         throw new AppError(403, 'HireCreator created faild!!');
//       }

//       const paymentData = {
//         userId: payload.userId,
//         amount: subcriptionResult.price,
//         orderId: result[0]._id,
//       };
//       console.log('paymentData', paymentData);
//       let paymentUrl:any;

//       if(payload.method === "paypal"){
//          paymentUrl = await paymentService.createPaypalPaymentService(paymentData);

//       }else{
//         paymentUrl = await paymentService.createCheckout(payload.userId, paymentData);
//       }

//       console.log('paymentUrl', paymentUrl);

//       await session.commitTransaction();
//       session.endSession();

//       return paymentUrl;

//       }

//     }
//   } catch (error: any) {
//     await session.abortTransaction();
//     if (session.inTransaction()) {
//       // Using inTransaction() method to check if the session is in a transaction
//       await session.abortTransaction();
//     }

//   }
//   // finally {
//   //   session.endSession();
//   // }
// };

const createHireCreator = async (payload: any) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log('HireCreator payload=', payload);

    if (!payload.packageId) {
      throw new AppError(403, 'Package Id is required');
    }

    const packageExist = await Package.findById(payload.packageId).session(
      session,
    );
    // console.log('packageExist=', packageExist);

    if (!packageExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
    }

    const user = await User.findById(payload.userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }

    const subscriptionData = {
      packageId: packageExist._id,
      userId: payload.userId,
    };

    const subcriptionResult: any = await subscriptionService.createSubscription(
      subscriptionData,
      session,
    );

    // console.log('subcriptionResult==', subcriptionResult);
    if (!subcriptionResult) {
      throw new AppError(403, 'Subscription creation failed!!');
    }

    // Check if subscription is already completed
    const subscriptionId = new mongoose.Types.ObjectId(subcriptionResult._id);
    const subscriptioinCompleted = await Subscription.findOne({
      _id: subscriptionId,
      status: 'completed',
    }).session(session);

    // console.log('subscriptioinCompleted', subscriptioinCompleted);
    if (subscriptioinCompleted) {
      throw new AppError(403, 'Subscription already completed!!');
    }

    const hireCreatorData: any = {
      userId: payload.userId,
      subscriptionId: subcriptionResult._id,
      brandInfo: {
        name: payload.brandInfo?.name,
        email: payload.brandInfo?.email,
        phone: payload.brandInfo?.phone,
        productName: payload.brandInfo?.productName,
        websiteUrl: payload.brandInfo?.websiteUrl,
        brandPronounceName: payload.brandInfo?.brandPronounceName,
        isScript: payload.brandInfo?.isScript,
        isVideoCaption: payload.brandInfo?.isVideoCaption,
      },
      brandSocial: {
        tiktokHandle: payload.brandSocial?.tiktokHandle,
        tiktokLink: payload.brandSocial?.tiktokLink,
        instragramHandle: payload.brandSocial?.instragramHandle,
        instragramLink: payload.brandSocial?.instragramLink,
        othersSocialLink: payload.brandSocial?.othersSocialLink,
      },
      videoInfo: {
        productName: payload.videoInfo?.productName,
        productLink: payload.videoInfo?.productLink,
        productType: payload.videoInfo?.productType,
        videoType: payload.videoInfo?.videoType,
        videoLink: payload.videoInfo?.videoLink,
        videoLanguage: payload.videoInfo?.videoLanguage,
        specificWordsOrFeatures: payload.videoInfo?.specificWordsOrFeatures,
        specificWordsNotToUse: payload.videoInfo?.specificWordsNotToUse,
        projectGoal: payload.videoInfo?.projectGoal,
      },
      characteristicInfo: {
        ageRange: payload.characteristicInfo?.ageRange,
        gender: payload.characteristicInfo?.gender,
        creatorLocation: payload.characteristicInfo?.creatorLocation,
        anySpecialRequest: payload.characteristicInfo?.anySpecialRequest,
        targetAudience: payload.characteristicInfo?.targetAudience,
        targetAudienceAgeGroup:
          payload.characteristicInfo?.targetAudienceAgeGroup,
        productSolveForThem: payload.characteristicInfo?.productSolveForThem,
        topPerformingAdsLast30Days:
          payload.characteristicInfo?.topPerformingAdsLast30Days,
      },
      addOns: {
        isExtraHook: payload.addOns?.isExtraHook,
        isExtraCta: payload.addOns?.isExtraCta,
        isRowFootagePerConcept: payload.addOns?.isRowFootagePerConcept,
        isOffSiteFilming: payload.addOns?.isOffSiteFilming,
        isUgc5Photos: payload.addOns?.isUgc5Photos,
        isExpressDelivery: payload.addOns?.isExpressDelivery,
        isFilmingEssentials: payload.addOns?.isFilmingEssentials,
        isAdditionalPerson: payload.addOns?.isAdditionalPerson,
      },
      revisionStatus: 'pending',
    };

    console.log('payload.brandInfo?.isScript', payload.brandInfo?.isScript);
    if (payload.brandInfo?.isScript !== 'no') {
      hireCreatorData.revisionStatus = 'accepted';
    }

    console.log('hireCreatorData======================*****', hireCreatorData);
    const result = await HireCreator.create([hireCreatorData], { session });
    console.log('before console');
    console.log('result', result);

    if (!result || result.length === 0) {
      throw new AppError(403, 'HireCreator creation failed!!');
    }

    let totalAmountPay;
    console.log('totalAmountPay 1', totalAmountPay);

    if (subcriptionResult.price) {
      totalAmountPay = subcriptionResult.price;
    }
    console.log('totalAmountPay 2', totalAmountPay);

    if (result[0]?.addOns?.isExtraHook === 'yes') {
      totalAmountPay = totalAmountPay + 100;
    }
    console.log('totalAmountPay 3', totalAmountPay);
    if (result[0]?.addOns?.isExtraCta === 'yes') {
      totalAmountPay = totalAmountPay + 100;
    }
    console.log('totalAmountPay 4', totalAmountPay);
    if (result[0]?.addOns?.isRowFootagePerConcept === 'yes') {
      totalAmountPay = totalAmountPay + 200;
    }
    console.log('totalAmountPay 5', totalAmountPay);
    if (result[0]?.addOns?.isOffSiteFilming === 'yes') {
      totalAmountPay = totalAmountPay + 397;
    }
    console.log('totalAmountPay 6', totalAmountPay);
    if (result[0]?.addOns?.isUgc5Photos) {
      totalAmountPay =
        totalAmountPay + 60 * Number(result[0]?.addOns?.isUgc5Photos);
    }
    console.log('totalAmountPay 7', totalAmountPay);
    if (result[0]?.addOns?.isExpressDelivery === 'yes') {
      totalAmountPay = totalAmountPay + 300;
    }
    console.log('totalAmountPay 8', totalAmountPay);
    if (result[0]?.addOns?.isFilmingEssentials === 'yes') {
      totalAmountPay = totalAmountPay + 100;
    }
    console.log('totalAmountPay 9', totalAmountPay);
    if (result[0]?.addOns?.isAdditionalPerson === 'yes') {
      totalAmountPay = totalAmountPay + 397;
    }

    console.log('totalAmountPay', totalAmountPay);

    const paymentData = {
      userId: payload.userId,
      amount: totalAmountPay,
      orderId: result[0]._id,
    };

    console.log('paymentData', paymentData);
    let paymentUrl: any;

    if (payload.method === 'paypal') {
      paymentUrl = await paymentService.createPaypalPaymentService(paymentData);
    } else {
      paymentUrl = await paymentService.createCheckout(
        payload.userId,
        paymentData,
      );
    }

    console.log('paymentUrl', paymentUrl);

    await session.commitTransaction();
    console.log('Transaction committed successfully');

    return paymentUrl;
  } catch (error: any) {
    console.error('Error in createHireCreator:', error);
    if (session.inTransaction()) {
      await session.abortTransaction();
      console.log('Transaction aborted');
    }
    throw error;
  } finally {
    await session.endSession();
    console.log('Session ended');
  }
};

const createPackagePurchase = async (payload: any) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    console.log(' payload=', payload);

    if (!payload.packageId) {
      throw new AppError(403, 'Package Id is required');
    }

    const packageExist = await Package.findById(payload.packageId).session(
      session,
    );
    if (!packageExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
    }
    const user = await User.findById(payload.userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }

    if (packageExist.type === 'yearly' || packageExist.type === 'monthly') {
      console.log('=subscription');

      const runningSubscription = await Subscription.findOne({
        userId: payload.userId,
        type: packageExist.type,
        isDeleted: false,
        endDate: { $gt: new Date() },
        $expr: { $lt: ['$takeVideoCount', '$videoCount'] },
      }).session(session);

      if (runningSubscription) {
        throw new AppError(403, 'You already have a running subscription!');
      }

      const existingSubscription = await Subscription.findOne({
        userId: payload.userId,
        type: packageExist.type,
        isDeleted: false,
      }).session(session);

      if (existingSubscription) {
        throw new AppError(
          403,
          'Your subscription has expired. Please renew your subscription to continue.',
        );
      }

      // const runningPackage = await Subscription.findOne({
      //   userId: payload.userId,
      //   isDeleted: false,
      //   type: 'one_time',
      //   status: 'pending',
      // });

      // if (runningPackage) {
      //   throw new AppError(
      //     httpStatus.BAD_REQUEST,
      //     'You currently have an active package. Please use this package before purchasing a new subscription.',
      //   );
      // }

      const subscriptionData = {
        packageId: packageExist?._id,
        userId: payload.userId,
      };
      console.log('subscriptionData', subscriptionData);

      const subcriptionResult: any =
        await subscriptionService.createSubscription(subscriptionData, session);

      if (!subcriptionResult) {
        throw new AppError(403, 'Subscription created faild!!');
      }

      console.log('subcriptionResult==', subcriptionResult);

      const paymentData = {
        userId: payload.userId,
        amount: subcriptionResult.price,
        subscriptionId: subcriptionResult._id,
      };
      console.log('paymentData', paymentData);

      const paymentUrl =
        paymentService.createPaypalPaymentServiceDirect(paymentData);

      await session.commitTransaction();
      session.endSession();

      return paymentUrl;
    } else {
      console.log('package ');
      // const runningubscription = await Subscription.findOne({
      //   userId: payload.userId,
      //   isDeleted: false,
      //   endDate: { $gt: new Date() },
      //   $expr: { $lt: ['$takeVideoCount', '$videoCount'] },
      // }).session(session);

      // if (runningubscription) {
      //   throw new AppError(400, 'Your Subscription is already running!');
      // }

      const subscriptionData = {
        packageId: packageExist?._id,
        userId: payload.userId,
      };

      const subcriptionResult: any =
        await subscriptionService.createSubscription(subscriptionData);

      console.log('subcriptionResult==', subcriptionResult);
      if (!subcriptionResult) {
        throw new AppError(403, 'Subscription created faild!!');
      }

      const paymentData = {
        userId: payload.userId,
        amount: subcriptionResult.price,
        subscriptionId: subcriptionResult?._id,
      };
      console.log('paymentData', paymentData);

      const paymentUrl =
        await paymentService.createPaypalPaymentServiceDirect(paymentData);
      console.log('paymentUrl', paymentUrl);

      await session.commitTransaction();
      session.endSession();

      return paymentUrl;
    }
  } catch (error: any) {
    console.log('error purchest', error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    session.endSession();
    throw new AppError(
      error.statusCode || 500,
      error.message || 'Something went wrong',
    );
  }
};

// const createHireCreator = async (files: any, payload: any) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     console.log('HireCreator payload=', payload);

//     if (typeof payload.brandInfo === 'string') {
//       payload.brandInfo = JSON.parse(payload.brandInfo);
//     }
//     if (typeof payload.brandSocial === 'string') {
//       payload.brandSocial = JSON.parse(payload.brandSocial);
//     }
//     if (typeof payload.contentInfo === 'string') {
//       payload.contentInfo = JSON.parse(payload.contentInfo);
//     }
//     if (typeof payload.characteristicInfo === 'string') {
//       payload.characteristicInfo = JSON.parse(payload.characteristicInfo);
//     }
//     if (typeof payload.doAndDonts === 'string') {
//       payload.doAndDonts = JSON.parse(payload.doAndDonts);
//     }
//     if (typeof payload.lastContentInfo === 'string') {
//       payload.lastContentInfo = JSON.parse(payload.lastContentInfo);
//     }
//     console.log('HireCreator parse payload =', payload);
//     console.log('HireCreator files=', files);
//     console.log('console-0');
//     if (!files) {
//       throw new AppError(403, 'At least one File is required');
//     }
//     if (!payload.packageId) {
//       throw new AppError(403, 'Package Id is required');
//     }

//     const packageExist = await Package.findById(payload.packageId).session(
//       session,
//     );
//     if (!packageExist) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
//     }
//     const user = await User.findById(payload.userId).session(session);
//     if (!user) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
//     }

//     if (files.ugcPhoto && files.ugcPhoto.length > 0) {
//       const ugcPhoto: any = await uploadToS3({
//         file: files.ugcPhoto[0],
//         fileName: files.ugcPhoto[0].originalname,
//         folder: 'ugcImage/',
//       });
//       payload.contentInfo.ugcPhoto = ugcPhoto;
//     }

//     if (!payload.contentInfo.ugcPhoto) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Ugc image is required');
//     }

//     if (packageExist.type === 'yearly' || packageExist.type === 'monthly') {
//       console.log('subscription');
//       if (!payload.takeVideoCount) {
//         throw new AppError(403, 'Take video count required!!');
//       }
//       const existingSubscription = await Subscription.findOne({
//         userId: payload.userId,
//         type: packageExist.type,
//         isDeleted: false,
//       }).session(session);

//       console.log('existingSubscription', existingSubscription);

//       if (existingSubscription) {
//         const runningubscription = await Subscription.findOne({
//           userId: payload.userId,
//           isDeleted: false,
//           endDate: { $gt: new Date() },
//         }).session(session);

//         if (!runningubscription) {
//           throw new AppError(
//             403,
//             'Your subscription has expired. Please renew your subscription to continue.',
//           );
//         }

//         if (
//           Number(runningubscription.takeVideoCount) +
//             Number(payload.takeVideoCount) >
//           Number(runningubscription.videoCount)
//         ) {
//           throw new AppError(
//             httpStatus.BAD_REQUEST,
//             'You have already reached the maximum video count for this package.',
//           );
//         }

//         payload.subscriptionId = runningubscription._id;
//         const hireCreatorData = {
//           userId: payload.userId,
//           subscriptionId: payload.subscriptionId,
//           brandInfo: {
//             name: payload.brandInfo.name,
//             email: payload.brandInfo.email,
//             phone: payload.brandInfo.phone,
//             productName: payload.brandInfo.productName,
//             productLink: payload.brandInfo.productLink,
//             productType: payload.brandInfo.productType,
//           },
//           brandSocial: {
//             tiktokHandle: payload.brandSocial.tiktokHandle,
//             tiktokLink: payload.brandSocial.tiktokLink,
//             instragramHandle: payload.brandSocial.instragramHandle,
//             instragramLink: payload.brandSocial.instragramLink,
//             websiteLink: payload.brandSocial.websiteLink,
//           },
//           contentInfo: {
//             additionalFormate: payload.contentInfo.additionalFormate,
//             videoDuration: payload.contentInfo.videoDuration,
//             platForm: payload.contentInfo.platForm,
//             usageType: payload.contentInfo.usageType,
//             adHookOrCtaRequest: payload.contentInfo.adHookOrCtaRequest,
//             exampleVideoLink: payload.contentInfo.exampleVideoLink,
//             ugcPhoto: payload.contentInfo.ugcPhoto,
//           },
//           characteristicInfo: {
//             ageRange: payload.characteristicInfo.ageRange,
//             gender: payload.characteristicInfo.gender,
//             location: payload.characteristicInfo.location,
//             language: payload.characteristicInfo.language,
//             script: payload.characteristicInfo.script,
//           },
//           doAndDonts: {
//             anyWordsNotToUse: payload.doAndDonts.anyWordsNotToUse,
//             anySpecificWordsUse: payload.doAndDonts.anySpecificWordsUse,
//             howToPronouncebrandName: payload.doAndDonts.howToPronouncebrandName,
//             anySpecialRequest: payload.doAndDonts.anySpecialRequest,
//             expressDelivery: payload.doAndDonts.expressDelivery,
//           },
//           lastContentInfo: {
//             textOverlay: payload.lastContentInfo.textOverlay,
//             captions: payload.lastContentInfo.captions,
//             music: payload.lastContentInfo.music,
//             extraHook: payload.lastContentInfo.extraHook,
//             extraCta: payload.lastContentInfo.extraCta,
//             videoType: payload.lastContentInfo.videoType,
//             additionalPerson: payload.lastContentInfo.additionalPerson,
//             offSiteAttraction: payload.lastContentInfo.offSiteAttraction,
//             goalOfProject: payload.lastContentInfo.goalOfProject,
//             tergetAudience: payload.lastContentInfo.tergetAudience,
//           },
//           takeVideoCount: payload.takeVideoCount,
//         };

//         const result =
//           await HireCreator.create([hireCreatorData], { session });
//         if (!result) {
//           throw new AppError(403, 'HireCreator creation failed');
//         }

//         if (files?.ugcPhoto?.[0]?.path) {
//           const fileDeletePath = `${files.ugcPhoto[0].path}`;
//           await unlink(fileDeletePath);
//           console.log('File deleted successfully');
//         }
//         await session.commitTransaction();
//         return result;
//       }else{

//       }
//     }

//     console.log('create subscription');
//     const subscriptionData = {
//       packageId: packageExist._id,
//       userId: payload.userId,
//     };

//     const subscriptionResult = await subscriptionService.createSubscription(
//       subscriptionData,
//       session,
//     );

//     if (!subscriptionResult) {
//       throw new AppError(403, 'Subscription creation failed');
//     }

//     payload.subscriptionId = subscriptionResult._id;

//     const hireCreatorData = {
//       userId: payload.userId,
//       subscriptionId: payload.subscriptionId,
//       brandInfo: {
//         name: payload.brandInfo.name,
//         email: payload.brandInfo.email,
//         phone: payload.brandInfo.phone,
//         productName: payload.brandInfo.productName,
//         productLink: payload.brandInfo.productLink,
//         productType: payload.brandInfo.productType,
//       },
//       brandSocial: {
//         tiktokHandle: payload.brandSocial.tiktokHandle,
//         tiktokLink: payload.brandSocial.tiktokLink,
//         instragramHandle: payload.brandSocial.instragramHandle,
//         instragramLink: payload.brandSocial.instragramLink,
//         websiteLink: payload.brandSocial.websiteLink,
//       },
//       contentInfo: {
//         additionalFormate: payload.contentInfo.additionalFormate,
//         videoDuration: payload.contentInfo.videoDuration,
//         platForm: payload.contentInfo.platForm,
//         usageType: payload.contentInfo.usageType,
//         adHookOrCtaRequest: payload.contentInfo.adHookOrCtaRequest,
//         exampleVideoLink: payload.contentInfo.exampleVideoLink,
//         ugcPhoto: payload.contentInfo.ugcPhoto,
//       },
//       characteristicInfo: {
//         ageRange: payload.characteristicInfo.ageRange,
//         gender: payload.characteristicInfo.gender,
//         location: payload.characteristicInfo.location,
//         language: payload.characteristicInfo.language,
//         script: payload.characteristicInfo.script,
//       },
//       doAndDonts: {
//         anyWordsNotToUse: payload.doAndDonts.anyWordsNotToUse,
//         anySpecificWordsUse: payload.doAndDonts.anySpecificWordsUse,
//         howToPronouncebrandName: payload.doAndDonts.howToPronouncebrandName,
//         anySpecialRequest: payload.doAndDonts.anySpecialRequest,
//         expressDelivery: payload.doAndDonts.expressDelivery,
//       },
//       lastContentInfo: {
//         textOverlay: payload.lastContentInfo.textOverlay,
//         captions: payload.lastContentInfo.captions,
//         music: payload.lastContentInfo.music,
//         extraHook: payload.lastContentInfo.extraHook,
//         extraCta: payload.lastContentInfo.extraCta,
//         videoType: payload.lastContentInfo.videoType,
//         additionalPerson: payload.lastContentInfo.additionalPerson,
//         offSiteAttraction: payload.lastContentInfo.offSiteAttraction,
//         goalOfProject: payload.lastContentInfo.goalOfProject,
//         tergetAudience: payload.lastContentInfo.tergetAudience,
//       },
//       takeVideoCount: payload.takeVideoCount,
//     };

//     const result = await HireCreator.create(hireCreatorData).session(session);
//     if (!result) {
//       throw new AppError(403, 'HireCreator creation failed');
//     }

//     await session.commitTransaction();
//     return result;
//   } catch (error) {
//     await session.abortTransaction();
//     console.log('Error in transaction:', error);

//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

// name, contact, email, country, status

const getAllHireCreatorQuery = async (query: Record<string, unknown>) => {
  const HireCreatorQuery = new QueryBuilder(
    HireCreator.find({})
      .populate({ path: 'userId', select: 'fullName' })
      .populate({ path: 'subscriptionId', select: 'price' })
      .select(
        'brandInfo.name brandInfo.email brandInfo.phone brandInfo.productName status paymentStatus',
      ),
    query,
  )
    .search([
      'userId.fullName',
      'brandInfo.name',
      'brandInfo.email',
      'brandInfo.phone',
      'brandInfo.productName',
    ])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HireCreatorQuery.modelQuery;

  const meta = await HireCreatorQuery.countTotal();
  return { meta, result };
};

const getAllHireCreatorByUserQuery = async (
  query: Record<string, unknown>,
  userId: String,
) => {
  const HireCreatorQuery = new QueryBuilder(
    HireCreator.find({
      userId,
      status: [
        'pending',
        'approved',
        'cancel',
        'ongoing',
        'delivered',
        'revision',
        'completed',
      ],
    }).select(
      'brandInfo.name brandInfo.email status paymentStatus createdAt brandPrice',
    ),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HireCreatorQuery.modelQuery;

  const meta = await HireCreatorQuery.countTotal();
  return { meta, result };
};

const getCreatorAllOrdersQuery = async (
  query: Record<string, unknown>,
  userId: String,
) => {
  const HireCreatorQuery = new QueryBuilder(
    HireCreator.find({ creatorUserId: userId }).select(
      'brandInfo.name brandInfo.email status paymentStatus createdAt creatorId creatorUserId',
    ),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HireCreatorQuery.modelQuery;

  const meta = await HireCreatorQuery.countTotal();
  return { meta, result };
};

const getAllCreatorByHirecreator = async (
  query: Record<string, unknown>,
  userId: String,
  id: string,
) => {
  const HireCreatorQuery = new QueryBuilder(
    AssignTaskCreator.find({ hireCreatorId: id, hireCreatorUserId: userId }).select(
      'brandInfo.name brandInfo.email status paymentStatus createdAt creatorId creatorUserId',
    ),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await HireCreatorQuery.modelQuery;

  const meta = await HireCreatorQuery.countTotal();
  return { meta, result };
};

const getSingleHireCreatorQuery = async (id: string) => {
  const hireCreator: any = await HireCreator.findById(id)
    .populate('userId')
    .populate('subscriptionId')
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator Not Found!!');
  }
  return hireCreator;
};

const getAllVideosByHirecreator = async (id: string) => {
  const hireCreator: any = await HireCreator.findById(id);
   
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator Not Found!!');
  }

  const allVideos=[];

  const assignCreators = await AssignTaskCreator.find({
    hireCreatorId: id,
  }).select('uploadedFiles');

  for (let i = 0; i < assignCreators.length; i++) {
    for (let j = 0; j < assignCreators[i].uploadedFiles.length; j++) {
      allVideos.push(assignCreators[i].uploadedFiles[j]);
    }
  }

  console.log('allVideos', allVideos);

  return allVideos;
};

const updateSingleHireCreatorQuery = async (id: string, payload: any) => {
  console.log('id', id);
  console.log('updated payload', payload);
  const HireCreatorProduct: any = await HireCreator.findById(id);
  if (!HireCreatorProduct) {
    throw new AppError(404, 'HireCreator is not found!');
  }

  const result = await HireCreator.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(403, 'HireCreator updated faild!!');
  }

  return result;
};

const approvedSingleHireCreator = async (id: String) => {
  console.log('id', id);

  const session = await mongoose.startSession();
  session.startTransaction();

  // id check mongoose id
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, 'Invalid HireCreator ID');
  }

  try {
    const hireCreator: any = await HireCreator.findById(id).session(session);
    if (!hireCreator) {
      throw new AppError(404, 'HireCreator is not found!');
    }

    if (hireCreator.status === 'approved') {
      throw new AppError(400, 'HireCreator is already approved!');
    }
    if (hireCreator.status === 'cancel') {
      throw new AppError(400, 'HireCreator is already canceled!');
    }

    const subscriptioinExist = await Subscription.findById(
      hireCreator.subscriptionId,
    ).session(session);
    if (!subscriptioinExist) {
      throw new AppError(404, 'Subscription not found!!');
    }

    // if (
    //   subscriptioinExist.type === 'yearly' ||
    //   subscriptioinExist.type === 'monthly'
    // ) {
    //   const updateTakeVideoCount =
    //     Number(subscriptioinExist.takeVideoCount) +
    //     Number(hireCreator.takeVideoCount);
    //   await Subscription.findByIdAndUpdate(
    //     hireCreator.subscriptionId,
    //     { takeVideoCount: updateTakeVideoCount },
    //     { new: true, session },
    //   );
    // } else {
    //   await Subscription.findByIdAndUpdate(
    //     hireCreator.subscriptionId,
    //     { takeVideoCount: subscriptioinExist.videoCount },
    //     { new: true, session },
    //   );
    // }
    // 684f974057f251d44a8bc8b4
    const result = await HireCreator.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true, session },
    );

    if (!result) {
      throw new AppError(403, 'HireCreator update failed!');
    }

    const notificationData = {
      userId: hireCreator.userId,
      message: `HireCreator approved by admin!`,
      type: 'success',
    };

    await notificationService.createNotification(notificationData);

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error: any) {
    console.log('errror', error);
    await session.abortTransaction();
    session.endSession();

    throw new AppError(error.statusCode, error.message);
  }
};

const cancelSingleHireCreator = async (id: String) => {
  console.log('id', id);

  const session = await mongoose.startSession();
  session.startTransaction();

  // id check mongoose id
  if (!id || !mongoose.isValidObjectId(id)) {
    throw new AppError(400, 'Invalid HireCreator ID');
  }

  try {
    const hireCreator: any = await HireCreator.findById(id).session(session);
    if (!hireCreator) {
      throw new AppError(404, 'HireCreator is not found!');
    }

    if (hireCreator.status === 'approved') {
      throw new AppError(400, 'HireCreator is already approved!');
    }

    if (hireCreator.status === 'cancel') {
      throw new AppError(400, 'HireCreator is already canceled!');
    }

    const subscriptioinExist = await Subscription.findById(
      hireCreator.subscriptionId,
    ).session(session);
    if (!subscriptioinExist) {
      throw new AppError(404, 'Subscription not found!!');
    }

    const paymentExist = await Payment.findOne({
      userId: hireCreator.userId,
      subscriptionId: hireCreator.subscriptionId,
    }).session(session);
    

    if (!paymentExist) {
      throw new AppError(404, 'Payment not found!!');
    }

    if (paymentExist.method === 'paypal') {
      const refundAmount: any = await paymentService.refundPaypalPaymentService(
        paymentExist.transactionId,
        Number(paymentExist.amount),
      );

      console.log('refundAmount', refundAmount);

      if (refundAmount === 'Refund successful.') {
        const result = await HireCreator.findByIdAndUpdate(
          id,
          { status: 'cancel' },
          { new: true, session },
        );

        const subscriptionDataUpdate = await Subscription.findOneAndUpdate(
          {
            _id: hireCreator.subscriptionId,
          },
          { $inc: { takeVideoCount: -Number(hireCreator.takeVideoCount) } },
          { new: true, session },
        );
        if (!subscriptionDataUpdate) {
          throw new AppError(403, 'subscriptionData update failed!');
        }

        const paymentDataUpdate = await Payment.findOneAndUpdate(
          {
            userId: hireCreator.userId,
            subscriptionId: hireCreator.subscriptionId,
          },
          { isRefund: true },
          { new: true, session },
        );

        if (!paymentDataUpdate) {
          throw new AppError(403, 'Payment update failed!');
        }
        if (!result) {
          throw new AppError(403, 'HireCreator update failed!');
        }

        const notificationData = {
          userId: hireCreator.userId,
          message: `HireCreator canceled by admin!`,
          type: 'success',
        };
        const notificationData1 = {
          userId: hireCreator.userId,
          message: `Payment refund successful!`,
          type: 'success',
        };

        await notificationService.createNotification(notificationData, session);
        await notificationService.createNotification(
          notificationData1,
          session,
        );
        await session.commitTransaction();
        session.endSession();

        return result;
      } else {
        await session.commitTransaction();
        session.endSession();

        throw new AppError(403, 'HireCreator cancel failed!');
      }
    }else{
      const refundAmount: any = await paymentService.paymentRefundService(
        Number(paymentExist.amount),
        paymentExist.transactionId,
      );

      if (refundAmount === 'Refund successful.') {
        const result = await HireCreator.findByIdAndUpdate(
          id,
          { status: 'cancel' },
          { new: true, session },
        );

        const subscriptionDataUpdate = await Subscription.findOneAndUpdate(
          {
            _id: hireCreator.subscriptionId,
          },
          { $inc: { takeVideoCount: -Number(hireCreator.takeVideoCount) } },
          { new: true, session },
        );
        if (!subscriptionDataUpdate) {
          throw new AppError(403, 'SubscriptionData update failed!');
        }

        const paymentDataUpdate = await Payment.findOneAndUpdate(
          {
            userId: hireCreator.userId,
            subscriptionId: hireCreator.subscriptionId,
          },
          { isRefund: true },
          { new: true, session },
        );

        if (!paymentDataUpdate) {
          throw new AppError(403, 'Payment update failed!');
        }
        if (!result) {
          throw new AppError(403, 'HireCreator update failed!');
        }

        const notificationData = {
          userId: hireCreator.userId,
          message: `HireCreator canceled by admin!`,
          type: 'success',
        };
        const notificationData1 = {
          userId: hireCreator.userId,
          message: `Payment refund successful!`,
          type: 'success',
        };

        await notificationService.createNotification(notificationData, session);
        await notificationService.createNotification(
          notificationData1,
          session,
        );
        await session.commitTransaction();
        session.endSession();

        return result;
      } else {
        await session.commitTransaction();
        session.endSession();

        throw new AppError(403, 'HireCreator cancel failed!');
      }

    }
  } catch (error: any) {
    console.log('errror', error);
    await session.abortTransaction();
    session.endSession();

    throw new AppError(error.statusCode, error.message);
  }
};

const assignAddIsScriptByAdmin = async (
  id: string,
  userId: string,
  revisionText: string,
  status: string,
) => {
  const session = await mongoose.startSession();

  console.log('revisionText=====', revisionText);

  try {
    session.startTransaction();
    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new AppError(404, 'User is not found!!');
    }
    const hireCreator: any = await HireCreator.findById(id).session(session);
    if (!hireCreator) {
      throw new AppError(404, 'Hire Creator is not found!!');
    }

    if (user.role === 'admin') {
      if (!revisionText) {
        throw new AppError(
          400,
          'Invalid input parameters: revisionText is required',
        );
      }

      if (hireCreator.brandInfo.isScript !== 'no') {
        throw new AppError(
          404,
          'You can not add script!! Because script is already added!!',
        );
      }
      if (hireCreator.revisionStatus === 'script_requiest') {
        throw new AppError(404, 'you already requested script!!');
      }
      if (hireCreator.revisionStatus === 'accepted') {
        throw new AppError(404, 'Script is already accepted!!');
      }

      const updateHireCreator = await HireCreator.findByIdAndUpdate(
        id,
        {
          revisionStatus: 'script_requiest',
          isScript: revisionText,
        },
        { new: true, session },
      );

      if (!updateHireCreator) {
        throw new AppError(403, 'HireCreator update failed!!');
      }
      await session.commitTransaction();
      session.endSession();

      return updateHireCreator;
    } else {
      if (!status || (status !== 'accept' && status !== 'cancel')) {
        throw new AppError(400, 'Invalid input parameters: status is required');
      }

      if (hireCreator.revisionStatus !== 'script_requiest') {
        throw new AppError(404, 'you have not requested script!!');
      }
      if (hireCreator.revisionStatus === 'accepted') {
        throw new AppError(404, 'Script is already accepted!!');
      }

      const statusNew = status === 'accept' ? 'accepted' : 'cancel';

      const updateHireCreator = await HireCreator.findByIdAndUpdate(
        id,
        {
          revisionStatus: statusNew,
        },
        { new: true, session },
      );

      if (!updateHireCreator) {
        throw new AppError(403, 'HireCreator update failed!!');
      }
      await session.commitTransaction();
      session.endSession();

      return updateHireCreator;
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    // console.log('error', error);

    throw new AppError(
      error.statusCode || 500,
      error.message || 'Something went wrong!',
    );
  }
};


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

    const hireCreator: any = await HireCreator.findById(id).session(session);
    if (!hireCreator) {
      throw new AppError(404, 'Order is not found!!');
    }
    // console.log('hireCreator', hireCreator);
    console.log('console-2');
    const subscriptioin = await Subscription.findById(
      hireCreator.subscriptionId,
    ).session(session);
    if (!subscriptioin) {
      throw new AppError(404, 'Subscription not found!!');
    }
    // console.log('hireCreator', hireCreator);
    console.log('console-3');
    // if (
    //   (hireCreator.status !== 'ongoing' && hireCreator.status !== 'revision') ||
    //   hireCreator.creatorUserId.toString() !== userId.toString()
    // ) {
    //   throw new AppError(
    //     404,
    //     'HireCreator is not ongoing or revision, you are not the creator!',
    //   );
    // }

    console.log('console-4');
    if (!files || files.uploadVideos.length === 0) {
      throw new AppError(400, 'No video files uploaded');
    }
    console.log('console-5');

    if (hireCreator.status === 'ongoing') {
      console.log('console-ongoing');
      if (files.uploadVideos.length > subscriptioin.takeVideoCount) {
        throw new AppError(
          400,
          `You can only upload ${subscriptioin.takeVideoCount} videos`,
        );
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
        const updateHireCreator = await HireCreator.findByIdAndUpdate(
          id,
          { uploadedFiles: videos, status: 'completed' },
          { new: true, session },
        );
        console.log('file -upload-4');
        if (!updateHireCreator) {
          throw new AppError(403, 'Failed to update HireCreator');
        }

        const allVideoPaths = files.uploadVideos.map(
          (video: any) => `${video.path}`,
        );
        await Promise.all(allVideoPaths.map((path: any) => unlink(path)));

        await session.commitTransaction();
        session.endSession();

        return updateHireCreator;
      }
    } else {
      console.log('dsakalf revision hit hoise');

      if (hireCreator.uploadedFiles.length > subscriptioin.takeVideoCount) {
        throw new AppError(
          400,
          `You can only upload ${subscriptioin.takeVideoCount} videos`,
        );
      }

      if (files.uploadVideos && files.uploadVideos.length > 0) {
        const videos: any = await uploadManyToS3(
          files.uploadVideos,
          'uploadVideos/',
        );

        if (!videos || videos.length === 0) {
          throw new AppError(400, 'Video upload failed');
        }

        const updateHireCreator = await HireCreator.findByIdAndUpdate(
          id,
          {
            uploadedFiles: [...hireCreator.uploadedFiles, ...videos],
            status: 'completed',
          },
          { new: true, session },
        );

        if (!updateHireCreator) {
          throw new AppError(403, 'Failed to update HireCreator');
        }

        const allVideoPaths = files.uploadVideos.map(
          (video: any) => `${video.path}`,
        );
        await Promise.all(allVideoPaths.map((path: any) => unlink(path)));

        await session.commitTransaction();
        session.endSession();

        return updateHireCreator;
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

const assignTaskRevisionByUser = async (
  id: string,
  userId: string,
  payload: any,
) => {
  const session = await mongoose.startSession();

  console.log('payload=====', payload);

  try {
    session.startTransaction();

    if (!payload.status) {
      throw new AppError(
        400,
        'Invalid input parameters: revisionText or status is required',
      );
    }

    if (!id || !userId) {
      throw new AppError(400, 'Invalid input parameters');
    }

    if (payload.status === 'revision') {
      const hireCreator: any = await HireCreator.findById(id).session(session);
      if (!hireCreator) {
        throw new AppError(404, 'Hire Creator is not found!!');
      }
      if (hireCreator.status === 'delivered') {
        throw new AppError(404, 'AssignTaskCreator is already delivered!!');
      }

      if (
        hireCreator.status !== 'completed' ||
        hireCreator.userId.toString() !== userId.toString()
      ) {
        throw new AppError(
          404,
          'HireCreator is not completed, you are not the brand creator!!',
        );
      }

      console.log('payload.revisionText', payload);

      if (hireCreator.revisionCount === 0) {
        throw new AppError(403, 'Your revision limit is over!!');
      }

      const updateHireCreator = await HireCreator.findByIdAndUpdate(
        id,
        {
          status: 'revision',
          // isScript: payload.revisionText,
          isForward: false,
          revisionCount: hireCreator.revisionCount - 1,
        },
        { new: true, session },
      );
      if (!updateHireCreator) {
        throw new AppError(403, 'HireCreator update failed!!');
      }

      const assignCreator = await AssignTaskCreator.updateMany(
        { hireCreatorId: id },
        { status: 'revision' },
        { new: true, session },
      );
      if (!assignCreator) {
        throw new AppError(403, 'assignCreator update failed!!');
      }
      console.log('updateHireCreator', updateHireCreator);

      await session.commitTransaction();
      session.endSession();

      return updateHireCreator;
    } else if (payload.status && payload.status === 'delivered') {
      const hireCreator: any = await HireCreator.findById(id).session(session);
      if (!hireCreator) {
        throw new AppError(404, 'Hire Creator is not found!!');
      }
      if (hireCreator.status === 'delivered') {
        throw new AppError(404, 'AssignTaskCreator is already delivered!!');
      }

      if (
        hireCreator.status !== 'completed' ||
        hireCreator.userId.toString() !== userId.toString()
      ) {
        throw new AppError(
          404,
          'HireCreator is not completed, you are not the brand creator!!',
        );
      }

      const updateHireCreator: any = await HireCreator.findByIdAndUpdate(
        id,
        { status: 'delivered' },
        { new: true, session },
      );

      const updateAssignCreator: any = await AssignTaskCreator.updateMany(
        { hireCreatorId: id },
        { status: 'delivered' },
        { new: true, session },
      );
      if (!updateAssignCreator) {
        throw new AppError(403, 'Update Assign Creator failed!!');
      }

      const subscriptioinUpdate = await Subscription.findOneAndUpdate(
        { _id: updateHireCreator.subscriptionId },
        { status: 'completed' },
        { new: true, session },
      );

      if (!updateHireCreator) {
        throw new AppError(403, 'Hire Creator update failed!!');
      }
      await session.commitTransaction();
      session.endSession();

      return updateHireCreator;
    }
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    // console.log('error', error);

    throw new AppError(
      error.statusCode || 500,
      error.message || 'Something went wrong!',
    );
  }
};


const videoForwardByAdmin = async (
  id: string,
) => {

  const hireCreator: any = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'Hire Creator is not found!!');
  }

  if (hireCreator.status !== 'ongoing') {
    throw new AppError(404, 'HireCreator is not ongoing!!');
  }

  const updateHireCreator: any = await HireCreator.findByIdAndUpdate(
    id,
    { status: 'completed', isForward: true },
    { new: true },
  );

  if (!updateHireCreator) {
    throw new AppError(403, 'Hire Creator update failed!!');
  }

  return updateHireCreator;

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

const deleteSingleHireCreatorVideoDeleteByCreator = async (
  id: string,
  userId: string,
  payload: any,
) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const hireCreator = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator Not Found!!');
  }

  // if (hireCreator.creatorUserId?.toString() !== userId.toString()) {
  //   throw new AppError(404, 'You are a not valid creator!!');
  // }

  const key = payload.videourl.split('amazonaws.com/')[1];

  const videoDoc = await HireCreator.findOne({
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
    const updatedDoc = await HireCreator.findOneAndUpdate(
      { 'uploadedFiles.url': payload.videourl },
      { $pull: { uploadedFiles: { url: payload.videourl } } },
      { new: true },
    );

    return updatedDoc;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'Video not found in the database');
  }
};

const deletedHireCreatorQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  const hireCreator = await HireCreator.findById(id);
  if (!hireCreator) {
    throw new AppError(404, 'HireCreator Not Found!!');
  }

  const result = await HireCreator.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'HireCreator Result Not Found !');
  }

  return result;
};

export const hireCreatorService = {
  createHireCreator,
  getAllHireCreatorQuery,
  getAllHireCreatorByUserQuery,
  getAllCreatorByHirecreator,
  getAllVideosByHirecreator,
  getCreatorAllOrdersQuery,
  getSingleHireCreatorQuery,
  updateSingleHireCreatorQuery,
  approvedSingleHireCreator,
  cancelSingleHireCreator,
  assignTaskCreatorUploadVideosByCreator,
  assignTaskRevisionByUser,
  videoForwardByAdmin,
  assignAddIsScriptByAdmin,
  assignTaskCreatorReSubmitUploadVideosByCreator,
  deleteSingleHireCreatorVideoDeleteByCreator,
  deletedHireCreatorQuery,
  createPackagePurchase,
};
