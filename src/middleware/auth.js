const jwt = require("jsonwebtoken");
const { User } = require("../models/user").module;

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    //decoding is necessary to find out if token is still valid or not (time expired)
    const decode = jwt.verify(token, process.env.SECRET_STR);
    const user = await User.findOne({ _id: decode._id, tokens: token });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log("Auth Error", e);
    res.status(401).send({ error: "Authentication failed" });
  }
};

/*
const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        //decoding is necessary to find out if token is still valid or not (time expired)
        const decode = jwt.verify(token, process.env.ADMIN_SECRET_STR)
        const user = await User.findOne({ _id: decode._id, tokens: token })
        if (!user) throw new Error()
        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send({ error: 'Authentication failed' })
    }
}
*/

//const maintainence = (req, res, next) => {
//    if (MAINTAINENCE_MODE) {
//        res.status(503).send({
//            error: 'Server under maintainence. Try again soon.',
//        })
//    } else {
//        next()
//    }
//}

exports.module = { auth /*authAdmin*/ };
