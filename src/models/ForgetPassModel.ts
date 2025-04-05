import mongoose from 'mongoose';

const ForgetPassSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  otp: {
    type: String, 
    required: true
  },
  exp_time: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

export const ForgetPass = mongoose.model('ForgetPass', ForgetPassSchema);
