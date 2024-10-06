import Model from '../../collections/request';
import Contract from '../../collections/contract';
import User from '../../collections/user';
import * as paymentService from '../payments/services';
import config from '../../app.config';
import { createOTP } from '../../utils/generator';
import { translate } from '../../translation/Translator';

export const createRequest = async ({ payload, userId }) => {
  const contract = await Contract.findById(payload.contractId);
  if (!contract.otp) {
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
      status: "pending",
      error: contract.response === 'accepted' ? translate('WalletMessage1') : contract.response,
    });

    await paymentService.createPayment({
      payload: {
        userId: userId,
        amount: payload.amount,
        description: 'Rút tiền thành công.',
        status: false,
      },
    });
    owner.balance = owner.balance - payload.amount;
    await owner.save();
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

  if (!current_request) {
    throw new Error(translate('WalletMessage5'))
  }

  if (current_request.status !== 'pending') {
    throw new Error(translate('WalletMessage4') + " " + current_request.status)
  }

  if (otp.trim() !== current_request.otp) {
    throw new Error(translate('WalletMessage3'))
  }

  if (status === 'accepted') {
    await paymentService.createPayment({
      payload: {
        userId: current_request.userId,
        amount: amount,
        description: translate('WalletMessage2'),
        status: false,
      },
    });
    error = translate('WalletMessage1')
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
    current_request.error = translate('WalletMessage6')
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
    owner.balance = owner.balance - amount;
    owner.save();
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
    current_request.error = translate('WalletMessage6')
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
  const requests = await Model.find().populate('userId').populate('contractId').sort({ created_at: -1 });
  return requests;
};
