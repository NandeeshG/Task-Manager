const express = require("express");
const { User, allowedFieldsUser } = require("../models/user").module;
const router = new express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send();
    else return res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
  //  const _id = req.params.id;
  //  User.findById(_id)
  //    .then((users) => {
  //      if (!users) return res.status(404).send();
  //      res.send(users);
  //    })
  //    .catch((e) => res.status(500).send(e));
});

router.patch("/users/:id", async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const isValid = updates.every((upd) => allowedFieldsUser.includes(upd));
    if (!isValid)
      return res.status(400).send({ error: "Invalid Update Request!" });
  } catch (e) {
    res.status(500).send(e);
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).send();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send();
    else return res.send(deleted);
  } catch (e) {
    return res.status(500).send(e);
  }
});

exports.module = router;
