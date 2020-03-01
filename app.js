var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var wordsRouter = require("./routes/words");

var apiRouter = require("./routes/API");

mongoose.connect(process.env.DB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/words", wordsRouter);
app.use("/api", apiRouter);

//serve static assets in productions

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// app.use(express.static(path.join(__dirname, "./client/build")));

// /*React root*/
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "./client/build/index.html"));
// });

module.exports = app;
