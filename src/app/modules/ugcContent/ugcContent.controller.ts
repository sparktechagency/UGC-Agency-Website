import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ugcContentService } from './ugcContent.service';

const createUgcContent = catchAsync(async (req, res) => {
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
 

  const result = await ugcContentService.createUgcContent(imageFiles,payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'UgcContent Create successful!!',
  });
});

const getAllUgcContent = catchAsync(async (req, res) => {
  const { meta, result } = await ugcContentService.getAllUgcContentQuery(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    meta: meta,
    data: result,
    message: ' All UgcContent are requered successful!!',
  });
});



const getSingleUgcContent = catchAsync(async (req, res) => {
  const result = await ugcContentService.getSingleUgcContentQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single UgcContent are requered successful!!',
  });
});

const updateSingleUgcContent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;

  const imageFiles = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };
  

  const result = await ugcContentService.updateSingleUgcContentQuery(id, imageFiles, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Single UgcContent  are updated successful!!',
  });
});

const deleteSingleUgcContent = catchAsync(async (req, res) => {
  const result = await ugcContentService.deletedUgcContentQuery(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: 'Deleted Single UgcContent are successful!!',
  });
});


export const ugcContentController = {
  createUgcContent,
  getAllUgcContent,
  getSingleUgcContent,
  updateSingleUgcContent,
  deleteSingleUgcContent,
};
