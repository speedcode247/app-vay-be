require('dotenv').config();
console.log(process.env.MONGO_URI)
export default {
  port: process.env.PORT,
  db: {
    url: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      poolSize: 10,
    },
  },
  secret_key: process.env.SECRET_KEY,
  time_life_token: '100h',
  app: {
    role: ['USER', 'ADMIN', 'ROOT', 'STAFF'],
    contract_status: ['pending', 'accepted', 'rejected'],
    kyc_status: ['pending', 'accepted', 'rejected'],
    withdraw_status: ['pending', 'accepted', 'rejected','onhold'],
  },
};
