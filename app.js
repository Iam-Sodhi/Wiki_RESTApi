//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://Gautam_Sodhi:Noobcoder888@cluster0.obpadln.mongodb.net/wikiDB?retryWrites=true&w=majority");
//mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const articleSchema=new mongoose.Schema({
    title: String,
    content: String,
})
const Article= mongoose.model("article",articleSchema);

//request Targeting all articles
app.route("/articles")
.get(function(req,res){
    Article.find().then(function(foundArticle){
       res.send(foundArticle);
    }).catch(function(err){
      res.send(err);
    })
})
.post(function(req,res){
        const newArticle= new Article({
          title: req.query.title,
          content: req.query.content
        });
        newArticle.save().then(function(){
          res.send("Successfully created a new article");
        }).catch(function(err){
          res.send(err);
        });
  
  })
.delete(function(req,res){
    Article.deleteMany().then(function(){
        res.send("Successfully deleted");
    }).catch(function(err){
        res.send(err);
    });
});     //semicolon at last

//request targeting specific articles
app.route("/articles/:articleTitle")
.get(function(req,res){
    const articleName = req.params.articleTitle;
    Article.findOne({title:articleName}).then(function(foundArticle){
      res.send(foundArticle);
    }).catch(function(err){
      res.send(err);
    });
})
.put(function(req,res){   //update the specific articles
    Article.replaceOne({title:req.params.articleTitle},req.body).then(function(){ //  also overwrite completely like here if we do no provide title just the content then a complete new artilce with no tilte will be formed in place of older article
      res.send("Successfully updated");
    }).catch(function(err){
      res.send(err);
    });
})
.patch(function(req,res){  //to update only a specific field of specific article like only content not the title
 
  Article.updateOne({title:req.params.articleTitle},req.body).then(function(){ 
    res.send("Successfully updated");
  }).catch(function(err){
    res.send(err);
  });
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle}).then(function(){
    res.send("Successfully deleted");
}).catch(function(err){
    res.send(err);
});
});

 

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
