import mongoose, { Schema} from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/types";


const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    fullName: { type: String },
    bio: { type: String, maxlength: 200 },
    avatar: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female"]
    },
    isAdmin: { type: Boolean, 
      default: false 
    },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
