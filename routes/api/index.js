const router = require("express").Router();
const passport = require("passport");
// Load Models
const User = require("../../models/User");

// user controller
const userController = require("../../controllers/userController");

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));
// @route   POST /signup
// @desc    Create a new user
// @access  Public
router.post(
  "/signup",
  userController.validate("signup"),
  userController.signup
);

// @route   POST /login
// @desc    Login an existing user
// @access  Public
router.post("/login", userController.validate("login"), (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("B-REQ.SESSION: " + JSON.stringify(req.session, null, 2));
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ errors: info.message });
    }
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout();
  return res.status(200).json({ success: true });
});

module.exports = router;
