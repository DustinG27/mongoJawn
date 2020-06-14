// require dependencies
var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;

// initialize Express
var app = express();

// set express router
var router = express.Router();

//require routes
require("./config/routes")(router);

// use body-parser for handling form submissions
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(
  bodyParser.json({
    type: "application/json",
  })
);

// serve the public directory
app.use(express.static("public"));

// reqeusts are taken through middleware
app.use(router);

// use promises with Mongo and connect to the database
// var databaseUrl = "news";
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI||"mongodb://localhost/news";
// mongoose connection error handler
mongoose.connect(MONGODB_URI, function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("mongoose connection is successful");
  }
});

// use handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// Hook mongojs configuration to the db variable
// var db = require("./models");

// listen for the routes
app.listen(PORT, function () {
  console.log("Listening on port: " + PORT);
});
