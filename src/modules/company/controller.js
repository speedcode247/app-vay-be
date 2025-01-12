import Model from '../../collections/company';
import { createToken, createUser } from '../auth/service';
import * as service from './services';

export const getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const getInfo = async (req, res) => {
  try {
    const data = await service.analystOnDay();
    return res.status(200).json({ data: data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateInfo = async (req, res) => {
  try {
    const { _id } = req.params;
    await Model.findByIdAndUpdate(_id, {
      phone: req.body.phone,
      limit: req.body.limit,
      name: req.body.name,
    });
    return res.status(200).json({ sucess: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const { phone, name, password } = req.body;
    const _role = 'STAFF';
    let _password = phone;
    if (password) {
      _password = password;
    }
    const user = await createUser({ phone, password: _password, role: _role });
    
    if (user.code === 405) {
      return res
      .status(201)
      .json({ success: true, ...user });
    }

    await Model.create({
      phone,
      name,
      userId: user._id
    });

    const token = await createToken({
      _id: user._id,
      role: user.role,
    });
    
    return res
      .status(200)
      .json({ success: true, access_token: token, role: user.role });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const toggle = async (req, res) => {
  try {
    const { _id } = req.params;
    const current_user = await Model.findById(_id);
    current_user.is_active = !current_user.is_active;
    current_user.save();
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { _id } = req.params;
    const current_user = await Model.findByIdAndDelete(_id);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
