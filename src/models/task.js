const mongoose = require("mongoose");

const allowedFieldsTask = ["description", "completed"];
const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

exports.module = { Task, allowedFieldsTask };
