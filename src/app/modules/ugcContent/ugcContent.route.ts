import express from 'express';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import fileUpload from '../../middleware/fileUpload';
import { ugcContentController } from './ugcContent.controller';

const ugcContentRouter = express.Router();
const upload = fileUpload('./public/uploads/ugcContent');


ugcContentRouter
  .post(
    '/create-ugc-content',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    ugcContentController.createUgcContent,
  )
  .get('/', ugcContentController.getAllUgcContent)
  .get('/:id', ugcContentController.getSingleUgcContent)
  .patch(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    upload.fields([{ name: 'image', maxCount: 1 }]),
    ugcContentController.updateSingleUgcContent,
  )
  .delete(
    '/:id',
    auth(USER_ROLE.ADMIN, USER_ROLE.SUB_ADMIN),
    ugcContentController.deleteSingleUgcContent,
  );

export default ugcContentRouter;
