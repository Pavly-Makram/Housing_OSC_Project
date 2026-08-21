import { Schema, model, Document, Types } from 'mongoose';

export interface IInterestRequest extends Document {
  listing: Types.ObjectId | string;
  seeker: Types.ObjectId | string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const interestRequestSchema = new Schema<IInterestRequest>(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Listing reference is required'],
    },
    seeker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seeker reference is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export const InterestRequest = model<IInterestRequest>('InterestRequest', interestRequestSchema);