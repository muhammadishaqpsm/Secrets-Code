const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const secret = "This is our little secret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
  })
  .get("/login", function(req, res) {
    res.render("login");
  })
  .get("/register", function(req, res) {
    res.render("register");
  })
  .get("/secrets", function(req, res) {
    res.render("secrets");
  })
  .get("/submit", function(req, res) {
    res.render("submit");
  });

app.post("/register", function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  })
  .post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
      email: username
    }, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    });
  });






app.listen(3000, function() {
  console.log("you are running at port 3000");
});
