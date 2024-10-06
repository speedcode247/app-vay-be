export default (req, res, next) => {

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  res.json({ secure_url: "http://localhost:5002/uploads/" + req.file.filename });
};
