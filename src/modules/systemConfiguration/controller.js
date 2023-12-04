import * as service from './services';
import * as contractService from '../contracts/services';
import * as requestService from '../requests/services';
import * as paymentService from '../payments/services';
import IP from '../../collections/ips';

export const getSystemConfig = async (req, res) => {
  try {
    const data = await service.getSystemConfig();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: 'Phiên đăng nhập hết hạn , vui lòng đăng nhập lại !' });
  }
};

export const adminGetSystemConfig = async (req, res) => {
  try {
    const data = await service.getSystemConfig();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: 'Phiên đăng nhập hết hạn , vui lòng đăng nhập lại !' });
  }
};

export const adminUpdateConfig = async (req, res) => {
  try {
    await service.updateSystemConfig(req.body.data);
    const data = await service.getSystemConfig();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: 'Phiên đăng nhập hết hạn , vui lòng đăng nhập lại !' });
  }
};
