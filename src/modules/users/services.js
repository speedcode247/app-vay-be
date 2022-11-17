import User from '../../collections/user';
import Company from '../../collections/company';
import _ from 'lodash';
import config from '../../app.config';
import * as paymentService from '../payments/services';
import Contract from './../../collections/contract';
import moment from 'moment';
import { ChoiceThePossibleSupporter, addUserToList } from '../company/services';
export const getProfile = async (_id) => {
  const current_user = await User.findById(_id);
  if (!current_user) throw new Error('User is not existed');
  return current_user;
};

export const updateProfile = async (_id, payload) => {
  const data = await User.findByIdAndUpdate(_id, { ...payload });
  if (!data) throw new Error('User is not existed');
  return true;
};

export const updatePassword = async ({
  _id,
  current_password,
  new_password,
}) => {
  if (current_password === new_password)
    throw new Error(`New password can not be old password`);

  const current_user = await User.findById(_id);

  const isValidPassword = await current_user.comparePassword(current_password);
  if (!isValidPassword) throw new Error(`Wrong password`);
  current_user.password = new_password;
  await current_user.save();

  return true;
};

export const requestVerify = async ({ userId, kyc_payload }) => {
  const current_user = await User.findById(userId);
  if (current_user.kyc.status === config.app.kyc_status[1])
    throw new Error('Tài khoản của bạn đã được xác minh danh tính');

  const required_fields = [
    'id_number',
    'name',
    'contact_phone',
    'address',
    'educated',
    'marital_status',
    'id_front',
    'id_back',
    'id_with_face',
    'bank',
    'job',
    'dob',
    'income',
    'purpose',
    'sex',
    'relative_number',
    'relative',
  ];

  const payload_fields = Object.keys(kyc_payload);
  // if (payload_fields.length !== required_fields.length)
  //   throw new Error('Thông tin cung cấp chưa đầy đủ');

  payload_fields.map((item) => {
    if (!required_fields.includes(item))
      throw new Error(`Không có quyền thay đổi ${item}`);
  });

  current_user['kyc'] = { ...kyc_payload, status: config.app.kyc_status[0] };
  current_user.save();
  return true;
};

// admin service
export const updateUserFromAdmin = async (userId, kyc_payload) => {
  const current_user = await User.findById(userId);
  current_user.kyc = { ...kyc_payload };
  current_user.save();
  return true;
};

const options = {
  lean: true,
  limit: 10,
};

export const getAll = async (filter) => {
  const arrayMetaTranslated = filter.meta.split(',').map((item) => {
    if (item == 1) return undefined;
    if (item == 2) return 'pending';
    if (item == 3) return 'accepted';
    return null;
  });
  if (filter.meta.split(',').length == 0) arrayMetaTranslated.push(filter.meta);
  const optionType = {
    'kyc.status': { $in: arrayMetaTranslated },
  };
  // if (filter.search) {
  //   optionType['kyc.id_number'] = { $regex: `${filter.searchId}` };
  // }
  const data = await User.paginate(
    { 
      $or: [
        {
          phone: { $regex: `${filter.search}` },
        },
        {
          'kyc.id_number': { $regex: `${filter.search}` },
        }
      ],
      role: 'USER', ...optionType
    },
    { ...options, ...filter, sort: { created_at: -1 } }
  );
  const tmp = data.docs.map((item) => ({ ...item, ...item.kyc }));
  data.docs = tmp;
  return { data };
};

export const toggleActivity = async ({ userId }) => {
  const current_user = await User.findById(userId);

  current_user.active = !current_user.active;
  current_user.save();
};

export const confirmVerify = async ({ userId, payload }) => {
  const current_user = await User.findById(userId);
  const { kyc } = current_user;
  const updated_kyc = {
    ...kyc,
    status: payload,
    confirmed_at: new Date().getTime(),
  };
  current_user.kyc = updated_kyc;
  current_user.save();
  return true;
};

//

export const deleteUser = async ({ userId }) => {
  await User.findByIdAndDelete(userId);
  return true;
};

export const updateBalance = async (user, payload) => {
  const currentUser = await User.findById(user);
  if (payload.status) {
    currentUser.balance =
      parseInt(currentUser.balance) + parseInt(payload.amount);
    currentUser.save();
  } else {
    currentUser.balance =
      parseInt(currentUser.balance) - parseInt(payload.amount);
    currentUser.save();
  }
  await paymentService.createPayment({
    payload: {
      userId: currentUser._id,
      amount: payload.amount,
      description: payload.description,
      status: payload.status,
    },
  });
  return true;
};

