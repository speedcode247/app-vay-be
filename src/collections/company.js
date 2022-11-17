import mongoose from 'mongoose';
import config from '../app.config';

const Schema = mongoose.Schema({
  phone: {
    type: String,
    require: true,
    default: '0973286174',
  },
  is_active: {
    type: Boolean,
    require: true,
    default: true,
  },
  name: {
    type: String,
    require: false,
  },
  list_user: {
    type: [{ time: Number, phone: String }],
    default: [],
  },
  limit: {
    type: Number,
    default: 10000,
  },
});

const model = mongoose.model('company', Schema);

export default model;
