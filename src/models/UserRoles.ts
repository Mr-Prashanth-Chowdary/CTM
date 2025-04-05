const mongoose = require('mongoose')
const userRoleSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['tournament_orgniser', 'team_manager', 'fan', 'scorer'],
      required: true,
    },
  });

export const UserRole = mongoose.model('UserRole', userRoleSchema);
