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
  contractImageUrl: {
    type: String,
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
  active: {
    type: Number,
    require: true,
    default: 1,
  },
  blockedLogin: {
    type: Number,
    require: true,
    default: 0,
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
  supporterName: {
    type: String,
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
  name: {type: String, default: ''},
  dob: {type: String, default: ''},
  sex: {type: String, default: ''},
  address: {type: String, default: ''},
  id_number: {type: String, default: ''},
  id_front: {type: String, default: ''},
  id_back: {type: String, default: ''},
  id_with_face: {type: String, default: ''},
  submitAt: {type: Number},
  verifiedContactInfo: {type: Number, default: 0},
  verifiedPersonalInfo: {type: Number, default: 0},
  verifiedBankInfo: {type: Number, default: 0},
}, { strict: false });

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
