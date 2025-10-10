import mongoose, { Schema} from "mongoose";
import { IArticle, IComment } from "../types/types";

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    claps: { type: Number, default: 0 },
    tags: [{ type: String, lowercase: true, trim: true }],
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    views: { type: Number, default: 0 },
    comments: [commentSchema],
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IArticle>("Article", articleSchema);
