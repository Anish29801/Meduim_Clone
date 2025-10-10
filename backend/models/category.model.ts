import mongoose, { Schema} from "mongoose";
import { ICategory } from "../types/types";

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model<ICategory>("Category", categorySchema);
