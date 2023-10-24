const Jimp = require('jimp');
const moment = require('moment');
const crypto = require('crypto');
async function combineTwoImage(originFilePath, newFilePath1, position1 = { x: 0, y: 0 }, outputPath = "temp/output") {
  const [imageOrigin, image1] = await Promise.all([Jimp.read(originFilePath), Jimp.read(newFilePath1)]);
  return new Promise ((resolve, reject) => {
    try {
      const combinedImage = new Jimp(imageOrigin.getWidth(), imageOrigin.getHeight());

  // Compose the images onto the combined image
  combinedImage.composite(imageOrigin, 0, 0);
  combinedImage.composite(image1, position1.x, position1.y);

  let _outputFileName = moment().format('YYYYMMDDHHmmss');
  _outputFileName += '_';
  _outputFileName += crypto.createHmac('sha256', 'ThisIsStaffSecretKey').update(outputPath).digest('hex');
  _outputFileName += '.jpg';

  // Save the combined image
  const outputImagePath = _outputFileName;
  combinedImage.write(outputImagePath, error => {
    if (error) {
      console.error('Error:', error);
      resolve(undefined)
    } else {
      console.log('Images combined successfully!');
      console.log('Combined image saved to:', outputImagePath);
      resolve(outputImagePath)
    }
  });
    } catch (error) {
      resolve(undefined)
    }
  })
  
}
// combineUserSignatureIntoContract('/Users/nexle/qtproject/WebChoVay_Backend/src/ThirdParty/CombineImage/templateImage/signature.png').then((result) => {
//   console.log(result)
// })
async function combineUserSignatureIntoContract(signaturePath = `${__dirname}/templateImage/signature.png`) {
  console.log(`combineUserSignatureIntoContract`)
  let _contractFile = process.env.CONTRACT_FILE || "contract.jpg"
  let _userSignaturePosition = process.env.USER_SIGNATURE_POSITION || "150,8015"
  console.log(_contractFile)

  let userContractFilePath = await combineTwoImage(
    `${__dirname}/templateImage/${_contractFile}`,
    signaturePath,
    {
      x: _userSignaturePosition.split(',')[0] * 1,
      y: _userSignaturePosition.split(',')[1]* 1,
    },
  );
  console.log(userContractFilePath)
  return userContractFilePath;
}

module.exports = {
  combineTwoImage,
  combineUserSignatureIntoContract,
};
