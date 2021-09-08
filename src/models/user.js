const mongoose = require("mongoose");
const validator = require("validator");

const allowedFieldsUser = ["name", "age", "email", "password"];
const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
  },
  age: {
    type: Number,
    default: 18,
    validate(v) {
      if (v < 5 || v > 150) {
        throw new Error("Invalid Age!");
      }
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(v) {
      if (!validator.isEmail(v)) throw new Error("Email is invalid");
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(v) {
      if (v.length <= 5 || v.toLowerCase().includes("password"))
        throw new Error("Please enter a stronger password!");
    },
  },
});

exports.module = { User, allowedFieldsUser };
