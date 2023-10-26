import { combineMultipleImage, combineTwoImage, combineUserSignatureIntoContract, getTemplateContactFilePath } from '../../ThirdParty/CombineImage/CombineImageFunction';
import { createImageFromText } from '../../ThirdParty/ImageGenerator/TextToImageFunction';
import { moveFileFromLocalToLinode, uploadFileToObjectStorage } from '../../ThirdParty/LinodeStorage/LinodeStorageFunctions';
import { getProfile, updateProfile } from '../users/services';
import * as services from './services';

export const createContractImage = async (req, res) => {
  try {
    const { user } = req;
    const payload = req.body;
    let createdContract = await services.createContract({
      userId: user,
      payload,
    });

    let _userProfile = await getProfile(user);
    let _kycNameImageFileName = await createImageFromText(_userProfile.kyc.name, "1");
    let _phoneImageFileName = await createImageFromText(_userProfile.phone, "2");
    let _idNumberImageFileName = await createImageFromText(_userProfile.kyc.id_number, "3");
    let _amountImageFileName = await createImageFromText((payload.amount * 1).toLocaleString(), "4");
    
    let _userInfoImages = [
      {filePath: _kycNameImageFileName, x: 633, y: 630 },
      {filePath: _phoneImageFileName, x: 633, y: 675 },
      {filePath: _idNumberImageFileName, x: 633, y: 720 },
      {filePath: _amountImageFileName, x: 633, y: 765 }
    ]
    let _contractFile = getTemplateContactFilePath();

    let _userContractFileName = await combineMultipleImage(_contractFile, _userInfoImages)
    let contractImageUrl = await moveFileFromLocalToLinode(`${_userContractFileName}`, 'image', 'jpg');
    contractImageUrl = `https://${contractImageUrl}`;
    createdContract.contractImageUrl = contractImageUrl;
    await updateProfile(user, {contractImageUrl: contractImageUrl});

    return res.status(200).json({ data: createdContract });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const createContract = async (req, res) => {
  try {
    const { user } = req;
    const payload = req.body;
    let createdContract = await services.createContract({
      userId: user,
      payload,
    });

    if (payload.signature_capture && payload.signature_capture !== "") {
      let _userSignatureFilePath = payload.signature_capture;
      _userSignatureFilePath = _userSignatureFilePath.split('/');
      _userSignatureFilePath = _userSignatureFilePath[_userSignatureFilePath.length - 1];
      _userSignatureFilePath = 'uploads/' + _userSignatureFilePath

      let _userProfile = await getProfile(user);
      let _kycNameImageFileName = await createImageFromText(_userProfile.kyc.name, "1");
      let _phoneImageFileName = await createImageFromText(_userProfile.phone, "2");
      let _idNumberImageFileName = await createImageFromText(_userProfile.kyc.id_number, "3");
      let _amountImageFileName = await createImageFromText((payload.amount * 1).toLocaleString(), "4");
      
      let _userInfoImages = [
        {filePath: _userSignatureFilePath, x: 150, y: 8015 },
        {filePath: _kycNameImageFileName, x: 633, y: 630 },
        {filePath: _phoneImageFileName, x: 633, y: 675 },
        {filePath: _idNumberImageFileName, x: 633, y: 720 },
        {filePath: _amountImageFileName, x: 633, y: 765 }
      ]
      let _contractFile = getTemplateContactFilePath();

      let _userContractFileName = await combineMultipleImage(_contractFile, _userInfoImages)
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
