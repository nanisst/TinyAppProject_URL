//Before runing it install on the terminal: $npm install express --save

var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookiesParse = require('cookie-parser');


app.set("view engine", "ejs"); //Tell Express App to use EJS as its templating engine

//To keep track of all the URLs and their shortened forms
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "503nc4": "https://www.facebook.com/nanisotoo"
};



// The body-parser library will allow us to access POST request parameters
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookiesParse());

app.get("/", (req, res) => {
  res.send("Hello!");
});



app.get("/urls.json", (req, res) => { //path is the one of the web
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]};
    console.log("templateVars", templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok \uD83D\uDC4D");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];  // debug statement to see POST parameters
  res.redirect("/urls");
});

//Post request
app.post("/urls/:id/post", (req, res) => {
  try {
    urlDatabase[req.params.id] = req.body.subbody; //access to my form --> body's content
  } catch (err) {
    console.log("something went terribly wrong", err);
  }
  res.redirect("/urls");
});

// Log in<---------<-------<-------------<------<-------
app.post("/login", (req,res) => {
  res.cookie("username", req.body.username);

  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});


app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined) {
    res.redirect("http://localhost:8080/urls");
  } else {res.redirect(longURL);}
});

//req.params is the path on the web
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id ,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"] };  //add username to templatevars
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.listen(PORT, () => {
  console.log("Example app listening on port ${PORT}!");
});


function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}



