import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { TUgcContent } from './ugcContent.interface';
import UgccreateUgcContent from './ugcContent.model';
import { access, unlink } from 'fs/promises';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import UGCContent from './ugcContent.model';

const createUgcContent = async (files: any, payload: TUgcContent) => {
  try {
    

    if (files.image && files.image.length > 0) {
      const image: any = await uploadToS3({
        file: files.image[0],
        fileName: files.image[0].originalname,
        folder: 'ugcContents/',
      });
      payload.image = image;
    }


    const result = await UgccreateUgcContent.create(payload);

    if (result) {
      const fileDeletePath = `${files.image[0].path}`;
      await unlink(fileDeletePath);
    }
    return result;
  } catch (error) {
    try {
      const fileDeletePath = `${files.image[0].path}`;
      await unlink(fileDeletePath);
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};

const getAllUgcContentQuery = async (query: Record<string, unknown>) => {
  const ugccreateUgcContentQuery = new QueryBuilder(
    UgccreateUgcContent.find({ }),
    query,
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ugccreateUgcContentQuery.modelQuery;

  const meta = await ugccreateUgcContentQuery.countTotal();
  return { meta, result };
};



const getSingleUgcContentQuery = async (id: string) => {
  const existingUgccreateUgcContent: any = await UGCContent.findById(id);
  if (!existingUgccreateUgcContent) {
    throw new AppError(404, 'UgccreateUgcContent not found!');
  }

  return existingUgccreateUgcContent;
};

const updateSingleUgcContentQuery = async (
  id: string,
  files: any,
  payload: any,
) => {
  try {
    console.log('id', id);
    console.log('updated payload', payload);

    // Find existing UgccreateUgcContent by ID
    const existingUgcContent: any = await UgccreateUgcContent.findById(id);
    if (!existingUgcContent) {
      throw new AppError(404, 'existingUgcContent not found!');
    }

    if (files?.image && files?.image.length > 0) {
      const image: any = await uploadToS3({
        file: files.image[0],
        fileName: files.image[0].originalname,
        folder: 'UgccreateUgcContents/',
      });
      payload.image = image;

      const result = await UgccreateUgcContent.findByIdAndUpdate(id, payload, {
        new: true,
      });
      if (result) {
        const fileDeletePath = `${files.image[0].path}`;
        await unlink(fileDeletePath);
      }

      const key = existingUgcContent.image.split('amazonaws.com/')[1];

      const deleteImage: any = await deleteFromS3(key);
      console.log('deleteImage', deleteImage);
      if (!deleteImage) {
        throw new AppError(404, 'Blog Image Deleted File !');
      }

      return result;
    } else {
      const result = await UgccreateUgcContent.findByIdAndUpdate(id, payload, {
        new: true,
      });
      return result;
    }
  } catch (error) {
    try {
      const fileDeletePath = `${files.image[0].path}`;
      await unlink(fileDeletePath);
    } catch (fsError) {
      console.error('Error accessing or deleting the image file:', fsError);
    }
    throw error;
  }
};

const deletedUgcContentQuery = async (id: string) => {
  if (!id) {
    throw new AppError(400, 'Invalid input parameters');
  }
  
  const existingUgccreateUgcContent: any = await UGCContent.findById(id);
  if (!existingUgccreateUgcContent) {
    throw new AppError(404, 'UgccreateUgcContent not found!');
  }

  const result = await UGCContent.findByIdAndDelete(
    id
    
  );
  if (!result) {
    throw new AppError(404, 'UgccreateUgcContent Result Not Found !');
  }

  return result;
};

export const ugcContentService = {
  createUgcContent,
  getAllUgcContentQuery,
  getSingleUgcContentQuery,
  updateSingleUgcContentQuery,
  deletedUgcContentQuery,
};
