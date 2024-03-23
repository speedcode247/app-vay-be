import Model from '../../collections/contract';
import UserReferCode from '../../collections/userReferCode';

export const getAll = async (filter) => {
  // const arrayMetaTranslated = filter.meta.split(',').map((item) => {
  //   if (item == 1) return undefined;
  //   if (item == 2) return 'pending';
  //   if (item == 3) return 'accepted';
  //   return null;
  // });
  // if (filter.meta.split(',').length == 0) arrayMetaTranslated.push(filter.meta);
  // if (filter.search) {
  //   optionType['kyc.id_number'] = { $regex: `${filter.searchId}` };
  // }
  const data = await UserReferCode.paginate(
    {
      // $or: [
      //   {
      //     phone: { $regex: `${filter.search}` },
      //   },
      //   {
      //     'kyc.id_number': { $regex: `${filter.search}` },
      //   }
      // ],
    },
    { ...options, ...filter, sort: { created_at: -1 } }
  );
  const tmp = data.docs.map((item) => ({ ...item, ...item.kyc }));
  data.docs = tmp;
  return { data };
};

export const deleteReferCode = async ({ referCodeId }) => {
  await UserReferCode.findByIdAndDelete(referCodeId);
  return true;
};

function getRandomIntByMinMax(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const createUserReferCode = async (referCode) => {
  try {
    let _newReferCode = referCode;
    if (!referCode) {
      _newReferCode = getRandomIntByMinMax(100000, 999999);
    _newReferCode = `2024${_newReferCode}`
    }

    let _newReferCodeData = {
      referCode: _newReferCode,
    };
    
    const _newReferCodeOutput = await userReferCode.create({ ..._newReferCodeData });
      return _.pick(_newReferCodeOutput, ['_id', 'referCode']);
  } catch (err) {
    throw new Error(err);
  }
};