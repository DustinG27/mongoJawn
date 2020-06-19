// load in dependancies
var express = require("express");
var router = express.Router();
var path = require('path');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping

//import the article and note models
var Note = require("../models/Note");
var Article = require("../models/Article");

// renders page when launched
router.get('/', function (req, res) {
    // scrape data
    res.redirect('/scrape');
});

// renders the article page 
router.get('/article', function (req, res) {

});