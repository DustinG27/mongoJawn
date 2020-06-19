var mongoose = require("mongoose");
var moment = require("moment")

// create mongoose scheme
var Schema = mongoose.Schema;

// create a new article schema. The link should be unique, but the other properties are not required because they may not exist on the website to be scraped. There is validation on the route to add them to the database on if these properties exist.
var articleSchema = new Schema({
  // grabs the titlke of teh article
  title: {
    type: String,
    require: false,
  },
  // grabs summary of the article
  summary: {
    type: String,
    required: true,
  },
  // grabs the link to the artcile
  link: {
    type: String,
    // unique: true,
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
  },
  // creates the relation with Note.js model
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]

});

// create model
var Article = mongoose.model("Article", ArticleSchema);

// export the model
module.exports = Article;
