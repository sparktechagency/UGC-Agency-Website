import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { hireCreatorController } from './hireCreator.controller';

const hireCreatorRouter = express.Router();
const upload = fileUpload('./public/uploads/ugcImage');

hireCreatorRouter
  .post(
    '/create',
    auth(USER_ROLE.USER),
    upload.fields([{ name: 'ugcPhoto', maxCount: 1 }]),
    hireCreatorController.createHireCreator,
  )
  .post(
    '/createPackagePurchase',
    auth(USER_ROLE.USER),
    hireCreatorController.createPackagePurchase,
  )
  .get('/', hireCreatorController.getAllHireCreator)
  .get(
    '/user',
    auth(USER_ROLE.USER),
    hireCreatorController.getAllHireCreatorByUser,
  )
  .get(
    '/creator-all-orders',
    auth(USER_ROLE.CREATOR),
    hireCreatorController.getCreatorAllOrders,
  )
  .get('/:id', hireCreatorController.getSingleHireCreator)
  .patch(
    '/:id',
    //  auth(USER_ROLE.ADMIN),
    hireCreatorController.updateSingleHireCreator,
  )
  .patch(
    '/approved/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    hireCreatorController.approvedSingleHireCreator,
  )
  .patch(
    '/cancel/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    hireCreatorController.cancelSingleHireCreator,
  )
  .patch(
    '/uploadVideos/:id',
    auth(USER_ROLE.CREATOR),
    upload.fields([{ name: 'uploadVideos' }]),
    hireCreatorController.assignTaskCreatorUploadVideosByCreator,
  )
  .patch(
    '/revision/:id',
    auth(USER_ROLE.USER),
    hireCreatorController.assignTaskRevisionByUser,
  )
  .patch(
    '/re-uploadVideos/:id',
    auth(USER_ROLE.CREATOR),
    upload.fields([{ name: 'uploadVideos' }]),
    hireCreatorController.assignTaskCreatorReSubmitUploadVideosByCreator,
  )
  .delete(
    '/delete-video/:id',
    auth(USER_ROLE.CREATOR),
    hireCreatorController.deleteSingleHireCreatorVideoDelete,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    hireCreatorController.deleteSingleHireCreator,
  );

export default hireCreatorRouter;
