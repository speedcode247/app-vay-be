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

export const removeNote = async ({ payload, contractId }) => {
  const contract = await Model.findById(contractId);
  await Model.findByIdAndUpdate(contractId, { ...payload });
  return true;
};

export const getAllContracts = async () => {
  const data = await Model.find().populate('userId');
  return data;
};