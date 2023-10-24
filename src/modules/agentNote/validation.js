const admin_accept_fields = [
  'times',
  'status',
  'amount',
  'process_on_times',
  'response',
];
const user_accept_fields = ['bank_reciever'];

export const admin_async_validator = (req, _res, next) => {
  const fields = Object.keys(req.body);
  fields.map((item) => {
    if (!admin_accept_fields.includes(item)) {
      throw new Error(`Không thể thay đổi mục ${item} `);
    }
  });
  next();
};

export const user_async_validator = (req, _res, next) => {
  const fields = Object.keys(req.body);
  fields.map((item) => {
    if (!user_accept_fields.includes(item)) {
      throw new Error(`Không có quyền thay đổi ${item}`);
    }
  });
  next();
};
