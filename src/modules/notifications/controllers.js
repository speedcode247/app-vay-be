import * as service from './services';

export const getNotifications = async (req, res) => {
  try {
    const data = await service.getNotificationsByUser(req.user, req.query);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const seen = async (req, res) => {
  try {
    const data = await service.seen(req.params.id);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
