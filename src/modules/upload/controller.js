export default (req, res, next) => {

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ secure_url: "https://dangkykhoanvay.com/uploads/" + req.file.filename });
};
