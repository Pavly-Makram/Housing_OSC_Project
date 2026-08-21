import { Schema, model, Document, Types } from 'mongoose';

export interface IListing extends Document {
  location: string;
  price: number;
  roomsAvailable: number;
  description: string;
  isAvailable: boolean;
   owner: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>(
  {
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be a positive number'],
    },
    roomsAvailable: {
      type: Number,
      required: [true, 'Rooms available is required'],
      min: [1, 'Rooms available must be at least 1'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing owner is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const Listing = model<IListing>('Listing', listingSchema);