import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  membershipExpiry: string;
  trainer: string;
}

const ClientSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  membershipExpiry: { type: String, required: true },
  trainer: { type: String, required: true },
});

export const Client = mongoose.model<IClient>('Client', ClientSchema);
