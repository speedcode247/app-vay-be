import Model from '../../collections/request';
import Contract from '../../collections/contract';
import User from '../../collections/user';
import * as paymentService from '../payments/services';
import config from '../../app.config';
import { createOTP } from '../../utils/generator';

export const createRequest = async ({ payload, userId }) => {
  const contract = await Contract.findById(payload.contractId);
  if(!contract.otp) {
    contract.otp = createOTP()
    await contract.save()
  }

  const owner = await User.findById(userId);
  if (contract.response === 'accepted') {
    if (owner.balance - payload.amount < 0) {
      return undefined;
    }
  }
  if (contract.response === 'accepted') {
    const newRequest = await Model.create({
      created_at: new Date().getTime(),
      userId,
      amount: payload.amount,
      contractId: contract._id,
      bank_reciever: payload.bank_reciever,
      otp: contract.otp,
      status: contract.response === 'accepted' ? 'accepted' : 'rejected', 
      error: contract.response === 'accepted' ? 'Lệnh rút tiền thành công.Vui lòng kiểm tra ngân hàng liên kết sau 10 phút !' : contract.response,
    });
    
    await paymentService.createPayment({
      payload: {
        userId: userId,
        amount: payload.amount,
        description: 'Rút tiền thành công.',
        status: false,
      },
    });
    // owner.balance = owner.balance - payload.amount;
    // await owner.save();
  }

  return contract;
};

export const getLastRequest = async ({ userId }) => {
  const requests = await Model.findOne({ userId }).select('-otp').sort({ created_at: -1 });
  return requests;
};

export const verifyOtpAndUpdateRequest = async ({ requestId, error, otp, status }) => {
  const current_request = await Model.findById(requestId);
  const owner = await User.findById(current_request.userId);
  const contract = await Contract.findById(current_request.contractId)
  const amount = current_request.amount

  if(!current_request) {
    throw new Error('Yêu cầu không tồn tại!')
  }
  
  if(current_request.status !== 'pending') {
    throw new Error('Trạng thái yêu cầu không hợp lệ ' + current_request.status)
  }

  if(otp.trim() !== current_request.otp) {
    throw new Error('Mã OTP không hợp lệ, vui lòng liên hệ CSKH để nhận mã!')
  }

  if (status === 'accepted') {
    await paymentService.createPayment({
      payload: {
        userId: current_request.userId,
        amount: amount,
        description: 'Rút tiền thành công.',
        status: false,
      },
    });
    error = 'Lệnh rút tiền thực hiện thành công vui lòng chờ tiền về số tài khoản liên kết trong 15-30 phút.'
    owner.balance = owner.balance - amount;
    owner.save();
  }

  const result = await Model.findByIdAndUpdate(requestId, { status, error, created_at: new Date().getTime() });
  return result;
};

export const updateStatus = async ({ requestId, status, error, amount }) => {
  const current_request = await Model.findById(requestId);
  const owner = await User.findById(current_request.userId);
  if (status === 'accepted') {
    // await paymentService.createPayment({
    //   payload: {
    //     userId: current_request.userId,
    //     amount: amount,
    //     description: 'Rút tiền thành công.',
    //     status: false,
    //   },
    // });
    // owner.balance = owner.balance - amount;
    // owner.save();
    current_request.error = 'Vui lòng liên hệ nhân viên hỗ trợ'
    current_request.status = 'onhold'
    current_request.save();
  } else if (status === 'rejected') {
    // await paymentService.createPayment({
    //   payload: {
    //     userId: current_request.userId,
    //     amount: amount,
    //     description: 'Từ chối rút tiền',
    //     status: false,
    //   },
    // });
    // owner.balance = owner.balance - amount;
    // owner.save();
  } else if (status === 'onhold') {
    // await paymentService.createPayment({
    //   payload: {
    //     userId: current_request.userId,
    //     amount: amount,
    //     description: 'Rút tiền thành công.',
    //     status: false,
    //   },
    // });
    // owner.balance = owner.balance - amount;
    // owner.save();
    current_request.error = 'Vui lòng liên hệ nhân viên hỗ trợ'
    current_request.status = 'onhold'
    current_request.save();
  }

  await Model.findByIdAndUpdate(requestId, { status, error });
  return true;
};

export const updateRequest = async ({ requestId, payload }) => {
  const data = await Model.findByIdAndUpdate(requestId, { ...payload });
  return true;
};

export const userGetRequest = async (userId) => {
  const requests = await Model.find({ userId }).sort({ created_at: 1 });
  return requests;
};

export const getAllRequest = async () => {
  const requests = await Model.find().populate('userId').populate('contractId');
  return requests;
};
