/* Copyright (c) 2022-2023 TORITI LIMITED 2022 */

'use strict';
require('dotenv').config();

const Credentials = require('aws-sdk').Credentials;
const crypto = require('crypto');
const fs = require('fs');
const moment = require('moment');
const S3 = require('aws-sdk/clients/s3');
const path = require('path');
const axios = require('axios');

const s3Client = new S3({
  region: process.env.LINODE_OBJECT_STORAGE_REGION,
  endpoint: process.env.LINODE_OBJECT_STORAGE_ENDPOINT,
  sslEnabled: true,
  s3ForcePathStyle: false,
  credentials: new Credentials({
    accessKeyId: process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY,
    secretAccessKey: process.env.LINODE_OBJECT_STORAGE_SECRET_KEY,
  }),
});

async function deleteFileFromObjectStorage(url) {
  const Key = url.split(`${process.env.LINODE_OBJECT_STORAGE_ENDPOINT}/`)[1];
  const params = {
    Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
    Key,
  };

  // see: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
  // eslint-disable-next-line consistent-return
  return s3Client.deleteObject(params).promise();
}

function _createHashFileName(fullFilePath) {
  const _hashFileName = crypto.createHmac('sha256', 'ThisIsLinodeSecretKey').update(fullFilePath).digest('hex');
  return _hashFileName;
}
async function uploadFileToObjectStorage(fullFilePath, fileType = 'image', extension = 'png') {
  const path = moment().format('YYYYMMDD');
  let base64Data = fs.readFileSync(fullFilePath);
  const params = {
    Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
    Key: `${path}/${_createHashFileName(fullFilePath)}.${extension}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `${fileType}/${extension}`,
  };

  // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  const { Location } = await s3Client
    .upload(params)
    .promise()
    .catch(error => {
      console.error(`uploadFileToObjectStorage error ${fullFilePath}`);
      return undefined;
    });

  if (Location) {
    console.info(`uploadFileToObjectStorage: ${Location}`);
    return Location;
  }

  return undefined;
}

// uploadFileToObjectStorage('DatabaseDesign.png','image','png');
// moveFileFromLocalToLinode('uploads/Sample.png');
async function moveFileFromLocalToLinode(fullFilePath) {
  console.info(`moveFileFromLocalToLinode ${fullFilePath}`);
  let _isExisted = fs.existsSync(fullFilePath);
  console.log(`_isExisted ${_isExisted}`);
  if (_isExisted) {
    let _fileType = 'image';
    let uploadResult = await uploadFileToObjectStorage(fullFilePath, _fileType, path.extname(fullFilePath));
    if (uploadResult) {
      fs.unlinkSync(fullFilePath);
      return uploadResult;
    }
  }
  return undefined;
}

async function uploadFileFromUrl(fileUrl) {
  return new Promise((resolve, reject) => {
    // Download the image from the URL
    axios
      .get(fileUrl, { responseType: 'arraybuffer' })
      .then(response => {
        // Prepare the object parameters for S3 upload
        const uploadParams = {
          Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
          Key: `${path}/${_createHashFileName(fullFilePath)}.${extension}`,
          Body: response.data,
          ACL: 'public-read', // Optional: Set appropriate ACL permissions
          ContentType: response.headers['content-type'], // Optional: Set the content type of the file
        };

        // Upload the file to S3
        s3Client.upload(uploadParams, (error, data) => {
          if (error) {
            console.error('Error:', error);
            resolve(undefined);
          } else {
            console.log('File uploaded successfully!');
            console.log('S3 URL:', data.Location);
            resolve(data.Location);
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
        resolve(undefined);
      });
  });
}
module.exports = {
  uploadFileToObjectStorage,
  deleteFileFromObjectStorage,
  moveFileFromLocalToLinode,
  uploadFileFromUrl,
};
