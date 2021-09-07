//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: "Youcannotdecodeevenifuwant",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Sample Insertion of values
// const article = [
//       {
//       title: "Bootstrap",
//       content: "A CSS library developed by Twitter"
//       },
//       {
//             title: "mongoose",
//             content: "A npm module use to deal with CRUD operations of MongoDB"
//       },
//       {
//             title: "material_UI",
//             content: "A style libray used with React.JS"
//       }
// ];

// Article.collection.insertMany(article, function(err) {
//       if (err){ 
//           return console.error(err);
//       } else {
//         console.log("Multiple documents inserted to Collection");
//       }
// });
/////////////////////////

app.get("/", function(req, res){
  res.render("home");
});
app.get("/login", function(req, res){
  res.render("login");
});
app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  if (req.isAuthenticated()){
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){

//     const newUser =  new User({
//       email: req.body.username,
//       password: md5(req.body.password)
//     });
//     newUser.save(function(err){
//       if (err) {
//         console.log(err);
//       } else {
//         res.render("secrets");
//       }
//     });

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});

app.post("/login", function(req, res){

      // const enteredEmail = req.body.username;
      // const enterPass = md5(req.body.password);
      // User.findOne({email: enteredEmail}, function(err, found) {
      //       if(err)
      //             console.log(err);
      //       else {
      //             if(found.password === enterPass)
      //                   res.render("secrets");
      //       }
      // })      
      
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      // if (foundUser) {
      //   bcrypt.compare(password, foundUser.password, function(err, result) {
      //     if (result === true) {
      //       res.render("secrets");
      //     }
      //   });
      // }
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});


app.listen(3000, function() {
      console.log("Server started on port 3000.");
});