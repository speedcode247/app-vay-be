import Model from '../../collections/contract';
import User from '../../collections/user';
import * as userServices from '../users/services';
import * as paymentServices from '../payments/services';
import moment from 'moment';
import config from '../../app.config';
import { createContracNumber } from '../../utils/generator';

export const createContract = async ({ userId, payload }) => {
  // check verify
  const current_user = await userServices.getProfile(userId);
  if (!current_user.kyc.status === 'accepted')
    throw new Error('Bạn chưa hoàn thành xác minh danh tính');

  const newContract = await Model.create({
    userId,
    ...payload,
    slug: createContracNumber(),
    created_at: new Date().getTime(),
    status: config.app.contract_status[0],
  });
  return newContract;
};

export const updateContract = async ({ payload, contractId }) => {
  const contract = await Model.findById(contractId);
  await Model.findByIdAndUpdate(contractId, { ...payload });
  return true;
};

export const confirmContract = async ({ status, contractId, response }) => {
  const contract = await Model.findById(contractId);
  if (status === 'accepted') {
    if (contract.status !== 'accepted') {
      const current_owner = await User.findById(contract.userId);
      current_owner.balance = current_owner.balance + contract.amount;
      current_owner.save();
      await paymentServices.createPayment({
        payload: {
          userId: contract.userId,
          status: true,
          amount: contract.amount,
          description: 'Hồ sơ vay được chấp thuận.',
        },
      });
    }
    await Model.findByIdAndUpdate(contractId, { status, response });
  }
};
export const getDetailContract = async (_id) => {
  const data = await Model.findById(_id);
  return data;
};

export const getContractByUser = async (userId) => {
  const data = await Model.find({ userId });
  return data;
};

export const getAllContracts = async () => {
  const data = await Model.find().populate('userId');
  return data;
};

export const endContract = async ({ id }) => {
  const current = await Model.findById(id).populate('userId');
  if (current.userId.balance > 0) {
    throw new Error('Người dùng chưa rút tiền về ví');
  }
  const data = await Model.findByIdAndUpdate(id, { is_done: true });
  return true;
};
