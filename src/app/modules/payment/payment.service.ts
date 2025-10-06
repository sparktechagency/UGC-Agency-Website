import AppError from '../../error/AppError';
import { User } from '../user/user.models';
import { TPayment } from './payment.interface';
import { Payment } from './payment.model';
import QueryBuilder from '../../builder/QueryBuilder';
import moment from 'moment';
import Stripe from 'stripe';
import httpStatus from 'http-status';
import config from '../../config';
import mongoose from 'mongoose';
import { StripeAccount } from '../stripeAccount/stripeAccount.model';
import { withdrawService } from '../withdraw/withdraw.service';
import { Withdraw } from '../withdraw/withdraw.model';
import cron from 'node-cron';
import { notificationService } from '../notification/notification.service';
import axios from 'axios';
import Package from '../package/package.model';
import paypalClient from '../../utils/paypal';
import paypal from '@paypal/checkout-server-sdk';
import Subscription from '../subscription/subscription.model';
import * as paypalPayouts from '@paypal/payouts-sdk';
import HireCreator from '../hireCreator/hireCreator.model';


type SessionData = Stripe.Checkout.Session;

// console.log({ first: config.stripe.stripe_api_secret });

export const stripe = new Stripe(
  config.stripe.stripe_api_secret as string,
  //      {
  //   apiVersion: '2024-09-30.acacia',
  // }
);

// console.log('stripe==', stripe);

const addPaymentService = async (payload: any) => {
  const session = await mongoose.startSession();
  session.startTransaction();


  try {
    const user = await User.findById(payload.userId).session(session);
    if (!user) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }
    
    const packageExist = await Package.findById(payload.packageId).session(session);
    if (!packageExist) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Package not found');
    }

    const paymentData = {
      userId: user._id,
      method: payload.method,
      amount: packageExist.price,
       status: 'paid',
       transactionId: payload.transactionId,
       transactionDate: new Date(),
       packageId: packageExist._id
    }

    const payment = await Payment.create([paymentData], { session });
  
    await session.commitTransaction();
    session.endSession();
    return payment;
  } catch (error) {
    console.error('Transaction Error:', error);
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const createPaypalPaymentService = async (payload: any) => {
  console.log('payload==', payload);
  const session = await mongoose.startSession();
  session.startTransaction();


  // try {
  //   console.log('console-1')
  //   const assecToken = await getPaypalAccessToken();
  //     console.log('assecToken==', assecToken);

  //       const order = await axios.post(
  //         `https://sandbox.paypal.com/v2/checkout/orders`,
  //         {
  //           intent: 'CAPTURE',
  //           purchase_units: [
  //             {
  //               amount: {
  //                 currency_code: 'USD',
  //                 value: '100',
  //               },
  //               metadata: {
  //                 user_id: '12345', 
  //                 source: 'website',
  //                 other_info: 'Additional information here',
  //               },
  //             },
  //           ],
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${assecToken}`,
  //             'Content-Type': 'application/json',
  //           },
  //         },
  //       );

  //       console.log('order==', order);
  //       console.log('order data==', order.data);
  //       console.log('order data id==', order.data.id);

  //       if (!order.data || !order.data.id) {
  //         throw new AppError(400, 'Order creation failed.');
  //       }

  //       const url = order.data.links.find(
  //         (link: any) => link.rel === 'approve',
  //       );

  //       if (!url) {
  //         throw new AppError(400, 'Order approval link not found.');
  //       }

  //   //     const capture = await axios.post(
  //   //       `${BASE_URL}/v2/checkout/orders/${order.data.id}/capture`,
  //   //       {},
  //   //       {
  //   //         headers: {
  //   //           Authorization: `Bearer ${assecToken}`,
  //   //           'Content-Type': 'application/json',
  //   //         },
  //   //       },
  //   //     );

  //   //     console.log('capture==', capture);

  //   //     if (!capture.data) {
  //   //       throw new AppError(400, 'Capture failed.');
  //   //     }

  //   // Commit transaction
  //   await session.commitTransaction();
  //   session.endSession();
  //   return url;
  // } catch (error) {
  //   console.error('Transaction Error:', error);
  //   await session.abortTransaction();
  //   session.endSession();
  //   throw error;
  // }


  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: payload.amount,
          },
          // description: `Payment for Campaign: ${result._id}`,
          custom_id: payload.userId.toString(),
          // reference_id: ENUM_PAYMENT_PURPOSE.CAMPAIGN_RUN,
        },
      ],
      application_context: {
        brand_name: 'Your Business Name',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        // return_url: `${config.paypal.payment_capture_url}`,
        // cancel_url: `${config.paypal.paypal_campaign_run_payment_cancel_url}`,
        // return_url: `https://api.thesocialchance.com/api/v1/payment/success?orderId=${payload.orderId}`,
        // cancel_url: `https://api.thesocialchance.com/api/v1/payment/cancel?orderId=${payload.orderId}`,
        return_url: `http://10.10.7.107:5002/api/v1/payment/success?orderId=${payload.orderId}`,
        cancel_url: `http://10.10.7.107:5002/api/v1/payment/cancel?orderId=${payload.orderId}`,
      },
    });

    const response = await paypalClient.execute(request);
    const approvalUrl = response.result.links.find(
      (link: any) => link.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'PayPal payment creation failed: No approval URL found',
      );
    }

    return { url: approvalUrl };
  } catch (error:any) {
    console.error('PayPal Payment Error:', error);
    throw new AppError(error.statusCode, error.message);
  }


};


