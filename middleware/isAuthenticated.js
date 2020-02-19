var express = require("express");
var router = express.Router();

const User = require("../models/User");
const UserSession = require("../models/UserSession");

async function isAuthenticated(req, res, next) {
  let token = req.body.token;

  try {
    let session = await UserSession.findOne({
      userId: token,
      isDeleted: false
    });
    if (session) {
      // console.log(session);
      return next();
    } else {
      res.send({ message: "Your session is invalid" });
    }
  } catch (err) {
    return res.send({ message: err.message });
  }
}

module.exports = isAuthenticated;
