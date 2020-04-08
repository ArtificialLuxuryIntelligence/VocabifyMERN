// var express = require("express");
// var router = express.Router();

// const User = require("../models/User");
// const UserSession = require("../models/UserSession");

// async function isAuthenticated(req, res, next) {
//   //change headers
//   let token = req.headers.token;

//   try {
//     let session = await UserSession.findOne({
//       userId: token,
//       // isDeleted: false
//     });
//     if (session) {
//       // console.log(session);
//       return next();
//     } else {
//       res.send({ message: "Your session is invalid" });
//     }
//   } catch (err) {
//     return res.send({ message: err.message });
//   }
// }

// module.exports = isAuthenticated;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded; // add user data to passed on requests
    next();
  } catch (err) {
    console.log("auth failed");

    return res.status(401).json({
      message: "auth failed",
    });
  }
};
