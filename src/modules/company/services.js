import Model from '../../collections/company';
import moment from 'moment';
import USER from '../../collections/user';

export const getAll = async () => {
  const data = await Model.find();
  return data;
};

export const addUserToList = async ({ supporterId, phoneUser }) => {
  const currentSupporter = await Model.findById(supporterId);
  currentSupporter.list_user = [
    ...currentSupporter.list_user,
    { phone: phoneUser, time: new Date().getTime() },
  ];
  await currentSupporter.save();
  console.log(currentSupporter);
  return true;
};

export const ChoiceThePossibleSupporter = async () => {
  const suppoters = await Model.find({ is_active: true });
  const supporterUserWorked = suppoters.map((supporter) => ({
    _id: supporter._id,
    phone: supporter.phone,
    is_active: supporter.is_active,
    list_user: supporter.list_user.filter((item) =>
      moment().isSame(item.time, 'day')
    ),
    isOutOfLimit:
      supporter.list_user.filter((item) => moment().isSame(item.time, 'day'))
        .length > supporter.limit,
  }));
  let res = supporterUserWorked[0];
  supporterUserWorked.forEach((item) => {
    if (item.list_user.length < res.list_user.length && !item.isOutOfLimit)
      res = item;
  });
  return res;
};

export const usersSignedZaloOnDay = async ({ supporterId }) => {
  const start = new Date(moment().startOf('day')).getTime();
  const end = new Date(moment().endOf('day')).getTime();
  const data = await USER.find({
    supporter: supporterId,
    toSupportAt: { $lte: end, $gte: start },
  });
  return data;
};

export const analystOnDay = async () => {
  const supporters = await Model.find();
  const res = await Promise.all(
    supporters.map(async (item) => {
      const list = await usersSignedZaloOnDay({ supporterId: item.phone });
      return {
        phone: item.phone,
        today: list,
        is_active: item.is_active,
        name: item.name,
        list_user: item.list_user,
        limit: item.limit,
        _id: item._id,
      };
    })
  );
  return res;
};

export const resetCompany = async () => {
  const data = await Model.find();
  // console.log(data);

  data.map(async (item) => {
    item.list_user = [];
    item.save();
  });
};

resetCompany();
