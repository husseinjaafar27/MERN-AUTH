const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    validatedAt: Date,
    validationToken: String,
    validationExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateValidity = function () {
  const validityToken = crypto.randomBytes(32).toString("hex");
  this.validationToken = crypto
    .createHash("sha256")
    .update(validityToken)
    .digest("hex");
  this.validationExpires = Date.now() + 10 * 60 * 1000; //10 min of validity
  return validityToken;
};

module.exports = mongoose.model("User", userSchema);
