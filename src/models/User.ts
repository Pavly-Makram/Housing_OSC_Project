import { Schema, model, Document, Model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: 'Lister' | 'Seeker';
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    }, 
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['Lister', 'Seeker'],
      required: [true, 'Role is required (Lister or Seeker)'],
    },
  },
  {
    timestamps: true,
  }
);


export const User: Model<IUser> = model<IUser>('User', userSchema);