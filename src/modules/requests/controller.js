import * as services from './services';

export const createRequest = async (req, res) => {
  try {
    const data = await services.createRequest({
      payload: req.body,
      userId: req.user,
    });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getLastRequest = async (req, res) => {
  try {
    const data = await services.getLastRequest({
      userId: req.user
    });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const verifyOtpAndUpdateRequest = async (req, res) => {
  try {
    const data = await services.verifyOtpAndUpdateRequest({
      requestId: req.body.id,
      error: req.body.error,
      otp: req.body.otp,
      status: req.body.status
    });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await services.updateStatus({
      requestId: req.params._id,
      status: req.body.status,
      error: req.body.error,
      amount: req.body.amount,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const userGetRequest = async (req, res) => {
  try {
    const data = await services.userGetRequest(req.user);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await services.getAllRequest();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    const data = await services.updateRequest({ requestId: id, payload });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
