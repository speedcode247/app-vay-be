export default (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ secure_url: process.env.SERVER_URL + req.file.filename });
};
