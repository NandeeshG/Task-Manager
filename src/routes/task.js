const express = require("express");
const { Task, allowedFieldsTask } = require("../models/task").module;
const router = new express.Router();

router.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((r) => {
      res.status(201).send(r);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((r) => {
      if (!r) return res.status(404).send();
      res.send(r);
    })
    .catch((e) => res.status(500).send(e));
});

router.get("/tasks", (req, res) => {
  Task.find()
    .then((r) => res.send(r))
    .catch((e) => res.status(500).send(e));
});

router.patch("/tasks/:id", async (req, res) => {
  try {
    const isV = Object.keys(req.body).every((u) =>
      allowedFieldsTask.includes(u)
    );
    if (!isV) return res.status(400).send({ error: "Invalid Update Request!" });
  } catch (e) {
    return res.status(500).send(e);
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).send();
    return res.send(task);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send();
    else return res.send(deleted);
  } catch (e) {
    return res.status(500).send(e);
  }
});

exports.module = router;
