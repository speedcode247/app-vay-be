import SystemConfiguration from '../../collections/systemConfiguration';
import _ from 'lodash';

export const updateSystemConfig = async (payload) => {
  const currentConfig = await getSystemConfig();
  const newConfig = await SystemConfiguration.findByIdAndUpdate(currentConfig._id, { ...payload });
  newConfig.save();
  return true;
};

export const getSystemConfig = async () => {
  const currentConfig = await SystemConfiguration.find();
  if (currentConfig && currentConfig.length > 0) {
    return currentConfig[0]
  } else {
    let newConfig = {
      telegramUrl: "https://t.me",
      supportUrl: "tel:03439182931"
    };
    await SystemConfiguration.insertMany([newConfig])
    return newConfig;
  }
};