const createPaypalPaymentServiceDirect = async (payload: any) => {
  console.log('payload==', payload);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: payload.amount,
          },
          // description: `Payment for Campaign: ${result._id}`,
          custom_id: payload.userId.toString(),
          // reference_id: ENUM_PAYMENT_PURPOSE.CAMPAIGN_RUN,
        },
      ],
      application_context: {
        brand_name: 'Your Business Name',
        landing_page: 'LOGIN',
        // landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        // payment_method: 'PAYPAL',
        // return_url: `${config.paypal.payment_capture_url}`,
        // cancel_url: `${config.paypal.paypal_campaign_run_payment_cancel_url}`,
        // return_url: `https://api.thesocialchance.com/api/v1/payment/success-page?subscriptionId=${payload.subscriptionId}`,
        // cancel_url: `https://api.thesocialchance.com/api/v1/payment/cancel-page?subscriptionId=${payload.subscriptionId}`,
        return_url: `http://10.10.7.107:5002/api/v1/payment/success-page?subscriptionId=${payload.subscriptionId}`,
        cancel_url: `http://10.10.7.107:5002/api/v1/payment/cancel-page?subscriptionId=${payload.subscriptionId}`,
      },
    });

    const response = await paypalClient.execute(request);
    const approvalUrl = response.result.links.find(
      (link: any) => link.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'PayPal payment creation failed: No approval URL found',
      );
    }

    return { url: approvalUrl };
  } catch (error:any) {
    console.error('PayPal Payment Error:', error);
    throw new AppError(error.statusCode, error.message);
  }


};


const reniewPaypalPaymentService = async (id:string, userId:string) => {
  console.log('id==', id);
  console.log('userId==', userId);
  const session = await mongoose.startSession();
  session.startTransaction();

  
  try {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Subscription not found!!',
      );
    }

    if(subscription.userId.toString() !== userId.toString()){
      throw new AppError(httpStatus.BAD_REQUEST, 'You are not valid user for reniew this subscription!!');
    }


    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: String(subscription.price),
          },
          // description: `Payment for Campaign: ${result._id}`,
          custom_id: userId.toString(),
          // reference_id: ENUM_PAYMENT_PURPOSE.CAMPAIGN_RUN,
        },
      ],
      application_context: {
        brand_name: 'Your Business Name',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        // return_url: `${config.paypal.payment_capture_url}`,
        // cancel_url: `${config.paypal.paypal_campaign_run_payment_cancel_url}`,
        return_url: `https://api.thesocialchance.com/api/v1/payment/reniew-success?subscriptionId=${subscription._id}`,
        cancel_url: `https://api.thesocialchance.com/api/v1/payment/reniew-cancel?subscriptionId=${subscription._id}`,
      },
    });

    const response = await paypalClient.execute(request);
    const approvalUrl = response.result.links.find(
      (link: any) => link.rel === 'approve',
    )?.href;

    if (!approvalUrl) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'PayPal payment creation failed: No approval URL found',
      );
    }

    return { url: approvalUrl };
  } catch (error:any) {
    console.error('PayPal Payment Error:', error);
    throw new AppError(
      error.statusCode,
      error.message,
    );
  }
};


