// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// cloudinary.config({
//   cloud_name: 'credit24h',
//   api_key: '547479774471299',
//   api_secret: '4v70yh-nVSolLYgPFel4G07VS9g',
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   allowedFormats: ['jpg', 'png'],
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