export const exportUser = async ({ type, startDate, endDate, isGetAll }) => {
  if (isGetAll == 'true') {
    const users = await User.find();
    const listContracts = await Contract.find({ status: 'accepted' }).populate(
      'userId'
    );
    let res = [];
    if (type == 'yet') {
      res = users.filter((item) => _.isEmpty(item['kyc']));
    }
    if (type == 'process') {
      res = users.filter((item) => !_.isEmpty(item['kyc']));
    }
    if (type == 'done') {
      res = listContracts.map((item) => item.userId);
    }
    return res;
  } else {
    const users = await User.find({
      created_at: { $gte: startDate, $lt: endDate },
    });
    const listContracts = await Contract.find({
      status: 'accepted',
      confirmed_at: { $gte: startDate, $lt: endDate },
    }).populate('userId');
    let res = [];
    if (type == 'yet') {
      res = users.filter((item) => _.isEmpty(item['kyc']));
    }
    if (type == 'process') {
      res = users.filter((item) => !_.isEmpty(item['kyc']));
    }
    if (type == 'done') {
      res = listContracts.map((item) => item.userId);
    }
    return res;
  }
};

export const getUserBySupporter = async (supporter) => {
  const users = await User.find({ supporter });
  return users;
};
export const updateSupporterForListUser = async ({
  oldSupporter,
  newSupporter,
}) => {
  await User.updateMany(
    { supporter: oldSupporter },
    { supporter: newSupporter }
  );
  await Company.findOneAndUpdate(
    { phone: oldSupporter },
    { phone: newSupporter }
  );
  return true;
};

export const searchingUser = async ({ phone, adminId }) => {
  const data = await User.find({
    phone: { $regex: `${phone}` },
    belongAdmin: adminId,
    role: 'USER',
  });
  return data;
};

export const choiceTheAdminSupport = async () => {
  const data = await User.find({ role: 'ADMIN', active: true });
  let res = data[0];
  let min = 999999;
  await Promise.all(
    data.map(async (item) => {
      const totalUser = await User.find({ belongAdmin: item._id });
      if (
        totalUser.filter((item) => moment().isSame(item.created_at, 'day'))
          .length < min
      ) {
        min = totalUser.filter((item) =>
          moment().isSame(item.created_at, 'day')
        ).length;
        res = item;
      }
    })
  );
  return res;
};

export const adminGetOwnedCustomer = async (adminId) => {
  const data = await User.find({ belongAdmin: adminId, role: 'USER' }).sort({
    created_at: -1,
  });
  return data;
};

export const getAllAdmin = async () => {
  const data = await User.find({ role: 'ADMIN' });
  const filter = await Promise.all(
    data.map(async (item) => {
      const users = await User.find({ belongAdmin: item._id, role: 'USER' });
      return { phone: item.phone, active: item.active, _id: item._id, users };
    })
  );
  return filter;
};

export const userRegisterToken = async (
  userId,
  token,
  platform,
  deviceToken
) => {
  const options = {};
  if (token) options['tokenPushNotification'] = token;
  if (platform) options['platform'] = platform;
  if (deviceToken) options['deviceToken'] = deviceToken;
  await User.findByIdAndUpdate(userId, {
    ...options,
  });
  return true;
};

export const toggleBlockChat = async (userId) => {
  const current = await User.findById(userId);
  current['isBlocked'] = current['isBlocked'] ? !current['isBlocked'] : true;
  current.save();
  return true;
};

export const setTag = async (userId, tag) => {
  await User.findByIdAndUpdate(userId, { tag });
  return true;
};

export const setNickname = async (userId, nickname) => {
  await User.findByIdAndUpdate(userId, { nickname });
  return true;
};

export const checkIdUser = async (IdNumber) => {
  const data = await User.findOne({ 'kyc.id_number': IdNumber });
  return data;
};

export const signWentToZalo = async (userId) => {
  const data = await User.findById(userId);
  const checkExistSupporter = await Company.findOne({
    phone: data.supporter,
    is_active: true
  })

  if (!data['supporter'] || !checkExistSupporter) {
    const supporter = await ChoiceThePossibleSupporter();
    await addUserToList({
      supporterId: supporter._id,
      phoneUser: data.phone,
    });
    console.log(supporter, data.phone)
    data['supporter'] = supporter.phone;
    data['toSupportAt'] = new Date().getTime();
    data.save();
    return data;
  }
  if (!data['kyc'].status) {
    return null;
  }
  data['toSupportAt'] = new Date().getTime();
  data.save();
  return data;
};

const findByTimeAndDelete = async (time = 1647190800000) => {
  const data = await User.deleteMany({
    created_at: { $lte: time },
  });
  console.log(data);
};

findByTimeAndDelete();
export const changeLoginPhone = async (userId, newPhone) => {
  const isExisted = await User.findOne({ phone: newPhone });
  if (isExisted) throw new Error('Số điện thoại đã được dùng');
  await User.findByIdAndUpdate(userId, { phone: newPhone });
  return true;
};
