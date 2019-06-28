// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;
//initalize express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", {
    useNewUrlParser: true
});

//routes

// a GET route for scrapibg the website

app.get("/scrape", function(req, res){
    // grab the body od the html with axios
    axios.get("https://www.nytimes.com/").then(function(response){
        //then we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

      //now we grab every h2  within an article tag, and do the following..
      $("article h2").each(function(i, el){
          var result = {};

          //add the text and href of every link, and save them as peopweties of the result object

          result.title = $(this)
          .children("a")
          .text();
          result.link = $(this)
          .children("a")
          .attr("href");

          //create a new article using the 'result' object built from scraping
          db.article.create(result)
          .then(function(dbarticle){
              console.log(dbarticle);
          }).catch(function(err){
              console.log(err);
          });
      });
      res.send("Scrape Complete");  
    });
});

//route for getting all articles from the db
app.get("/articles", function(req,res){
    db.article.find({}).then(function(dbarticle){
        //send them back to the client
        res.json(dbarticle);
    }).catch(function(err){
        //if error occurred, send it to the client 
        res.json(err);
    });
});

//route for grabbing a specific article by id, populate it with its note
app.get("/articles/:id", function(req, res){
    //using the is in the is parameter prepare a query thatt finds the matching one in our db..
    db.article.findOne({ _id: req.params.id })
    //and populate all of the notes associated with it
    .populate("note")
    .then(function(dbarticle){
        res.json(dbarticle);
    }).catch(function(err){
        res.json(err);
    });
});

//route for saving/updating an articles associated note

app.post("/articles/:id", function(req, res){
    //create a new note and pass the req.body to the entry
    db.note.create(req.body).then(function(dbnote){
        return db.article.findOneAndUpdate({ _id: req.params.id }, { note: dbnote._id }, { new: true });
    }).then(function(dbarticle){
        res.json(dbarticle);
    }).catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });