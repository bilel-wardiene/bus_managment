var express = require("express");
var path = require("path");
var app = express();
const _ = require("lodash");
const fileUpload = require("express-fileupload");

const mongoose = require("mongoose");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var bodyParser = require("body-parser");

const dotenv = require('dotenv')

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) =>
    console.log(`Connected successfully to DB : "${res.connections[0].name}"`),
  )
  .catch((err) => {
    console.log(`> Error while connecting to mongoDB : ${err.message}`);
  });

app.use(
  fileUpload({
    createParentPath: true,
  }),
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }),
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type: application/json",
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/user", require("./routes/user_route"));
app.use("/employe", require("./routes/employe_route"));


app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`listening on ${port}`));

module.exports = app;
