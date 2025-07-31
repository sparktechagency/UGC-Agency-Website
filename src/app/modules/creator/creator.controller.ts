import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { creatorService } from './creator.service';

const createCreator = catchAsync(async (req, res) => {
  const payload = req.body;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const result = await creatorService.createCreator(imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Creator Create successful!!',
  });
});

const getAllCreator = catchAsync(async (req, res) => {
  const result = await creatorService.getAllCreatorQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.result,
    message: ' All Creator are requered successful!!',
  });
});

const getCreatorMe = catchAsync(async (req, res) => {
  const {userId} = req.user
  const result = await creatorService.getCreatorMeQuery(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Creator are info successful!!',
  });
});

const getSingleCreator = catchAsync(async (req, res) => {
  const result = await creatorService.getSingleCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Creator are requered successful!!',
  });
});

const updateSingleCreator = catchAsync(async (req, res) => {
  console.log('creator update contorller')
  const { userId } = req.user;
  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  const payload = req.body;

  const result = await creatorService.updateSingleCreatorQuery(userId, imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Creator  are updated successful!!',
  });
});


const approvedCancelSingleCreator = catchAsync(async (req, res) => {
  const { id } = req.params;
  const status = req.query.status as string;

  const result = await creatorService.approvedCancelSingleCreator(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single Creator  are updated successful!!',
  });
});

const deleteSingleCreator = catchAsync(async (req, res) => {
  const result = await creatorService.deletedCreatorQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single Creator are successful!!',
  });
});

export const creatorController = {
  createCreator,
  getAllCreator,
  getCreatorMe,
  getSingleCreator,
  updateSingleCreator,
  approvedCancelSingleCreator,
  deleteSingleCreator,
};
