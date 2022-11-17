import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  ipAddress: {
    type: String,
  },
  from: {
    type: String,
  },
  createdAt: {
    type: Number,
  },
});

const IpAddress = mongoose.model('ips', Schema);

export default IpAddress;
