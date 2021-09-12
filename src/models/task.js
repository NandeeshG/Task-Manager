const mongoose = require("mongoose");

const allowedFieldsTask = ["description", "completed"];
const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
console.log(schema);
const Task = mongoose.model("Task", schema);

exports.module = { Task, allowedFieldsTask };
