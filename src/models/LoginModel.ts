import mongoose from 'mongoose';
const LoginSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    access_token: String,
    access_token_exp: Date,
    is_active: Boolean,
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
  });
  export const Login = mongoose.model('Login', LoginSchema);