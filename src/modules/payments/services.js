import Model from '../../collections/payment';

export const createPayment = async ({ payload }) => {
  const newModel = await Model.create({
    created_at: new Date().getTime(),
    userId: payload.userId,
    status: payload.status,
    amount: payload.amount,
    description: payload.description,
  });
  return newModel;
};

export const userGetPayment = async (userId) => {
  const requests = await Model.find({ userId }).sort({ created_at: 1 });
  return requests;
};
