import mongoose, { Schema, Document, Types } from "mongoose";


export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  gender?: "male" | "female" | "other";
  isAdmin: boolean;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  bookmarks: Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IComment {
  _id?: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  likes: number;
  replies: Types.ObjectId[]; // Reply comments (nested)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IArticle extends Document {
  title: string;
  content: string;
  coverImage?: string;
  author: Types.ObjectId;
  claps: number;
  tags: string[];
  category: Types.ObjectId;
  views: number;
  comments: IComment[];
  publishedAt: Date;
}

export interface ICategory extends Document {
    name: string;
}
