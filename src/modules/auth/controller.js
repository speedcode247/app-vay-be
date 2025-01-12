import * as service from './service';
import config from '../../app.config';
import { getProfile } from '../users/services';
import { findReferCode } from '../userReferCode/services';
import { translate } from '../../translation/Translator';

let blockIp = ["127.0.0.1"];
if (process.env.BLOCK_IPS) {
  let blockIpArr = process.env.BLOCK_IPS;
  blockIp = blockIpArr.split(";");
}
export const signup = async (req, res) => {
  try {
    let ipAddress = req.socket.remoteAddress;
    ipAddress = ipAddress.split(":");
    ipAddress = ipAddress[ipAddress.length - 1];
    console.log(ipAddress);
    console.log(blockIp)
    // if (blockIp.indexOf(ipAddress) >= 0) {
    //   console.log(`BLOCK IP ${ipAddress}`)
    //   return res
    //   .status(201)
    //   .json({ success: true, ...req.body });
    // }
    // console.log(req.body)
    // if (req.body.referCode) {
    //   let _existingReferCode = await findReferCode({referCode: req.body.referCode});
    //   console.log(_existingReferCode)
    //   if (!_existingReferCode || _existingReferCode.length === 0) {
    //     return res.status(400).json({ message: translate('AuthenticationMessage11') });
    //   }
    // }
    const user = await service.createUser({ ...req.body, ipAddress });
    if (user.code === 405) {
      return res
        .status(201)
        .json({ success: true, ...user });
    }

    const token = await service.createToken({
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

export const login = async (req, res) => {
  try {
    const user = await service.signin({ ...req.body });
    let _currentUser = await getProfile(user._id);
    if (_currentUser.blockedLogin) {
      return res.status(400).json({ message: "Tài khoản bị khóa" });
    }
    const token = await service.createToken({
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

export const verify = async (req, res) => {
  try {
    const user = await service.verifyCode({
      phone: req.body.phone,
      code: req.body.code,
    });
    const token = await service.createToken({ _id: user._id, role: user.role });
    return res.status(200).json({ access_token: token });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    if (req.role === 'USER') {
      const { password } = req.body;
      await service.updatePassword({ userId: req.user, password });
    } else {
      const { password, userId } = req.body;
      await service.updatePassword({ userId, password });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const data = await service.createAdmin({
      phone: req.body.name,
      password: req.body.password,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
