import * as services from './services';
import fs from 'fs';

export const addNewReferCode = async (req, res) => {
  try {
    let _newreferCode = req.payload.referCode
    await services.createUserReferCode(_newreferCode);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getReferCodeList = async (req, res) => {
  try {
    const { data, statistics } = await services.getAll(req.query, req.user);
    return res.status(200).json({ ...data, statistics });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const removeReferCode = async (req, res) => {
  try {
    await services.deleteReferCode({ referCodeId: req.params.id });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
