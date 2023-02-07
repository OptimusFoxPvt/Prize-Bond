module.exports = function (err, req, res, next) {
  return res.status(404).json({ message: err.message });
};