// Refund Service Function
const refundPaypalPaymentService = async (
  captureId: string,
  amount?: number, 
) => {
  try {

    console.log('captureId==', captureId);
    console.log('amount==', amount);
    if (!captureId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Capture ID is required for refund.',
      );
    }
    if (amount && amount <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Refund amount must be greater than zero.',
      );
    }
    const refundRequest = new paypal.payments.CapturesRefundRequest(captureId);

    const requestBody: any = {
      amount: {
        currency_code: 'USD',
        value: amount ? amount.toFixed(2) : '0.00',
      },
    };

    refundRequest.requestBody(requestBody);

    const response = await paypalClient.execute(refundRequest);

    if (response.statusCode === 201 && response.result.status === 'COMPLETED') {
      return "Refund successful.";
    } else {
      return {
        success: false,
        message: 'Refund failed.',
        error: response.result || 'Unknown error',
      };
    }
  } catch (error: any) {
    console.error('PayPal Refund Error:', error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error.statusCode && error.message) {
      throw new AppError(error.statusCode, error.message);
    } 
  }
};


const transferPaypalPaymentService = async (email: string, amount: number) => {
  try {

    const requestBody:any = {
      sender_batch_header: {
        email_subject: 'You have a payment',
        sender_batch_id: `batch_${Math.random().toString(36).substr(2, 9)}`,
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: 50,
            // value: amount.toFixed(2),
            currency: 'USD', 
          },
          receiver: 'user@gmail.com',
          // receiver: 'sb-dx6z737480442@personal.example.com',
          note: `Payment of 100 USD`,
          sender_item_id: `item_${Math.random().toString(36).substr(2, 9)}`,
        },
      ],
    };

    const payoutRequest = new paypalPayouts.payouts.PayoutsPostRequest();
    payoutRequest.requestBody(requestBody);

    const response = await paypalClient.execute(payoutRequest);
    console.log('response==', response);
    console.log('response==', response.result);

    if (response.statusCode === 201) {
      console.log('Payment transfer was successful.');
      return response.result;
    } else {
      console.error('Failed to transfer funds.');
      throw new Error('Failed to transfer funds');
    }
  } catch (error:any) {
    console.error('Error executing PayPal transfer:', error.message);
    console.error('Error executing PayPal response:', error.response);
    if (error.response) {
      const errorDetails = error.response.result;
      if (errorDetails && errorDetails.name === 'INVALID_RECEIVER') {
        console.error(`Error: No PayPal account found for email: ${email}`);
        throw new Error(`No PayPal account found for email: ${email}`);
      } else {
        console.error('Error executing PayPal transfer:', errorDetails);
        throw new Error('Error executing PayPal transfer');
      }
    } else {
      console.error('Error executing PayPal transfer:', error.message);
      throw new Error('Error executing PayPal transfer');
    }
  }
};



// const checkPayoutStatus = async (batchId: string) => {
//   try {
//     // Create a GET request to retrieve the payout status
//     const payoutStatusRequest = new paypalPayouts.payouts.PayoutsGetRequest(
//       batchId,
//     );

//     // Execute the request
//     const response = await paypalClient.execute(payoutStatusRequest);

//     // Check if the response is successful
//     if (response.statusCode === 200) {
//       // Log the current status of the payout
//       console.log('Payout Status:', response.result.batch_header.batch_status);

//       // Handle different batch statuses
//       switch (response.result.batch_header.batch_status) {
//         case 'SUCCESS':
//           console.log('Payout was successful!');
//           break;
//         case 'PENDING':
//           console.log('Payout is still processing.');
//           break;
//         case 'FAILED':
//           console.error('Payout failed.');
//           break;
//         default:
//           console.log('Payout status is unknown.');
//       }

//       return response.result;
//     } else {
//       console.error('Failed to fetch payout status.');
//       throw new Error('Failed to fetch payout status');
//     }
//   } catch (error:any) {
//     console.error('Error checking payout status:', error.message);
//     throw new Error('Error checking payout status');
//   }
// };



