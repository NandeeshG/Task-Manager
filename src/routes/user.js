const express = require("express");
const { User, allowedFieldsUser } = require("../models/user").module;
const { auth } = require("../middleware/auth").module;
const router = new express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    return res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    return res.send({ user, token });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    debugger;
    return res.send(req.user);
    //return res.send(req.user);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Unable to fetch user" });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

router.patch("/users/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const isValid = updates.every((upd) => allowedFieldsUser.includes(upd));
    if (!isValid)
      return res.status(400).send({ error: "Invalid Update Request!" });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }

  try {
    //const u = await User.findById(req.params.id)
    //if (!u) return res.status(404).send({ error: 'No user found!' })
    const u = req.user;
    Object.keys(req.body).forEach((upd) => (u[upd] = req.body[upd]));
    await u.save();
    return res.send(u);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: e.message });
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    return res.send();
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

/*
//ADMIN
router.post('/users/adminControls', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken(true) //admin
        return res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        return res.status(400).send({ error: e.message })
    }
})
*/

//ADMIN
router.get("/users/adminControls/", async (req, res) => {
  try {
    const user = await User.find();
    if (!user.length) return res.status(404).send({ error: "No user found!" });
    else return res.send(user);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: e.message });
  }
});

/*
//ADMIN
router.get('/users/adminControls/:id', authAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).send({ error: 'No user found!' })
        else return res.send(user)
    } catch (e) {
        console.log(e)
        return res.status(500).send({ error: e.message })
    }
})
*/

exports.module = router;
