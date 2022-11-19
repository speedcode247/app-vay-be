import * as service from './services';
import * as contractService from '../contracts/services';
import * as requestService from '../requests/services';
import * as paymentService from '../payments/services';
import IP from '../../collections/ips';

function getCallerIP(req) {
  let ip = 0;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(',')[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress;
  } else {
    ip = req.ip;
  }
  return ip;
}

async function createIp({ ip, from }) {
  const data = await IP.create({
    ipAddress: ip,
    from,
    createdAt: new Date().getTime(),
  });
  return true;
}

export const getProfile = async (req, res) => {
  try {
    const data = await service.getProfile(req.user);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    await service.updateProfile(req.user, req.body);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request' });
  }
};
export const updateSupporter = async (req, res) => {
  try {
    const { userId, supporter } = req.body;
    await service.updateProfile(userId, { supporter });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: 'Bad request' });
  }
};

export const updatePassword = async (req, res) => {
  try {
    await service.updatePassword({
      _id: req.user,
      new_password: req.body.new_password,
      current_password: req.body.password,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const requestVerify = async (req, res) => {
  try {
    await service.requestVerify({ userId: req.user, kyc_payload: req.body });
    return res.status(200).json({
      success: true,
      message:
        'Thông tin của bạn đã được tiếp nhận. Vui lòng chờ hệ thống xác minh',
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
// admin controller
export const getAllUsers = async (req, res) => {
  try {
    try {
      let ip = getCallerIP(req);
      await createIp({ ip, from: req.role });
    } catch (err) {
      console.log(err);
    }

    const { data, statistics } = await service.getAll(req.query, req.user);
    return res.status(200).json({ ...data, statistics });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

async function logIp() {
  const data = await IP.find();
  // console.log(data);
}

logIp();

export const toggleActivity = async (req, res) => {
  try {
    const { userId } = req.query;
    await service.toggleActivity({ userId });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const confirmVerify = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    await service.confirmVerify({ userId, payload: status });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const updateUserFromAdmin = async (req, res) => {
  try {
    const data = await service.updateUserFromAdmin(req.params._id, req.body);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
        const _id = req.params.id;
    const [profile, contracts, payment, request] = await Promise.all([
      service.getProfile(_id),
      contractService.getContractByUser(_id),
      paymentService.userGetPayment(_id),
      requestService.userGetRequest(_id),
    ]);

    const data = await service.updateUserInfoFromAdmin(req.params.id, req.body);
    if (req.body.balance !== undefined && req.body.balance !== null && req.body.balance !== profile.balance) {
      let _diffAmount = req.body.balance - profile.balance;
      let _diffAmountStr = _diffAmount > 0 ? '+' + (_diffAmount.toLocaleString()) : (_diffAmount.toLocaleString())
      //neu xu ly so du thi se hien thi log
      await paymentService.createPayment({
        payload: {
          userId: _id,
          status: true,
          amount: _diffAmount,
          description: `Admin chỉnh sửa`,
        },
      });
    }
    // const { _id } = req.params;
    // const [profile, contracts, payment, request] = await Promise.all([
    //   service.getProfile(_id),
    //   contractService.getContractByUser(_id),
    //   paymentService.userGetPayment(_id),
    //   requestService.userGetRequest(_id),
    // ]);
    // console.log(profile);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminUpdateUserBankNumber = async (req, res) => {
  try {
    const data = await service.updateUserBankNumber(req.params.id, req.body.number);
    const { id } = req.params;
    const [profile, contracts, payment, request] = await Promise.all([
      service.getProfile(id),
      contractService.getContractByUser(id),
      paymentService.userGetPayment(id),
      requestService.userGetRequest(id),
    ]);
    console.log(profile);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const adminGetAllInfoUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [profile, contracts, payment, request] = await Promise.all([
      service.getProfile(id),
      contractService.getContractByUser(id),
      paymentService.userGetPayment(id),
      requestService.userGetRequest(id),
    ]);
    return res.status(200).json({
      data: {
        profile,
        contracts,
        payment,
        request,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await service.deleteUser({ userId: req.params.id });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { user } = req;
    const { url } = req.body;
    await service.updateProfile(user, { avatar: url });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, status } = req.body;
    await service.updateBalance(id, { amount, description, status });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const exportUser = async (req, res) => {
  try {
    const { type, startDate, endDate, isGetAll } = req.query;
    const data = await service.exportUser({
      type,
      startDate,
      endDate,
      isGetAll,
    });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const transferZalo = async (req, res) => {
  try {
    const { oldSupporter, newSupporter } = req.body;
    await service.updateSupporterForListUser({ oldSupporter, newSupporter });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const searchUser = async (req, res) => {
  try {
    const data = await service.searchingUser({
      phone: req.query.phone,
      adminId: req.user,
    });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const adminGetOwnedCustomer = async (req, res) => {
  try {
    const data = await service.adminGetOwnedCustomer(req.user);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const data = await service.getAllAdmin();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const userRegisterToken = async (req, res) => {
  try {
    const { token, platform, deviceToken } = req.body;
    const data = await service.userRegisterToken(
      req.user,
      token,
      platform,
      deviceToken
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const toggleBlockChat = async (req, res) => {
  try {
    await service.toggleBlockChat(req.params.userId);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const setTag = async (req, res) => {
  try {
    await service.setTag(req.params.userId, req.body.tag);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const setNickname = async (req, res) => {
  try {
    await service.setNickname(req.params.userId, req.body.nickname);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const checkIdUser = async (req, res) => {
  try {
    const data = await service.checkIdUser(req.query.id);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const signWentToZalo = async (req, res) => {
  try {
    const data = await service.signWentToZalo(req.user);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const changeLoginPhone = async (req, res) => {
  try {
    await service.changeLoginPhone(req.body.userId, req.body.newPhone);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
