const express = require("express");
const { User, allowedFieldsUser } = require("../models/user").module;
const { auth } = require("../middleware/auth").module;
const multer = require("multer");
const sharp = require("sharp");
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

/* Folder uploading multer setup
    //const upload = multer({
    //  dest: "avatars",
    //  limits: {
    //    fileSize: 1e6, //1MB
    //  },
    //  fileFilter(req, file, cb) {
    //    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
    //      //return cb("Only jpeg,jpg and png file type are allowed", false);
    //      return cb(new Error("Only jpeg,jpg and png file type are allowed"));
    //    } else {
    //      return cb(null, true);
    //    }
    //  },
    //});
    
    ////To pass error handling to express
    //router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
    //  res.send();
    //});
    
    ////To handle errors yourself
    //router.post("/users/me/avatar", (req, res) => {
    //  upload.single("avatar")(req, res, (err) => {
    //    if (err) return res.status(500).send({ error: err.message });
    //    else return res.send();
    //  });
    //});
    
    ////Another way to handle errors yourself by declaring new express error handler
    //router.post(
    //  "/users/me/avatar",
    //  upload.single("avatar"),
    //  (req, res) => {
    //    res.send();
    //  },
    //  (err, req, res, next) => {
    //    res.status(500).send({ error: err.message });
    //  }
    //);
------ Folder uploading multer setup */

const uploadAvatar = multer({
  limits: {
    fileSize: 1e6,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error("Only jpg,jpeg,png files are allowed"));
    else return cb(null, true);
  },
});

// Can be used for both creation and updating profile pic
router.post(
  "/users/me/avatar",
  auth,
  uploadAvatar.single("avatar"),
  async (req, res) => {
    //req.user.avatar = req.file.buffer;  //Old way, saving directly

    //new way, reducing size and changing file type
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(500).send({ error: err.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.get("/users/me/avatar", auth, async (req, res) => {
  try {
    if (!req.user.avatar) return res.status(404).send();
    res.set("Content-Type", "image/png");
    res.send(req.user.avatar);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) return res.status(404).send();
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(500).send({ error: e.message });
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
    const user = await User.find().sort(req.query.sortBy.replaceAll(":", " "));
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
