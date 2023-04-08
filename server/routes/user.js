express = require("express");
const {
  signup,
  login,
  activate,
  sendResetPasswordCode,
  validateResetCode,
  changePassword,
} = require("../controllers/user");

const router = express.Router();

router.post("/signup", signup);
router.patch("/activate", activate);
router.post("/login", login);
router.post("/resetPassword", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.patch("/changePassword", changePassword);

module.exports = router;
