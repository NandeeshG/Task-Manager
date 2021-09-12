const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { Task } = require("./task").module;

const allowedFieldsUser = ["name", "age", "email", "password"];

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    age: {
      type: Number,
      default: 1,
      validate(v) {
        if (v < 1 || v > 200) {
          throw new Error("Invalid Age!");
        }
      },
    },
    email: {
      type: String,
      unique: true,
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
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

schema.methods.toJSON = function () {
  let ret = this.toObject();
  delete ret.password;
  delete ret.tokens;
  delete ret.__v;
  return ret;
};

schema.methods.generateAuthToken = async function (isAdmin = false) {
  let token;
  //if (!isAdmin) {
  token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_STR, {
    expiresIn: "1 day",
  });
  //} else {
  //    token = jwt.sign(
  //        { _id: this._id.toString() },
  //        process.env.ADMIN_SECRET_STR,
  //        {
  //            expiresIn: '2 day',
  //        }
  //    )
  //}
  this.tokens.push(token);
  await this.save();
  return token;
};

schema.statics.findByCredentials = async (email, pwd) => {
  try {
    const u = await User.findOne({ email });
    if (!u) throw new Error();
    const c = await bcrypt.compare(pwd, u.password);
    if (!c) throw new Error();
    return u;
  } catch (e) {
    console.log("findByCredentials:errorLog ", e.message);
    throw new Error("Unable to login");
  }
};

schema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 9);
    }
    return next();
  } catch (e) {
    console.log("Middleware pre save error:", e);
    return next(e);
  }
});

schema.pre("remove", async function (next) {
  try {
    await Task.deleteMany({ owner: this._id });
    return next();
  } catch (e) {
    console.log("Middleware pre remove error:", e);
    return next(e);
  }
});

const User = mongoose.model("User", schema);

exports.module = { User, allowedFieldsUser };
