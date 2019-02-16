module.exports = {
  validateLoginInput: (req, res, next) => {
    const { data, errors, isValid } = require("./validation/login")(req.body);
    if (!isValid) {
      return res.status(403).json({ username: data.username, errors });
    } else {
      return (req.body = data);
      return next(null, data);
    }
  },
  validateSignupInput: (req, res, next) => {
    const { data, errors, isValid } = require("./validation/signup")(req.body);
    if (!isValid) {
      return res
        .status(400)
        .json({ username: data.username, email: data.email, errors });
    } else {
      req.body = data;
      return next(null, data);
    }
  }
};
