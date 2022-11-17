import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { hash, compare } from 'bcrypt';
import config from '../app.config';

const Schema = new mongoose.Schema({
  role: {
    type: String,
    require: true,
    default: config.app.role[0],
    enum: [...config.app.role],
  },
  active_code: {
    type: String,
    require: true,
    default: null,
  },
  phone: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
    default: 'https://tcinvest.tcbs.com.vn/assets/images/default-avatar.svg',
  },
  created_at: {
    type: Number,
    require: true,
  },
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    require: false,
    ref: 'company',
  },
  balance: {
    type: Number,
    require: true,
    default: 0,
  },
  initRoute: {
    type: String,
    default: '/',
  },
  kyc: {
    type: {
      id_number: String, //
      name: String, //
      contact_phone: String, //
      address: String, //
      educated: String, //
      marital_status: String, //
      id_front: String, //
      id_back: String,
      id_with_face: String,
      status: String, // app.status
      confirmed_at: Number,
      bank: Object,
      dob: Number,
      job: String,
    },
    require: true,
    default: {},
  },

  supporter: {
    type: String,
    require: true,
    default: '',
  },
  toSupportAt: {
    type: Number,
    default: 0,
  },
  channelSupport: {
    type: String,
    enum: ['facebook', 'zalo'],
    default: 'zalo',
  },
});

Schema.pre('save', async function (next) {
  try {
    if (!this.isModified('password') || !this.password) return next();
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

Schema.methods.comparePassword = async function (password) {
  return compare(password, this.password);
};
Schema.plugin(mongoosePaginate);
const User = mongoose.model('users', Schema);

export default User;
