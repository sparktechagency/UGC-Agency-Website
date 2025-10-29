import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import { assignTaskCreatorController } from './assignTaskCreator.controller';
import fileUpload from '../../middleware/fileUpload';

const assignTaskCreatorRouter = express.Router();
const upload = fileUpload('./public/uploads/uploadVideos');


assignTaskCreatorRouter
  .post(
    '/create-assign-task-creator',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    assignTaskCreatorController.createAssignTaskCreator,
  )
  .post(
    '/finally-create-assign-by-brand-creator',
    auth(USER_ROLE.USER),
    assignTaskCreatorController.finallyCreateAssignBrandCreator,
  )
  .get(
    '/assign',
    auth(USER_ROLE.CREATOR),
    assignTaskCreatorController.getAssignTaskCreatorByCreatorOrUser,
  )
  .get(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    assignTaskCreatorController.getAllAssignTaskCreator,
  )

  .get(
    '/approved-assign-creator/:id',
    auth(USER_ROLE.USER),
    assignTaskCreatorController.getAssignTaskCreatorByUser,
  )
  .get('/single/video/:id', assignTaskCreatorController.getSingleAssignTaskCreatorVideo)
  .get('/single/:id', assignTaskCreatorController.getSingleAssignTaskCreator)
  .get(
    '/hire-creator-to-assign-creator/:id',
    assignTaskCreatorController.getSingleHireCreatorToAssignTaskCreator,
  )
  .patch(
    '/status/:id',
    auth(USER_ROLE.CREATOR),
    assignTaskCreatorController.singleAssignTaskCreatorApprovedCancel,
  )
  .patch(
    '/approved-by-admin',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    assignTaskCreatorController.multipleAssignTaskCreatorApprovedByAdmin,
  )
  // .patch(
  //   '/uploadVideos/:id',
  //   auth(USER_ROLE.CREATOR),
  //   upload.fields([{ name: 'uploadVideos' }]),
  //   assignTaskCreatorController.assignTaskCreatorUploadVideosByCreator,
  // )
  // .patch(
  //   '/revision/:id',
  //   auth(USER_ROLE.USER),
  //   assignTaskCreatorController.assignTaskRevisionByUser,
  // )
  // .patch(
  //   '/revision/:id',
  //   auth(USER_ROLE.USER),
  //   assignTaskCreatorController.assignTaskRevisionByUser,
  // )
  // .patch(
  //   '/re-uploadVideos/:id',
  //   auth(USER_ROLE.CREATOR),
  //   upload.fields([{ name: 'uploadVideos' }]),
  //   assignTaskCreatorController.assignTaskCreatorReSubmitUploadVideosByCreator,
  // )
  .patch(
    '/uploadVideos/:id',
    auth(USER_ROLE.CREATOR),
    upload.fields([{ name: 'uploadVideos' }]),
    assignTaskCreatorController.assignTaskCreatorUploadVideosByCreator,
  )

  .patch(
    '/re-uploadVideos/:id',
    auth(USER_ROLE.CREATOR),
    upload.fields([{ name: 'uploadVideos' }]),
    assignTaskCreatorController.assignTaskCreatorReSubmitUploadVideosByCreator,
  )
  .patch(
    '/creator-payment-by-admin/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    assignTaskCreatorController.creatorPaymentByAdmin,
  )
  .delete(
    '/delete-video/:id',
    auth(USER_ROLE.CREATOR),
    assignTaskCreatorController.deleteSingleHireCreatorVideoDelete,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.CREATOR),
    assignTaskCreatorController.deleteSingleAssignTaskCreator,
  );

export default assignTaskCreatorRouter;
