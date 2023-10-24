import * as services from './services';
import fs from 'fs';

export const updateAllNote = async (req, res) => {
  try {
    const { user } = req;
    const payload = req.body;
    fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(payload))
    return res.status(200).json({ data: payload });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getAllNote = async (req, res) => {
  try {
    console.log("hahaa")
    const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
