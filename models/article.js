var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    // `title` is required and of type String
    title: {
      type: String,
      required: true
    },
    // `link` is required and of type String
    link: {
      type: String,
      required: true
    },
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    note: {
      type: Schema.Types.ObjectId,
      ref: "note"
    }
  });
  
  // This creates our model from the above schema, using mongoose's model method
  var article = mongoose.model("article", articleSchema);
  
  // Export the Article model
  module.exports = article;
  