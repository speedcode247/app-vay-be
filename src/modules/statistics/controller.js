import * as service from './service';

export const getAnalyst = async (req, res) => {
  try {
    const data = await service.analyst(req.query.date);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};
