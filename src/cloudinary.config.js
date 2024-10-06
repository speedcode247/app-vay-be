import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Thư mục lưu trữ ảnh
const uploadDir = 'uploads';

// Đảm bảo thư mục tồn tại, nếu không thì tạo mới
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Đảm bảo lưu file vào thư mục 'uploads'
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let fileExtension = path.extname(file.originalname);

    // Nếu là blob và không có tên file, gán một tên mặc định
    if (!file.originalname || file.originalname === 'blob') {
      fileExtension = '.png'; // Đặt mặc định là png, có thể thay đổi nếu cần
    }

    // Đặt tên file mới
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  }
});

// Bộ lọc file để chỉ cho phép hình ảnh
const fileFilter = (req, file, cb) => {
  // Kiểm tra loại file từ MIME type (blob có thể không có mime type chuẩn)
  if (file.mimetype.startsWith('image/') || file.originalname === 'blob') {
    cb(null, true); // Chấp nhận file
  } else {
    cb(new Error('File không hợp lệ! Chỉ chấp nhận các file hình ảnh.'), false); // Từ chối file
  }
};

// Khởi tạo multer với cấu hình lưu trữ, bộ lọc file và giới hạn kích thước
const uploadCloud = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Giới hạn kích thước file 5MB
  }
}).single('file'); // Chỉ upload một file với field là 'file'

// Export middleware xử lý upload
export default uploadCloud;
