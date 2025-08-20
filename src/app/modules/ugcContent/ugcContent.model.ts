import { model, Schema } from 'mongoose';
import { TUgcContent } from './ugcContent.interface';



const ugcContentSchema = new Schema<TUgcContent>(
  {
    image: {
      type: String,
      required: [true, 'Images are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one File is required',
      },
    },
    details: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true },
);

const UGCContent = model<TUgcContent>('UGCContent', ugcContentSchema);
export default UGCContent;
