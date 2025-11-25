import { model, Schema } from 'mongoose';
import { TBlog } from './blog.interface';


const videos = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

const blogSchema = new Schema<TBlog>(
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
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    detailsTextEditor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Blog = model<TBlog>('Blog', blogSchema);
export default Blog;