const getAllPaymentService = async (query: Record<string, unknown>) => {
  const PaymentQuery = new QueryBuilder(
    Payment.find({}).populate('userId').populate('orderId'),
    query,
  )
    .search([''])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentQuery.modelQuery;
  const meta = await PaymentQuery.countTotal();
  return { meta, result };
};
const getAllPaymentByCustomerService = async (
  query: Record<string, unknown>,
  customerId: string,
) => {
  const PaymentQuery = new QueryBuilder(
    Payment.find({ customerId, status: 'paid' }).populate({
      path: 'serviceId',
      select: 'serviceName servicePrice',
      populate: { path: 'businessId', select: 'businessName' },
    }),
    // .populate('businessId'),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PaymentQuery.modelQuery;
  const meta = await PaymentQuery.countTotal();
  return { meta, result };
};

const singlePaymentService = async (id: string) => {
  const task = await Payment.findById(id);
  return task;
};

const deleteSinglePaymentService = async (id: string) => {
  const result = await Payment.deleteOne({ _id: id });
  return result;
};

const getAllIncomeRatio = async (year: number) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalIncome: 0,
  }));

  // console.log({ months });

  const incomeData = await Payment.aggregate([
    {
      $match: {
        transactionDate: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$transactionDate' } },
        totalIncome: { $sum: '$amount' },
      },
    },
    {
      $project: {
        month: '$_id.month',
        totalIncome: 1,
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    const monthData = months.find((m) => m.month === data.month);
    if (monthData) {
      monthData.totalIncome = data.totalIncome;
    }
  });

  // console.log({ months });

  return months;
};


const getAllOverview = async () => {

  const totalCreator = await User.countDocuments({ role: 'creator' });
  const totalBrand = await User.countDocuments({ role: 'user' });
  const totalProject = await HireCreator.countDocuments({status: "delivered"});
  const totalRevenue = await Payment.aggregate([
    {
      $match: { status: 'paid', isRefund:false },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
      },
    },
  ]);
  const totalSubscription = await Subscription.countDocuments({
    status: ['running', 'completed'],
  });



  
  return {
    totalCreator,
    totalBrand,
    totalProject,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalIncome : 0,
    totalSubscription,
  };
};

// const getAllIncomeRatiobyDays = async (days: string) => {
//   const currentDay = new Date();
//   let startDate: Date;

//   if (days === '7day') {
//     startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
//   } else if (days === '24hour') {
//     startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
//   } else {
//     throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
//   }


//   const timeSlots =
//     days === '7day'
//       ? Array.from({ length: 7 }, (_, i) => {
//           const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
//           return {
//             date: day.toISOString().split('T')[0],
//             totalIncome: 0,
//           };
//         }).reverse()
//       : Array.from({ length: 24 }, (_, i) => {
//           const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
//           return {
//             hour: hour.toISOString(),
//             totalIncome: 0,
//           };
//         }).reverse();

//   const incomeData = await Payment.aggregate([
//     {
//       $match: {
//         transactionDate: { $gte: startDate, $lte: currentDay },
//       },
//     },
//     {
//       $group: {
//         _id:
//           days === '7day'
//             ? {
//                 date: {
//                   $dateToString: {
//                     format: '%Y-%m-%d',
//                     date: '$transactionDate',
//                   },
//                 },
//               }
//             : {
//                 hour: {
//                   $dateToString: {
//                     format: '%Y-%m-%dT%H:00:00',
//                     date: '$transactionDate',
//                   },
//                 },
//               },
//         totalIncome: { $sum: '$amount' },
//       },
//     },
//     // {
//     //   $project: {
//     //     dateHour: days === '7day' ? '$_id.date' : null,
//     //     dateHour: days === '24hour' ? '$_id.hour' : null,
//     //     totalIncome: 1,
//     //     _id: 0,
//     //   },
//     // },
//     {
//   $project: {
//     dateHour: {
//       $cond: {
//         if: { $eq: [days, '7day'] },
//         then: '$_id.date', // For 7day, use the date field
//         else: '$_id.hour', // For 24hour, use the hour field
//       },
//     },
//     totalIncome: 1,
//     _id: 0,
//   },
// },
//     {
//       $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
//     },
//   ]);

