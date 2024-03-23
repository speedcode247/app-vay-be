import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

import { hash, compare } from 'bcrypt';
import config from '../app.config';

const Schema = new mongoose.Schema({
  referCode: {
    type: String,
    require: true,
    default: config.app.role[0],
    enum: [...config.app.role],
  },
  
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
const User = mongoose.model('userReferCodes', Schema);

export default User;
