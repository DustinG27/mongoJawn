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

// //require routes
// require("./config/routes")(router);

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
app.use(express.static(__dirname + "public"));

// reqeusts are taken through middleware
app.use(router);

// use promises with Mongo and connect to the database
// var databaseUrl = "news";
mongoose.Promise = Promise;
var db = process.env.MONGODB_URI || "mongodb://localhost/news";
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

// listen for the routes
app.listen(PORT, function () {
  console.log("Listening on port: " + PORT);
});

// Hook mongojs configuration to the db variable
var db = require("./models/Article");

// get all articles from the database that are not saved
app.get("/", function(req, res) {

  db.Article.find({
      saved: false
    },

    function(error, dbArticle) {
      if (error) {
        console.log(error);
      } else {
        res.render("index", {
          articles: dbArticle
        });
      }
    })
})

// use cheerio to scrape stories from TechCrunch and store them
app.get("/scrape", function (req, res) {
  request("https://magic.wizards.com/en/articles", function (
    error,
    response,
    body
  ) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(body);

    $("article module_featured_header").each(function (i, element) {
      // add the text and href of every link
      result.title = $(this).children("h3").text().trim();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).children("p").text().trim();

      // if these are present in the scraped data, create an article in the database collection
      if (title && link && summary) {
        db.Article.create(
          {
            title: title,
            link: link,
            summary: summary,
          },
          function (err, inserted) {
            if (err) {
              // log the error if one is encountered during the query
              console.log(err);
            } else {
              // otherwise, log the inserted data
              console.log(inserted);
            }
          }
        );
      }
    });
  });
});

// route for retrieving all the saved articles
app.get("/saved", function (req, res) {
  db.Article.find({
    saved: true,
  })
    .then(function (dbArticle) {
      // if successful, then render with the handlebars saved page
      res.render("saved", {
        articles: dbArticle,
      });
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// route for setting an article to saved
app.put("/saved/:id", function(req, res) {
  db.Article.findByIdAndUpdate(
      req.params.id, {
        $set: req.body
      }, {
        new: true
      })
    .then(function(dbArticle) {
      res.render("saved", {
        articles: dbArticle
      })
    })
    .catch(function(err) {
      res.json(err);
    });
});

// route for saving a new note to the db and associating it with an article
app.post("/submit/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      var articleIdFromString = mongoose.Types.ObjectId(req.params.id)
      return db.Article.findByIdAndUpdate(articleIdFromString, {
        $push: {
          notes: dbNote._id
        }
      })
    })
    .then(function(dbArticle) {
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// route to find a note by ID
app.get("/notes/article/:id", function(req, res) {
  db.Article.findOne({"_id":req.params.id})
    .populate("notes")
    .exec (function (error, data) {
        if (error) {
            console.log(error);
        } else {
          res.json(data);
        }
    });
});

app.get("/notes/:id", function(req, res) {

  db.Note.findOneAndRemove({_id:req.params.id}, function (error, data) {
      if (error) {
          console.log(error);
      } else {
      }
      res.json(data);
  });
});
