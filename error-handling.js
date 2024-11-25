exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
};

exports.customErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
