const express = require("express");
const { Task, allowedFieldsTask } = require("../models/task").module;
const { auth } = require("../middleware/auth").module;
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

// /tasks?completed=true&limit=10&skip=20&sortBy=completed:-description:-createdAt
router.get("/tasks", auth, async (req, res) => {
  try {
    //Using user.populate
    /*
    await req.user.populate({
        path:"tasks",
        match:{
            completed:true
        },
        options:{
            sort:
            limit:
            skip:
        }
    });
    if (!req.user.tasks.length) return res.status(404).send();
    return res.send(req.user.tasks);
    */

    //Using Task.find
    const filter = { owner: req.user._id };
    //having === true makes sure query syntax is what we expect
    if (req.query.completed) filter.completed = req.query.completed === "true";

    const tasks = await Task.find(filter)
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(req.query.sortBy.replaceAll(":", " "));
    res.send(tasks);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      owner: req.user._id,
      _id: req.params.id,
    });
    if (!task) return res.status(404).send();
    return res.send(task);

    //if you want owner as well. remove return from above
    //await task.populate("owner");
    //return res.send({ task, owner: task.owner });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const isV = Object.keys(req.body).every((u) =>
      allowedFieldsTask.includes(u)
    );
    if (!isV) return res.status(400).send({ error: "Invalid Update Request!" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }

  try {
    const task = await Task.findOne({
      owner: req.user._id,
      _id: req.params.id,
    });
    if (!task) return res.status(404).send({ error: "No task found!" });
    Object.keys(req.body).forEach((upd) => (task[upd] = req.body[upd]));
    await task.save();
    return res.send(task);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      owner: req.user._id,
      _id: req.params.id,
    });
    if (!deleted) return res.status(404).send({ error: "No task found!" });
    else return res.send(deleted);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

exports.module = router;
