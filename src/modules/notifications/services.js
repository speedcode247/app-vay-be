import Model from '../../collections/notifications';
import config from '../../app.config';

export const createNotification = async (payload) => {
  const data = await Model.create({
    ...payload,
    createdAt: new Date().getTime(),
  });
  return data;
};

export const getNotificationsByUser = async (userId, filter) => {
  const data = await Model.paginate(
    { to: userId },
    {
      ...config.app.paginate_options,
      ...filter,
      sort: { createdAt: -1 },
    }
  );

  return data;
};

export const seen = async (notiId) => {
  await Model.findByIdAndUpdate(notiId, { status: true });
  return true;
};
