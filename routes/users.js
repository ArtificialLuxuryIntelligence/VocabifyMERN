var express = require("express");
var router = express.Router();

const User = require("../models/User");
const UserSession = require("../models/UserSession");

var isAuthenticated = require("../middleware/isAuthenticated");

//Signup route

router.post("/signup", (req, res) => {
  let { password, email } = req.body;

  if (!email) {
    return res.send({
      success: false,
      message: "Sign up Failed: Email cannot be blank"
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Sign up Failed: Password cannot be blank"
    });
  }

  email = email.toLowerCase().trim();

  User.find(
    {
      email
    },
    (err, existingUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Server error"
        });
      } else if (existingUsers.length > 0) {
        return res.send({
          success: false,
          message: "Sign up failed: Accout already exists with that e-mail"
        });
      }
      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: "Server error"
          });
        }
        return res.send({
          success: true,
          messaged: "Signed up"
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
      message: "Sign in Failed: Email cannot be blank"
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Sign in Failed: Password cannot be blank"
    });
  }

  email = email.toLowerCase().trim();

  User.find(
    {
      email
    },
    (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: "Server error"
        });
      } else if (users.length != 1) {
        return res.send({
          success: false,
          message: "Cannot find user"
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: "Wrong password"
        });
      }
      //success - start session
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "Server error"
          });
        }
        res.send({
          success: true,
          message: "Sign in success",
          token: user._id, //nothing fancy here, active session is checked with middleware when userdata requests are made.
          knownWords: user.knownWords,
          unknownWords: user.unknownWords,
          vocabSize: user.vocabSize,
          lang: user.lang,
          words: user.words
        });
      });
    }
  );
});

//Signout route

router.post("/signout", (req, res) => {
  const { query } = req;
  const { token } = query;
  // Check to see if the token is unique and acitive (isDeleted:false)

  UserSession.findOneAndRemove(
    {
      userId: token,
      isDeleted: false
    },
    err => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: "Server error"
        });
      }
      return res.send({
        success: true,
        message: "session ended"
      });
    }
  );
});

//update user

router.post("/updateuser", isAuthenticated, (req, res, next) => {
  // let token = req.body.token;
  let id = req.body.id; //note token is (currently in this version) user id (separate here for clarity)
  // let unknownWords = req.body.unknownWords;
  // let knownWords = req.body.knownWords;
  let words = req.body.words;
  let vocabSize = req.body.vocabSize;
  let lang = req.body.lang;

  User.findOneAndUpdate(
    {
      _id: id
    },
    {
      words,
      vocabSize,
      lang
    },
    { upsert: true },
    (err, user) => {
      if (err) {
        res.send({
          message: err
        });
      } else {
        res.send({ message: "user updated", user });
      }
    }
  );
});

//Verify token is valid

router.get("/verify", (req, res, next) => {
  // Get the token
  const { query } = req;
  const { token } = query;
  // ?token=test

  // Verify the token is one of a kind and it's not deleted.

  UserSession.find(
    {
      _id: token,
      isDeleted: false
    },
    (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid"
        });
      } else {
        return res.send({
          success: true,
          message: "Good"
        });
      }
    }
  );
});

module.exports = router;
