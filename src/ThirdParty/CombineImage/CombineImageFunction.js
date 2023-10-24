const Jimp = require('jimp');
const moment = require('moment');
const crypto = require('crypto');
async function combineTwoImage(originFilePath, newFilePath1, position1 = { x: 0, y: 0 }, outputPath = "temp/output") {
  const [imageOrigin, image1] = await Promise.all([Jimp.read(originFilePath), Jimp.read(newFilePath1)]);
  return new Promise((resolve, reject) => {
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

// fileAttribute: {
//   filePath: "filePath"
//   position: { x: 0, y: 0 }
// }
async function combineMultipleImage(originFilePath, fileAttributeArray, outputPath = "temp/output") {
  let _readFilePromise = [];
  let _originImageBuffer = await Jimp.read(originFilePath);
  fileAttributeArray.forEach(_fileObject => {
    _readFilePromise.push(Jimp.read(_fileObject.filePath));
  });

  const _allImageObject = await Promise.all(_readFilePromise);

  return new Promise((resolve, reject) => {
    try {
      const combinedImage = new Jimp(_originImageBuffer.getWidth(), _originImageBuffer.getHeight());
      
      // Compose the images onto the combined image
      combinedImage.composite(_originImageBuffer, 0, 0);
      for (let i = 0; i < _allImageObject.length; i++) {
        combinedImage.composite(_allImageObject[i], fileAttributeArray[i].x, fileAttributeArray[i].y);
      }

      let _outputFileName = moment().format('YYYYMMDDHHmmss');
      _outputFileName += '_';
      _outputFileName += crypto.createHmac('sha256', 'ThisIsStaffSecretKey').update(`combineMultipleImage ${outputPath}`).digest('hex');
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
  let _userSignaturePosition = process.env.USER_SIGNATURE_POSITION || "150,8015"

  let userContractFilePath = await combineTwoImage(
    `${getTemplateContactFilePath()}`,
    signaturePath,
    {
      x: _userSignaturePosition.split(',')[0] * 1,
      y: _userSignaturePosition.split(',')[1] * 1,
    },
  );
  return userContractFilePath;
}

function getTemplateContactFilePath() {
  let _contractFile = process.env.CONTRACT_FILE || "contract.jpg"
  _contractFile = `${__dirname}/templateImage/${_contractFile}`;
  return _contractFile
}
module.exports = {
  combineTwoImage,
  combineMultipleImage,
  combineUserSignatureIntoContract,
  getTemplateContactFilePath,
};
