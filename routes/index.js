const router = require("express").Router();

// Load Models
const User = require("../models/User");
// Load Input validations
const validateSignupInput = require("../validation/signup");
const validateLoginInput = require("../validation/login");

// @route   POST /signup
// @desc    Create a new user
// @access  Public
router.post("/signup", (req, res) => {
  // validate data
  console.log(
    " ======== req.body: " +
      req.body.username +
      " .. " +
      req.body.password +
      " .. " +
      req.body.password2 +
      " .. " +
      req.body.email
  );
  const { data, errors, isValid } = validateSignupInput(req.body);
  if (!isValid) {
    return res
      .status(400)
      .json({ username: data.username, email: data.email, errors });
  }
  User.findOne({ username: data.username })
    .then(user => {
      if (user) {
        errors.username = "The username is already in use";
        return res.status(403).json({ errors });
      } else {
        User.findOne({ email: data.email })
          .then(user => {
            if (user) {
              errors.email = "The email is already in use";
              return res.status(403).json({ errors });
            } else {
              // create the user
              const newUser = new User({
                username: data.username,
                password: data.password,
                email: data.email
              });
              newUser
                .save()
                .then(user => res.json({ success: true, user }))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
});

// @route   POST /login
// @desc    Login an existing user
// @access  Public
router.post("/login", (req, res) => {
  // validate data
  const { data, errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(403).json({ username: data.username, errors });
  }
  User.findOne({ username: data.username })
    .then(user => {
      if (!user) {
        errors.username = "Username or password incorrect";
        return res.status(403).json({ errors });
      } else {
        // attempt to authenticate user
        User.getAuthenticated(
          data.username,
          data.password,
          (err, user, reason) => {
            if (err) throw err;

            // login was successful if we have a user
            if (user) {
              // handle login success
              console.log("login success");
              return;
            } else {
              // otherwise we can determine why we failed
              const reasons = User.failedLogin;
              switch (reason) {
                case reasons.NOT_FOUND:
                  errors.reason = "Account not found.";
                case reasons.PASSWORD_INCORRECT:
                  errors.reason = "Password is incorrect.";
                  break;
                case reasons.MAX_ATTEMPTS:
                  errors.reason = "Max attempts reached.";
                  break;
              }
              return res.status(403).json({ errors });
            }
          }
        );
      }
    })
    .catch(err => console.log(err));
});

module.exports = router;
