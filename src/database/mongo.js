import mongoose from 'mongoose';
import config from '../app.config';

export const connection = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db.url, { ...config.db.options }, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Connected to : ${res.connections[0].name} database`);
  });
};
