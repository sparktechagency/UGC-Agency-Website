import { Types } from 'mongoose';

export type TReview = {
  hireCreatorId: Types.ObjectId;
  userId: Types.ObjectId;
  creatorId: Types.ObjectId;
  rating: number;
  review: string;
};