//   incomeData.forEach((data) => {
//     if (days === '7day') {
//       const dayData = timeSlots.find((d: any) => d.date === data.date);
//       if (dayData) {
//         dayData.totalIncome = data.totalIncome;
//       }
//     } else if (days === '24hour') {
//       const hourData = timeSlots.find((h: any) => h.hour === data.hour);
//       if (hourData) {
//         hourData.totalIncome = data.totalIncome;
//       }
//     }
//   });

//   return timeSlots;
// };

const getAllIncomeRatiobyDays = async (days: string) => {
  const currentDay = new Date();
  let startDate: Date;

  if (days === '7day') {
    startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (days === '24hour') {
    startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
  } else {
    throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
  }

  const timeSlots =
    days === '7day'
      ? Array.from({ length: 7 }, (_, i) => {
          const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
          return {
            dateHour: day.toISOString().split('T')[0],
            totalIncome: 0,
          };
        }).reverse()
      : Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
          return {
            dateHour: hour.toISOString(),
            totalIncome: 0,
          };
        }).reverse();

  const incomeData = await Payment.aggregate([
    {
      $match: {
        transactionDate: { $gte: startDate, $lte: currentDay },
      },
    },
    {
      $group: {
        _id:
          days === '7day'
            ? {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transactionDate',
                  },
                },
              }
            : {
                hour: {
                  $dateToString: {
                    format: '%Y-%m-%dT%H:00:00',
                    date: '$transactionDate',
                  },
                },
              },
        totalIncome: { $sum: '$amount' },
      },
    },
    {
      $project: {
        dateHour: days === '7day' ? '$_id.date' : '$_id.hour', // Rename to 'dateHour'
        totalIncome: 1,
        _id: 0,
      },
    },
    {
      $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    if (days === '7day') {
      const dayData = timeSlots.find((d: any) => d.dateHour === data.dateHour);
      if (dayData) {
        dayData.totalIncome = data.totalIncome;
      }
    } else if (days === '24hour') {
      const hourData = timeSlots.find((h: any) => h.dateHour === data.dateHour);
      if (hourData) {
        hourData.totalIncome = data.totalIncome;
      }
    }
  });

  return timeSlots;
};

const getAllSubscriptionUsersByWeekly = async (days: string) => {
  const currentDay = new Date();
  let startDate: Date;

  if (days === '7day') {
    startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (days === '24hour') {
    startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
  } else {
    throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
  }

  const timeSlots =
    days === '7day'
      ? Array.from({ length: 7 }, (_, i) => {
          const day = new Date(currentDay.getTime() - i * 24 * 60 * 60 * 1000);
          return {
            dateHour: day.toISOString().split('T')[0],
            totalUsers: 0,
          };
        }).reverse()
      : Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(currentDay.getTime() - i * 60 * 60 * 1000);
          return {
            dateHour: hour.toISOString(),
            totalUsers: 0,
          };
        }).reverse();

  const incomeData = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: currentDay },
      },
    },
    {
      $group: {
        _id:
          days === '7day'
            ? {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transactionDate',
                  },
                },
              }
            : {
                hour: {
                  $dateToString: {
                    format: '%Y-%m-%dT%H:00:00',
                    date: '$transactionDate',
                  },
                },
              },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        dateHour: days === '7day' ? '$_id.date' : '$_id.hour',
        totalUsers: 1,
        _id: 0,
      },
    },
    {
      $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    if (days === '7day') {
      const dayData = timeSlots.find((d: any) => d.dateHour === data.dateHour);
      if (dayData) {
        dayData.totalUsers = data.totalUsers;
      }
    } else if (days === '24hour') {
      const hourData = timeSlots.find((h: any) => h.dateHour === data.dateHour);
      if (hourData) {
        hourData.totalUsers = data.totalUsers;
      }
    }
  });

  return timeSlots;
};


