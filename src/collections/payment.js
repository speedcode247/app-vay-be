import mongoose from 'mongoose';
import config from '../app.config';

const Schema = mongoose.Schema({
  created_at: {
    type: Number,
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  amount: {
    type: Number,
    require: true,
    default: 0,
  },
  description: {
    type: String,
    require: true,
    default: 'Thay đổi số dư',
  },
});

const model = mongoose.model('payments', Schema);

export default model;
