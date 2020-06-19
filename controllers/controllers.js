// load in dependancies
var express = require("express");
var router = express.Router();
var path = require("path");
var request = require("request"); // for web-scraping
var cheerio = require("cheerio"); // for web-scraping

//import the article and note models
var Article = require("../models/Article");
var Note = require("../models/Note");
var Route = require("../config/routes");

// // renders page when launched
// router.get('/', function (req, res) {
//     // scrape data
//     res.redirect('/scrape');
// });

// // renders the article page
// router.get('/article', function (req, res) {

// });

router.get("/scrape", function (req, res) {
  // grabbing the body of the html with request
  request("https://magic.wizards.com/en/articles", function (error, respose, body) {
    // setting cheerio to short hand body selector
    var $ = cheerio.load(body);

    // grabbing everything within the div that contains the article link, h title, and summary
    $("article module_featured_header").each(function(i, element) {
        
    // empty array to capture data
    var result = {}; 

    // add the text and href of every link 
    result.title = $(this).children("h3").text().trim();
    result.link = $(this).children("a").attr("href");
    result.summary = $(this).children("p").text().trim();

    if(title && link && summary) {
        var titleNeat = title.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var linkNeat = link.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
            title: titleNeat,
            link: linkNeat,
            summary: sumNeat
        };

        result.push(dataToAdd);
    };
    });
      // Redirect to the Articles Page, done at the end of the request for proper scoping
      res.redirect("/articles");
  });
});
