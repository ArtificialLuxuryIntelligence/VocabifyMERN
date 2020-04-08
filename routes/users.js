var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
// const UserSession = require("../models/UserSession");

var isAuthenticated = require("../middleware/isAuthenticated");

//Signup route

router.post("/signup", (req, res) => {
  let { password, email } = req.body;

  if (!email) {
    return res.send({
      success: false,
      message: "Sign up Failed: Email cannot be blank",
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Sign up Failed: Password cannot be blank",
    });
  }

  email = email.toLowerCase().trim();

  User.find(
    {
      email,
    },
    (err, existingUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Server error",
        });
      } else if (existingUsers.length > 0) {
        return res.send({
          success: false,
          message: "Sign up failed: Accout already exists with that e-mail",
        });
      }
      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: "Server error",
          });
        }
        return res.send({
          success: true,
          messaged: "Signed up",
        });
      });
    }
  );
});

//Signin route

router.post("/signin", (req, res) => {
  const { body } = req;
  let { password, email } = body;
  if (!email) {
    return res.send({
      success: false,
      message: "Sign in Failed: Email cannot be blank",
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Sign in Failed: Password cannot be blank",
    });
  }

  email = email.toLowerCase().trim();

  User.find(
    {
      email,
    },
    (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: "Server error",
        });
      } else if (users.length != 1) {
        return res.send({
          success: false,
          message: "Cannot find user",
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: "Wrong password",
        });
      }
      //success - start session
      // const userSession = new UserSession();
      // userSession.userId = user._id;
      // userSession.save((err, doc) => {
      //   if (err) {
      //     console.log(err);
      //     return res.send({
      //       success: false,
      //       message: "Server error"
      //     });
      //   }

      const token = jwt.sign(
        { name: user.name, id: user._id },
        process.env.JWT_KEY,
        {
          expiresIn: "5s",
        }
      );
      res.send({
        success: true,
        message: "Sign in success",
        // token: user._id, //nothing fancy here, active session is checked with middleware when userdata requests are made.
        token: token,
        // knownWords: user.knownWords,
        // unknownWords: user.unknownWords,
        // vocabSize: user.vocabSize,
        lang: user.lang,
        words: user.words,
      });
      // });
    }
  );
});

//Update user

router.post("/updateuser", isAuthenticated, (req, res, next) => {
  // let token = req.body.token;
  // let id = req.body.id; //note token is (currently in this version) user id (separate here for clarity)
  // let unknownWords = req.body.unknownWords;
  // let knownWords = req.body.knownWords;
  let words = req.body.words;
  let vocabSize = req.body.vocabSize;
  let lang = req.body.lang;

  User.findOneAndUpdate(
    {
      _id: req.userData.id,
    },
    {
      words,
      vocabSize,
      lang,
    },
    { upsert: true },
    (err, user) => {
      if (err) {
        res.send({
          message: err,
        });
      } else {
        res.send({ message: "User updated", user });
      }
    }
  );
});

router.post("/authcheck", isAuthenticated, (req, res) => {
  console.log(req);

  if (req.userData) {
    res.status(200).json({ message: "user is logged in" });
  }
});

module.exports = router;
