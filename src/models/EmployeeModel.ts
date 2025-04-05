import { Schema, model } from 'mongoose';

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      enum: ['HR', 'Engineering', 'Marketing', 'Sales', 'Finance'], // Allowed values
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
); // Auto-adds `createdAt` and `updatedAt`

export const Employee = model('Employee', employeeSchema);
