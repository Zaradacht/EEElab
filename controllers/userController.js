const User = require("../models/User");

const validateSignupInput = require("../middleware/validation/signup");
const validateLoginInput = require("../middleware/validation/login");

exports.validate = method => (req, res, next) => {
  switch (method) {
    case "signup": {
      const { data, errors, isValid } = validateSignupInput(req.body);
      if (!isValid) {
        res.locals.errors = errors;
        next();
      } else {
        res.locals = { ...data };
        next();
      }
    }
    case "login": {
      const { data, errors, isValid } = validateLoginInput(req.body);
      if (!isValid) {
        res.locals.errors = errors;
        next();
      } else {
        res.locals = { ...data };
        next();
      }
    }
  }
};

exports.signup = (req, res, next) => {
  let errors = {};
  const data = { ...res.locals };
  if (data.errors) {
    console.log("I did this[if]");
    return res.status(403).json({
      username: data.username,
      email: data.email,
      errors: data.errors
    });
  }
  User.findOne({
    $or: [{ username: data.username }, { email: data.email }]
  })
    .then(user => {
      if (user != null) {
        if (user.username == data.username) {
          errors.username = "The username is already used";
        } else if (user.email == data.email) {
          errors.email = "email is already used.";
        }
        return res.status(403).json(errors);
      } else {
        const newUser = new User({});
      }
    })
    .catch(err => console.log(err));
};
