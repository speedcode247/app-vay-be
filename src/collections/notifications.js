import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: false,
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  message: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Number,
  },
});
Schema.plugin(mongoosePaginate);

const Payment = mongoose.model('notifications', Schema);

export default Payment;
