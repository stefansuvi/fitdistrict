// backend/models/Admin.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends mongoose.Document {
  username: string;
  password: string;
}

const adminSchema = new mongoose.Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash lozinke pre čuvanja
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
