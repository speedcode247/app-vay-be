import * as services from './services';

export const userGetPayment = async (req, res) => {
  try {
    const data = await services.userGetPayment(req.user);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminGetPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await services.userGetPayment(id);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
