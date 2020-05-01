var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", (req, res, next) => {
  obj = { message: "welcome to the API home" };
  res.json(obj);
});

//correct verb here? PUT?
router.post("/newtext", (req, res) => {
  obj = { message: "welcome to the API home" };
  res.json(obj);
});

module.exports = router;
