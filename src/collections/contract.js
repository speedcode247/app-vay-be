import mongoose from 'mongoose';
import config from '../app.config';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = new mongoose.Schema({
  created_at: {
    type: Number,
    require: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
  },
  times: {
    type: Number,
    require: true,
  },
  signature_capture: {
    type: String, // url image
    require: true,
  },
  status: {
    type: String,
    require: true,
    enum: config.app.contract_status,
  },
  otp: {
    type: String,
    require: false,
  },
  amount: {
    type: Number,
    require: true,
  },
  response: {
    type: String,
    require: true,
    default: null,
  },
  slug: {
    type: String,
    require: true,
    default: '',
  },
});

Schema.plugin(mongoosePaginate);

const Contract = mongoose.model('contracts', Schema);
export default Contract;
