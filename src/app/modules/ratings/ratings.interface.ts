import { Types } from 'mongoose';

export type TReview = {
  userId: Types.ObjectId;
  rating?: number;
  review: string;
};