const getBrandEngagement = async (days:string) => {
  // const days = '7day';
  const currentDay = new Date();
  let startDate: Date;

  if (days === '7day') {
    startDate = new Date(currentDay.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (days === '24hour') {
    startDate = new Date(currentDay.getTime() - 24 * 60 * 60 * 1000);
  } else {
    throw new Error("Invalid value for 'days'. Use '7day' or '24hour'.");
  }

  const incomeData = await HireCreator.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: currentDay },
      },
    },
    {
      $group: {
        _id:
          days === '7day'
            ? {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transactionDate',
                  },
                },
              }
            : {
                hour: {
                  $dateToString: {
                    format: '%Y-%m-%dT%H:00:00',
                    date: '$transactionDate',
                  },
                },
              },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        dateHour: days === '7day' ? '$_id.date' : '$_id.hour',
        totalUsers: 1,
        _id: 0,
      },
    },
    {
      $sort: { [days === '7day' ? 'date' : 'hour']: 1 },
    },
  ]);

  console.log('incomeData==', incomeData);

  const allUsers = await User.countDocuments({ role: 'user' });
  console.log('allUsers==', allUsers);
  const parcentTense = (value: number, total: number) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(0);
  };

  const totalUsers = allUsers || 1; 
  const totalEngagement = incomeData.reduce((acc, curr) => acc + curr.totalUsers, 0);


  const parcenttence = parcentTense(totalEngagement, totalUsers);




  return parcenttence;
};



const createCheckout = async (userId: any, payload: any) => {
  console.log('stripe payment', payload);
  let session = {} as { id: string };



  const lineItems = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Amount',
        },
        unit_amount: Math.round(payload.amount * 100),
      },
      quantity: 1,
    },
  ];

  console.log('lineItems=', lineItems);

  const sessionData: any = {
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `http://10.10.7.107:5002/api/v1/payment/stripe-success`,
    cancel_url: `http://10.10.7.107:5002/api/v1/payment/stripe-cancel`,
    line_items: lineItems,
    metadata: {
      userId: String(userId),
      orderId: String(payload.orderId),
    },
  };

  console.log('sessionData=', sessionData);

  try {
    console.log('try session');
    session = await stripe.checkout.sessions.create(sessionData);
    console.log('session==', session);

  } catch (error) {
    console.log('Error', error);
  }

  console.log('try session 22');
  const { id: session_id, url }: any = session || {};

  console.log({ url });

  return { url };
};

