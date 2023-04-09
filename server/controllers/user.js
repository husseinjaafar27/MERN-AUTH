const User = require("../models/User");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { sendMailPassword } = require("../helpers/email");
const Code = require("../models/Code");
const generateCode = require("../helpers/generateCode");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "This email address already exists.",
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "invalid email address",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const code = generateCode(5);
    await new Code({
      code,
      user: newUser._id,
    }).save();
    sendMailPassword(newUser.email, newUser.firstName, code);
    return res.status(201).json({
      status: "success",
      message: "Validation email sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.activate = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "invalid email address",
      });
    }
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    if (user.verified === true) {
      return res.status(401).json({
        message: "Your account is already verified",
      });
    }
    user.verified = true;
    user.save();
    return res
      .status(200)
      .json({ success: true, message: "Your account has been verified" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message:
          "The email address you entered is not connected to an account.",
      });
    }
    if (!(await user.checkPassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    if (user.verified !== true) {
      return res.status(401).json({ message: "Verify your account please" });
    }
    createSendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "invalid email address",
      });
    }
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    await new Code({
      code,
      user: user._id,
    }).save();
    sendMailPassword(user.email, user.firstName, code);
    return res.status(200).json({
      status: "success",
      message: "Email reset code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "invalid email address",
      });
    }
    const Dbcode = await Code.findOne({ user: user._id });
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verification code is wrong..",
      });
    }
    return res
      .status(200)
      .json({ message: "You can now change your password" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cryptedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
      { email },
      {
        password: cryptedPassword,
      }
    );
    if (!user) {
      return res.status(404).json({ message: "This email is not exist" });
    }
    return res
      .status(200)
      .json({ status: "success", message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
