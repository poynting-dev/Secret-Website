const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = {
      email: String,
      password: String
};

const User = mongoose.model("User", userSchema);
  
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


//Request Targeting All articles

app.get("/", function(req, res) {
      res.render("home");
});

app.get("/login", function(req, res) {
      res.render("login");
});

app.get("/register", function(req, res) {
      res.render("register");
});

app.post("/register", function(req, res) {
      const newUser = new User({
            email: req.body.username,
            password: req.body.password
      })
      newUser.save(function(err) {
            if(!err)
                  res.render("secrets");
            else
                  console.log(err);
      });
});

app.post("/login", function(req, res) {
      const enteredEmail = req.body.username;
      const enterPass = req.body.password;
      User.findOne({email: enteredEmail}, function(err, found) {
            if(err)
                  console.log(err);
            else {
                  if(found.password === enterPass)
                        res.render("secrets");
            }
      })
});


app.listen(3000, function() {
      console.log("Server is running on port 3000");
});