const automaticCompletePayment = async (event: Stripe.Event): Promise<void> => {
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log(
          'hit hise webhook controller servie checkout.session.completed',
        );
        const sessionData = event.data.object as Stripe.Checkout.Session;
        const {
          id: sessionId,
          payment_intent: paymentIntentId,
          metadata,
        }: SessionData = sessionData;
        const orderId = metadata?.orderId as string;
        const userId = metadata?.userId as string;

        if (!paymentIntentId) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Payment Intent ID not found in session',
          );
        }


        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId as string,
        );

        if (!paymentIntent || paymentIntent.amount_received === 0) {
          throw new AppError(httpStatus.BAD_REQUEST, 'Payment Not Successful');
        }

        const updateHireCreator: any = await HireCreator.findByIdAndUpdate(
          orderId,
          { status: 'pending', paymentStatus: 'paid' },
          { new: true },
        );
        console.log('updateHireCreator', updateHireCreator);

        if (!updateHireCreator) {
          throw new Error('HireCreator update failed!');
        }

        const subscriptioinExist: any = await Subscription.findById(
          updateHireCreator.subscriptionId,
        );
        if (!subscriptioinExist) {
          throw new Error('Subscription not found!');
        }

        if (
          subscriptioinExist.type === 'yearly' ||
          subscriptioinExist.type === 'monthly'
        ) {
          const updateTakeVideoCount =
            Number(subscriptioinExist.takeVideoCount) +
            Number(updateHireCreator.takeVideoCount);
          await Subscription.findByIdAndUpdate(
            updateHireCreator.subscriptionId,
            { takeVideoCount: updateTakeVideoCount, status: 'running' },
            { new: true },
          );
        } else {
          await Subscription.findByIdAndUpdate(
            updateHireCreator.subscriptionId,
            {
              takeVideoCount: subscriptioinExist.videoCount,
              status: 'running',
              brandPrice: Number(
                (paymentIntent.amount_received / 100).toFixed(2),
              ),
            },
            { new: true },
          );
        }

        const paymentData = {
          userId: updateHireCreator.userId,
          method: 'stripe',
          amount: Number(
            (paymentIntent.amount_received / 100).toFixed(2),
          ),
          status: 'paid',
          transactionId: paymentIntent.id,
          transactionDate: new Date(),
          subscriptionId: updateHireCreator.subscriptionId,
        };
        console.log('payment data', paymentData);

        const payment = await Payment.create(paymentData);
        console.log('payment', payment);
        if (!payment) {
          throw new AppError(httpStatus.BAD_REQUEST, 'Payment not created!');
        }


       
       
        const user = await User.findById(userId);
        if (!user) {
          throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
        }

       
        await HireCreator.deleteMany({ userId: user._id, status: 'draft' });
        await Subscription.deleteMany({ userId: user._id, status: 'pending' });
     

        const notificationData = {
          userId: userId,
          message: 'Order create successfull!!',
          type: 'success',
        };

        const notificationData1 = {
          role: 'admin',
          message: 'New Order create successfull!!',
          type: 'success',
        };

        const [notification, notification1] = await Promise.all([
          notificationService.createNotification(notificationData),
          notificationService.createNotification(notificationData1),
        ]);

        if (!notification || !notification1) {
          throw new AppError(404, 'Notification create faild!!');
        }

        console.log('Payment completed successfully:', {
          sessionId,
          paymentIntentId,
        });

        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const clientSecret = session.client_secret;
        const sessionId = session.id;

        if (!clientSecret) {
          console.warn('Client Secret not found in session.');
          throw new AppError(httpStatus.BAD_REQUEST, 'Client Secret not found');
        }

        // const payment = await Payment.findOne({ session_id: sessionId });

        // if (payment) {
        //   payment.status = 'Failed';
        //   await payment.save();
        //   // console.log('Payment marked as failed:', { clientSecret });
        // } else {
        //   console.warn(
        //     'No Payment record found for Client Secret:',
        //     clientSecret,
        //   );
        // }

        break;
      }

      default:
        // // console.log(`Unhandled event type: ${event.type}`);
        // res.status(400).send();
        return;
    }
  } catch (err) {
    console.error('Error processing webhook event:', err);
  }
};

const paymentRefundService = async (
  amount: number | null,
  payment_intent: string,
) => {
  const refundOptions: Stripe.RefundCreateParams = {
    payment_intent,
  };

  // Conditionally add the `amount` property if provided
  if (amount) {
    refundOptions.amount = Number(amount);
  }

  // console.log('refaund options', refundOptions);

  const result = await stripe.refunds.create(refundOptions);
  // console.log('refund result ', result);
  return 'Refund successful.';
};

