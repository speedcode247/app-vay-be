import * as service from './services';
import * as contractService from '../contracts/services';
import * as requestService from '../requests/services';
import * as paymentService from '../payments/services';
import IP from '../../collections/ips';
import { translate } from '../../translation/Translator';

export const getSystemConfig = async (req, res) => {
  try {
    const data = await service.getSystemConfig();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: translate('AuthenticationMessage2') });
  }
};

export const adminGetSystemConfig = async (req, res) => {
  try {
    const data = await service.getSystemConfig();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: translate('AuthenticationMessage2') });
  }
};

export const adminUpdateConfig = async (req, res) => {
  try {
    await service.updateSystemConfig(req.body);
    const data = await service.getSystemConfig();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: translate('AuthenticationMessage2') });
  }
};
