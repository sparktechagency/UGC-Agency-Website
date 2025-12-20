/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { DeleteAccountPayload, TUser, TUserCreate } from './user.interface';
import { User } from './user.models';
import { USER_ROLE } from './user.constants';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { otpServices } from '../otp/otp.service';
import { generateOptAndExpireTime } from '../otp/otp.utils';
import { TPurposeType } from '../otp/otp.interface';
import { otpSendEmail } from '../../utils/eamilNotifiacation';
import { createToken, verifyToken } from '../../utils/tokenManage';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Otp from '../otp/otp.model';
import { imageUrlGenarate } from '../../utils/imageUrl';
import { sendEmail } from '../../utils/mailSender';
import { getDeliveryEmailTemplate } from '../hireCreator/hireCreator.utils';

export type IFilter = {
  searchTerm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface OTPVerifyAndCreateUserProps {
  otp: string;
  token: string;
}

const email = async () => {
  await sendEmail(
    'dev.humayonforid44@gmail.com',
    'Task Successfully Delivered! 🎉',
    //  getDeliveryEmailTemplate('Humayon Forid'),

    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Delivery Accepted</title>

<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

table {
  border-collapse: collapse;
}

h1, h2, h3, p {
  margin: 0;
  padding: 0;
  font-family: "Source Serif 4", serif;
}
</style>
</head>

<body>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">

<!-- EMAIL CONTAINER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

<!-- HEADER -->
<tr>
<td style="background:#b5c4d4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
          DELIVERY<br>ACCEPTED!
        </h1>
      </td>
      <td align="right">
        <div style="width:85px; height:85px; background:#fce8a4; border-radius:50%; text-align:center;">
          <div style="font-size:20px; font-weight:700; padding-top:22px; color:#000;">TSC</div>
          <div style="font-size:7px; font-weight:500; color:#000;">THE SOCIAL CHANCE</div>
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;">
  <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
    Hello Rama,
  </h2>

  <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
    <p style="margin-bottom:15px;">
      Great news! Your delivery for Project ID: cbjscslkcmsömc has been officially accepted by the client.
    </p>
    <p style="margin-bottom:15px;">
      Thank you for your hard work, professionalism, and creativity. The client is very happy with the results.
    </p>
    <p style="margin-bottom:15px;">
      We will contact you shortly to request your bank details so we can process your payment.
    </p>
    <p style="margin-bottom:15px;">
      If you have any questions, feel free to reach out.
    </p>
    <p style="margin-bottom:15px;">
      Keep up the amazing work!
    </p>
    <p style="margin-top:20px;">
      Best Regards,<br>The Social Chance
    </p>
  </div>

  <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
    This is an automated email, do not reply.
  </p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#fce8a4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
          Support email.
        </h3>

        <p style="margin-bottom:5px;">
          <a href="mailto:Shamimnader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Shamimnader@thesocialchance.com
          </a>
        </p>

        <p style="margin-bottom:10px;">
          <a href="mailto:Fareshtanader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Fareshtanader@thesocialchance.com
          </a>
        </p>

        <div style="margin-top:20px;">
          <a href="https://google.com">
            <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.tiktok.com">
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.instagram.com">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://x.com">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20">
          </a>
        </div>
      </td>

      <td align="right" valign="bottom">
        <div style="font-size:90px; opacity:0.7;">📢</div>
      </td>
    </tr>
  </table>
</td>
</tr>

</table>
<!-- END CONTAINER -->

</td>
</tr>
</table>

</body>
</html>
`,
  );
};

const createUserToken = async (payload: TUserCreate) => {
  const { role, email, fullName, password } = payload;

  // user role check
  if (!(role === USER_ROLE.USER)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User data is not valid !!');
  }

  // user exist check
  const userExist = await userService.getUserByEmail(email);

  if (userExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already exist!!');
  }

  const { isExist, isExpireOtp } = await otpServices.checkOtpByEmail(email);
  // console.log({ isExist });
  // console.log({ isExpireOtp });

  const { otp, expiredAt } = generateOptAndExpireTime();
  // console.log({ otp });
  // console.log({ expiredAt });

  let otpPurpose: TPurposeType = 'email-verification';

  if (isExist && !isExpireOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'otp-exist. Check your email.');
  } else if (isExist && isExpireOtp) {
    const otpUpdateData = {
      otp,
      expiredAt,
      status: 'pending',
    };

    await otpServices.updateOtpByEmail(email, otpUpdateData);
  } else if (!isExist) {
    await otpServices.createOtp({
      name: fullName,
      sentTo: email,
      receiverType: 'email',
      purpose: otpPurpose,
      otp,
      expiredAt,
    });
  }

  // const otpBody: any = {
  //   email,
  //   fullName,
  //   password,
  //   role,
  // };

  // console.log({ otpBody });
  console.log({ otp });

  // send email
  process.nextTick(async () => {
    await otpSendEmail({
      sentTo: email,
      subject: 'Your one time otp for email  verification',
      name: fullName,
      otp,
      expiredAt: expiredAt,
    });
    // // console.log({alala})
  });

  console.log('payload====', payload);

  // crete token
  const createUserToken = createToken({
    payload: payload,
    access_secret: config.jwt_access_secret as string,
    expity_time: config.otp_token_expire_time as string | number,
  });

  return createUserToken;
};

const otpVerifyAndCreateUser = async ({
  otp,
  token,
}: OTPVerifyAndCreateUserProps) => {
  // console.log('otp',otp)
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token not found');
  }
  console.log('token', token);
  const decodeData = verifyToken({
    token,
    access_secret: config.jwt_access_secret as string,
  });
  console.log({ decodeData });

  if (!decodeData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You are not authorised');
  }

  const { password, email, fullName, role, profile, ...rest } = decodeData;

  const isOtpMatch = await otpServices.otpMatch(email, otp);

  if (!isOtpMatch) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP did not match');
  }

  process.nextTick(async () => {
    await otpServices.updateOtpByEmail(email, {
      status: 'verified',
    });
  });

  if (!(role === USER_ROLE.USER || role === USER_ROLE.CREATOR)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User data is not valid !!');
  }

  const isExist = await User.isUserExist(email as string);

  if (isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  const userData = {
    password,
    email,
    fullName,
    role,
    profile,
  };

  const user = await User.create(userData);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
  }

  // const jwtPayload: {
  //   userId: string;
  //   role: string;
  //   fullName: string;
  //   email: string;
  // } = {
  //   fullName: user?.fullName,
  //   email: user.email,
  //   userId: user?._id?.toString() as string,
  //   role: user?.role,
  // };

  // const userToken = createToken({
  //   payload: jwtPayload,
  //   access_secret: config.jwt_access_secret as string,
  //   expity_time: config.jwt_access_expires_in as string | number,
  // });

  return user;
};

const creatorUserService = async (payload: any) => {
  const { role, email, fullName, password, ...rest } = payload;

  if (!(payload.role === USER_ROLE.CREATOR)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User data is not valid !!');
  }

  const isExist = await User.isUserExist(payload.email as string);

  if (isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  const userData = {
    password: payload.password,
    email: payload.email,
    fullName: payload.fullName,
    role: 'creator',
  };
  console.log('userData', userData);

  const user = await User.create(userData);

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
  }

  // const jwtPayload: {
  //   userId: string;
  //   role: string;
  //   fullName: string;
  //   email: string;
  // } = {
  //   fullName: user?.fullName,
  //   email: user.email,
  //   userId: user?._id?.toString() as string,
  //   role: user?.role,
  // };

  // const userToken = createToken({
  //   payload: jwtPayload,
  //   access_secret: config.jwt_access_secret as string,
  //   expity_time: config.jwt_access_expires_in as string | number,
  // });

  return user;
};

const switchRoleUser = async (id: string) => {
  const swichUser = await User.findById(id);
  // console.log('swichUser', swichUser);

  if (!swichUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
  // console.log('as role', swichUser.asRole)
  let swichRole;
  if (swichUser.role == 'user') {
    swichRole = 'sub_admin';
  } else {
    swichRole = 'user';
  }

  console.log('swichRole', swichRole);

  const user = await User.findByIdAndUpdate(
    id,
    { role: swichRole },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User swich failed');
  }

  return user;
};

// const userSwichRoleService = async (id: string) => {
//   const swichUser = await User.findById(id);
//   // console.log('swichUser', swichUser);

//   if (!swichUser) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
//   }
//   // console.log('as role', swichUser.asRole)
//    let swichRole;
//   if (swichUser.role == 'business') {

//       swichRole = 'customer';

//     }else{

//       swichRole = 'business';
//     }

//     console.log('swichRole', swichRole);

//     const user = await User.findByIdAndUpdate(
//       id,
//       { role: swichRole },
//       { new: true },
//     );

//     if (!user) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'User swich failed');
//     }

//     return user;
// };

// const userSwichRoleService = async (id: string) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const swichUser = await User.findById(id).session(session);

//     if (!swichUser) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
//     }

//     const swichRole =
//       swichUser.asRole === 'customer_business'
//         ? swichUser.role === 'customer'
//           ? 'business'
//           : 'customer'
//         : swichUser.role === 'customer'
//           ? 'business'
//           : 'customer';

//     const [user, oppositeRoleUser] = await Promise.all([
//       User.findByIdAndUpdate(
//         id,
//         { role: swichRole, asRole: swichRole },
//         { new: true, session },
//       ),
//       User.findOneAndUpdate(
//         {
//           email: swichUser.email,
//           role: swichRole === 'customer' ? 'business' : 'customer',
//         },
//         {
//           role: swichRole === 'customer' ? 'business' : 'customer',
//           asRole: swichRole === 'customer' ? 'business' : 'customer',
//         },
//         { new: true, session },
//       ),
//     ]);

//     if (!user || !oppositeRoleUser) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'User switch failed');
//     }

//     await session.commitTransaction();
//     session.endSession();

//     return user;
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw error;
//   }
// };

const updateUser = async (id: string, payload: Partial<TUser>) => {
  console.log('payload=', payload);
  const { role, email, ...rest } = payload;
  console.log('rest', rest);
  rest.profile = imageUrlGenarate(rest.profile as string);

  const user = await User.findByIdAndUpdate(id, rest, { new: true });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User updating failed');
  }

  return user;
};

// ............................rest

const getAllUserQuery = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find({}), query)
    .search(['email', 'fullName'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();
  return { meta, result };
};

const getAllUserCount = async () => {
  const allBusinessCount = await User.countDocuments({
    role: USER_ROLE.USER,
  });
  const result = {
    allBusinessCount,
  };
  return result;
};

const getAllUserRatio = async (year: number) => {
  const startOfYear = new Date(year, 0, 1); // January 1st of the given year
  const endOfYear = new Date(year + 1, 0, 1); // January 1st of the next year

  // Create an array with all 12 months to ensure each month appears in the result
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    userCount: 0, // Default count of 0
  }));

  const userRatios = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfYear,
          $lt: endOfYear,
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' }, // Group by month (1 = January, 12 = December)
        userCount: { $sum: 1 }, // Count users for each month
      },
    },
    {
      $project: {
        month: '$_id', // Rename the _id field to month
        userCount: 1,
        _id: 0,
      },
    },
    {
      $sort: { month: 1 }, // Sort by month in ascending order (1 = January, 12 = December)
    },
  ]);

  // Merge the months array with the actual data to ensure all months are included
  const fullUserRatios = months.map((monthData) => {
    const found = userRatios.find((data) => data.month === monthData.month);
    return found ? found : monthData; // Use found data or default to 0
  });

  return fullUserRatios;
};

const getUserById = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const getUserByEmail = async (email: string) => {
  const result = await User.findOne({ email, isDeleted: false });

  return result;
};

const deleteMyAccount = async (id: string, payload: DeleteAccountPayload) => {
  const user: TUser | null = await User.IsUserExistById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted');
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password does not match');
  }

  const userDeleted = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  const otpUpdate = await Otp.deleteOne({ sentTo: user.email });

  // const userDeleted = await User.findByIdAndDelete(id);

  // const otpDelete = await Otp.deleteOne({ sentTo: user.email });

  // if (!otpDelete) {
  //   throw new AppError(httpStatus.BAD_REQUEST, 'user Otp deleted failed');
  // }

  if (!userDeleted || !otpUpdate) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user deleting failed');
  }

  return userDeleted;
};

const blockedUser = async (id: string, userId: string) => {
  const existUser: TUser | null = await User.findById(id);

  if (!existUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const blocker: TUser | null = await User.findById(userId);

  if (!blocker) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  if (existUser.role === blocker.role) {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot block this Person!!');
  }
  if (existUser.role === 'super_admin' || blocker.role === 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot block this Person!!');
  }

  const blockUnblockSwich = existUser.isActive ? false : true;

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: blockUnblockSwich },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user blocking failed');
  }

  return user;
};

export const userService = {
  createUserToken,
  email,
  otpVerifyAndCreateUser,
  creatorUserService,
  switchRoleUser,
  // userSwichRoleService,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteMyAccount,
  blockedUser,
  getAllUserQuery,
  getAllUserCount,
  getAllUserRatio,
};
