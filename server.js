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

// Require all models
var db = require("./models");

// serve the public directory
app.use(express.static(__dirname + "public"));

// reqeusts are taken through middleware
app.use(router);

// use promises with Mongo and connect to the database
// var databaseUrl = "news";
mongoose.Promise = Promise;
var db = process.env.MONGODB_URI||"mongodb://localhost/news";
// mongoose connection error handler
mongoose.connect(db, function (error) {
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

// routes -----------------------------------------------------------------------------------

// use cheerio to scrape from rooster teeth and store them
app.get("/scrape", function(req, res) {
    request("https://blog.roosterteeth.com/", function(error, response, body) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(body);

      var articles = [];

      $("div.uk-card-body").each(function(i, element) {
  
        // trim removes whitespace because the items return \n and \t before and after the text
        var title = $(this).children(".card-title").text().trim();
        var link = $(this).children("a.card-title").attr("href");
        var sum = $(this).children(".card-content").text().trim();
  
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text()
        .trim();

      result.link = $(this)
        .children("a")
        .attr("href");

        result.sum = $(this)
        .children("p")
        .text()
        .trim();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      });
    });
  });

// listen for the routes
app.listen(PORT, function () {
  console.log("Listening on port: " + PORT);
});
