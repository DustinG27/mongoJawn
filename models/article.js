var mongoose = require("mongoose");
var moment = require("moment")

// create mongoose scheme
var Schema = mongoose.Schema;

// create a new article schema. The link should be unique, but the other properties are not required because they may not exist on the website to be scraped. There is validation on the route to add them to the database on if these properties exist.
var articleSchema = new Schema({
  title: {
    type: String,
    require: false,
  },
  summary: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    unique: true,
    require: false,
  },
  // Date of article scrape
  updated: {
    type: String,
    default: moment().format("MMMM Do YYYY, h:mm A"),
  },
  saved: {
    type: Boolean,
    default: false,
  }
});

// create model
var Article = mongoose.model("Article", articleSchema);

// export the model
module.exports = Article;
