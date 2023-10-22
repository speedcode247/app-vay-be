import User from '../../collections/user';
import { generateToken } from '../../utils/jwt';
import { createOTP, createPassword } from '../../utils/generator';
import { hash } from 'bcrypt';
import config from '../../app.config';
import _ from 'lodash';
import Company from '../../collections/company';

export const createToken = async (user) => {
  const access_token = await generateToken(
    user,
    config.secret_key,
    config.time_life_token
  );
  return access_token;
};

function randomIntByMinMax(min, max) {
  // min and max included
  let value = max;
  for (let i = 0; i < 100; i++) {
    value = Math.floor(Math.random() * (max - min + 1) + min);
  }
  return value;
}

let _staffListCounter = 0;
export const createUser = async ({ phone, password, hash ,ipAddress}) => {
  try {
    let staff = undefined;

    if (hash !== undefined) {
      staff = await Company.findById(hash);
    } else {
      let _staffList = await Company.find({is_active: true});
      let selectedStaffIndex = _staffListCounter;
      _staffListCounter++;
      if (_staffListCounter >= _staffList.length) {
        _staffListCounter = 0;
      }
      staff = _staffList[selectedStaffIndex];
    }
    const userRecord = await User.findOne({ phone }).lean().exec();
    const channelSupport = staff ? 'zalo' : 'facebook';
    let userAtrribute = {
      role: 'USER',
      phone,
      password,
      created_at: new Date().getTime(),
      channelSupport,
      ipAddress,
    };
    if (staff) {
      userAtrribute['supporter'] = staff ? staff.phone : null;
      userAtrribute['supporterName'] = staff ? staff.name : null;
    }
    if (userRecord) {
      return {
        code: 405,
        message: 'Số điện thoại đã được sử dụng, vui lòng đăng nhập.'
      }
    } else {
      const newUser = await User.create({ ...userAtrribute });
      return _.pick(newUser, ['_id', 'role']);
    }
  } catch (err) {
    throw new Error(err);
  }
};
export const updatePassword = async ({ userId, password }) => {
  const userRecord = await User.findById(userId);
  userRecord.password = password;
  userRecord.save();
  return true;
};

export const createAdmin = async ({ phone, password }) => {
  const userRecord = await User.findOne({ phone }).lean().exec();
  if (userRecord) {
    throw new Error('Tài khoản đã tồn tại');
  }
  const newUser = User.create({
    phone,
    password,
    active: true,
    role: 'ADMIN',
  });
  return _.pick(newUser, ['_id', 'role']);
};

export const createRoot = async ({ phone, password }) => {
  const userRecord = await User.findOne({ phone }).lean().exec();
  if (userRecord) {
    throw new Error('Tài khoản đã tồn tại');
  }
  const newUser = User.create({
    phone,
    password,
    active: true,
    role: 'ROOT',
  });
  return _.pick(newUser, ['_id', 'role']);
};
// createRoot({ phone: 'root.ser', password: '123456' });
// createAdmin({ phone: 'admin.ser', password: '123456' });

export const signin = async ({ phone, password }) => {
  const existedUser = await User.findOne({ phone });
  if (!existedUser) throw new Error('Số điện thoại chưa được đăng ký');

  const isValidPassword = await existedUser.comparePassword(password);
  if (!isValidPassword) throw new Error('Sai mật khẩu');

  return _.pick(existedUser, ['_id', 'role']);
};
