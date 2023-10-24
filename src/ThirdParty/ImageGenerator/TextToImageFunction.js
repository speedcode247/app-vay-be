const textToImage = require('text-to-image');
const moment = require('moment');
const crypto = require('crypto');

// using the asynchronous API with await
async function createImageFromText(inputText, extra = '') {
    let _outputFileName = moment().format('YYYYMMDDHHmmss');
    _outputFileName += '_';
    _outputFileName += crypto.createHmac('sha256', 'ThisIsStaffSecretKey').update(inputText).digest('hex');
    _outputFileName += extra;
    _outputFileName += '.jpg';

    let _imageName = textToImage.generateSync(inputText, {
        debug: true,
        debugFilename: _outputFileName,
        bgColor: 'white',
        lineHeight: 16,
        fontSize: 24,
        textColor: 'red',
        margin: 0,
        maxWidth: 500
    })
    return _outputFileName;
}
module.exports = {
    createImageFromText
}