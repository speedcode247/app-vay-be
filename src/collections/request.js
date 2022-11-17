import mongoose from 'mongoose';
import config from '../app.config';

const Schema = mongoose.Schema({
  created_at: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    enum: config.app.withdraw_status,
    require: true,
    default: config.app.withdraw_status[0],
  },
  otp: {
    type: String,
    require: false,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  amount: { type: Number, require: true },
  contractId: {
    type: mongoose.Types.ObjectId,
    ref: 'contracts',
  },
  error: {
    type: String,
    require: false,
  },
});

const model = mongoose.model('requests', Schema);

export default model;
