import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { hash, compare } from 'bcrypt';
import config from '../app.config';

const Schema = new mongoose.Schema({
  telegramUrl: {
    type: String,
    default: null,
  },
  supportUrl: {
    type: String,
    default: null,
  },
}, { strict: false });

Schema.pre('save', async function (next) {
  try {
    next();
  } catch (err) {
    next(err);
  }
});

Schema.methods.comparePassword = async function (password) {
  return compare(password, this.password);
};
Schema.plugin(mongoosePaginate);
const SystemConfiguration = mongoose.model('systemConfiguration', Schema);

export default SystemConfiguration;
