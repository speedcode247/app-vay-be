import User from '../../collections/user';
import moment from 'moment';

export const analyst = async (date) => {
  const start = new Date(moment(parseInt(date)).startOf('day')).getTime();
  const end = new Date(moment(parseInt(date)).endOf('day')).getTime();
  const data = await User.find({
    created_at: { $lte: end, $gte: start },
  });
  return data;
};