const getAllEarningRatio = async (year: number, businessId: string) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year + 1, 0, 1);

  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalIncome: 0,
  }));

  // console.log({ months });

  const incomeData = await Payment.aggregate([
    {
      $match: {
        status: 'complete',
        transactionDate: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$transactionDate' } },
        totalIncome: { $sum: '$amount' },
      },
    },
    {
      $project: {
        month: '$_id.month',
        totalIncome: 1,
        _id: 0,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  incomeData.forEach((data) => {
    const monthData = months.find((m) => m.month === data.month);
    if (monthData) {
      monthData.totalIncome = data.totalIncome;
    }
  });

  return months;
};

// const refreshAccountConnect = async (
//   id: string,
//   host: string,
//   protocol: string,
// ): Promise<string> => {
//   const onboardingLink = await stripe.accountLinks.create({
//     account: id,
//     refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${id}`,
//     return_url: `${protocol}://${host}/api/v1/payment/success-account/${id}`,
//     type: 'account_onboarding',
//   });
//   return onboardingLink.url;
// };

// const createStripeAccount = async (
//   user: any,
//   host: string,
//   protocol: string,
// ): Promise<any> => {
//   // console.log('user',user);
//   const existingAccount = await StripeAccount.findOne({
//     userId: user.userId,
//   }).select('user accountId isCompleted');
//   // console.log('existingAccount', existingAccount);

//   if (existingAccount) {
//     if (existingAccount.isCompleted) {
//       return {
//         success: false,
//         message: 'Account already exists',
//         data: existingAccount,
//       };
//     }

//     const onboardingLink = await stripe.accountLinks.create({
//       account: existingAccount.accountId,
//       refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${existingAccount.accountId}`,
//       return_url: `${protocol}://${host}/api/v1/payment/success-account/${existingAccount.accountId}`,
//       type: 'account_onboarding',
//     });
//     // console.log('onboardingLink-1', onboardingLink);

//     return {
//       success: true,
//       message: 'Please complete your account',
//       url: onboardingLink.url,
//     };
//   }

//   const account = await stripe.accounts.create({
//     type: 'express',
//     email: user.email,
//     country: 'US',
//     capabilities: {
//       card_payments: { requested: true },
//       transfers: { requested: true },
//     },
//   });
//   // console.log('stripe account', account);

//   await StripeAccount.create({ accountId: account.id, userId: user.userId });

//   const onboardingLink = await stripe.accountLinks.create({
//     account: account.id,
//     refresh_url: `${protocol}://${host}/api/v1/payment/refreshAccountConnect/${account.id}`,
//     return_url: `${protocol}://${host}/api/v1/payment/success-account/${account.id}`,
//     type: 'account_onboarding',
//   });
//   // console.log('onboardingLink-2', onboardingLink);

//   return {
//     success: true,
//     message: 'Please complete your account',
//     url: onboardingLink.url,
//   };
// };

// const transferBalanceService = async (
//   accountId: string,
//   amt: number,
//   userId: string,
// ) => {
//   const withdreawAmount = await availablewithdrawAmount('stripe', userId);
//   // console.log('withdreawAmount===', withdreawAmount[0].totalAmount);

//   if (withdreawAmount[0].totalAmount < 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Amount must be positive');
//   }
//   const amount = withdreawAmount[0].totalAmount * 100;
//   const transfer = await stripe.transfers.create({
//     amount,
//     currency: 'usd',
//     destination: accountId,
//   });
//   // console.log('transfer', transfer);
//   if (!transfer) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Transfer failed');
//   }
//   let withdraw;
//   if (transfer) {
//     const withdrawData: any = {
//       transactionId: transfer.id,
//       amount: withdreawAmount[0].totalAmount,
//       method: 'stripe',
//       status: 'completed',
//       businessId: userId,
//       destination: transfer.destination,
//     };

//     withdraw = withdrawService.addWithdrawService(withdrawData);
//     if (!withdraw) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Withdrawal failed');
//     }
//   }
//   return withdraw;
// };
// 0 0 */7 * *

// cron.schedule('* * * * *', async () => {
//   // console.log('Executing transferBalanceService every 7 days...');
//   const businessUser = await User.find({
//     role: 'business',
//     isDeleted: false,
//   });
//   // console.log('businessUser==', businessUser);

//   for (const user of businessUser) {
//     // console.log('usr=====');
//     const isExiststripeAccount:any = await StripeAccount.findOne({
//       userId: user._id,
//       isCompleted: true,
//     });
//     // console.log('isExiststripeAccount', isExiststripeAccount);

//     if (!isExiststripeAccount) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Account not found');
//     }

//      // console.log('=====1')
//     await transferBalanceService(
//       isExiststripeAccount.accountId,
//       0,
//       isExiststripeAccount.userId,
//     );
//     // console.log('=====2');
//   }

//   // await transferBalanceService();
// });

export const paymentService = {
  addPaymentService,
  createPaypalPaymentService,
  createPaypalPaymentServiceDirect,
  reniewPaypalPaymentService,
  refundPaypalPaymentService,
  transferPaypalPaymentService,
  getAllPaymentService,
  singlePaymentService,
  deleteSinglePaymentService,
  getAllPaymentByCustomerService,
  getAllIncomeRatio,
  getAllOverview,
  getBrandEngagement,
  getAllSubscriptionUsersByWeekly,
  getAllIncomeRatiobyDays,
  createCheckout,
  automaticCompletePayment,
  getAllEarningRatio,
    paymentRefundService,
  //   filterBalanceByPaymentMethod,
  //   filterWithdrawBalanceByPaymentMethod,
  //   createStripeAccount,
  //   refreshAccountConnect,
  //   transferBalanceService,
};
