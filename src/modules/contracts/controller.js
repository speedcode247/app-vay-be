import { combineUserSignatureIntoContract } from '../../ThirdParty/CombineImage/CombineImageFunction';
import { moveFileFromLocalToLinode, uploadFileToObjectStorage } from '../../ThirdParty/LinodeStorage/LinodeStorageFunctions';
import { getProfile, updateProfile } from '../users/services';
import * as services from './services';

export const createContract = async (req, res) => {
  try {
    const { user } = req;
    const payload = req.body;
    let createdContract = await services.createContract({
      userId: user,
      payload,
    });

    if (payload.signature_capture && payload.signature_capture !== "") {
      let _filePath = payload.signature_capture;
      _filePath = _filePath.split('/');
      _filePath = _filePath[_filePath.length - 1];
      _filePath = 'uploads/' + _filePath

      let _userContractFileName = await combineUserSignatureIntoContract(_filePath);
      let contractImageUrl = await moveFileFromLocalToLinode(`${_userContractFileName}`, 'image', 'jpg');
      contractImageUrl = `https://${contractImageUrl}`;
      createdContract.contractImageUrl = contractImageUrl;
      await updateProfile(user, {contractImageUrl: contractImageUrl});
    }
    return res.status(200).json({ data: createdContract });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const userGetContracts = async (req, res) => {
  try {
    const data = await services.getContractByUser(req.user);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
export const updateContract = async (req, res) => {
  try {
    const { _id } = req.params;
    const payload = req.body;
    await services.updateContract({ contractId: _id, payload });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = await services.getDetailContract(_id);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const confirmContract = async (req, res) => {
  try {
    const { _id } = req.params;
    const { status, response } = req.body;
    await services.confirmContract({ status, contractId: _id, response });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const getAllContracts = async (req, res) => {
  try {
    const data = await services.getAllContracts();
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const endContract = async (req, res) => {
  try {
    const data = await services.endContract({ id: req.params._id });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
