var mongoose = require("mongoose");

// save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new note schema
var noteSchema = new Schema({
    // associated article to attatch to
  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
  },
  date: String,
  noteText: String
});

// create not model
var Note = mongoose.model("Note", noteSchema);

// export the model
module.exports = Note;
