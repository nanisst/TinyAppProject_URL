//_____EXPRESS_SERVER_______//

var express = require("express");
var app = express();
var PORT = 8080;
const bodyParser = require("body-parser");
var cookiesParse = require('cookie-parser');

//Tell Express App to use EJS as its templating engine
app.set("view engine", "ejs");

//DATA

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "503nc4": "https://www.facebook.com/nanisotoo"
};

var users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


// The body-parser library will allow us to access
//POST request parameters
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookiesParse());


app.get("/", (req, res) => {
  res.send("Hello!");
});

// ___________++ Hello ++___________

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// ___________++ Home ++___________

app.get("/urls", (req, res) => {
  let userToken = req.cookies.user_ID;
  let userEmail = req.cookies.email;
  let userpsw = req.cookies.password;

  let templateVars = {
    urls: urlDatabase,
    username: userToken,
    email: userEmail,
    password: userpsw
  };
    console.log("templateVars", templateVars);
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  //
  res.send("Ok \uD83D\uDC4D");
});


// ___________++ New ++___________

app.get("/urls/new", (req, res) => {
  let userToken = req.cookies.user_ID;
  let userEmail = req.cookies.email;
  let userpsw = req.cookies.password;

  let templateVars = {
    username: userToken,
    email: userEmail,
    password: userpsw
  };
  res.render("urls_new", templateVars);
});


app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


//Post request
app.post("/urls/:id/post", (req, res) => {
  try {
    urlDatabase[req.params.id] = req.body.subbody;
  } catch (err) {
    console.log("something went terribly wrong", err);
  }
  res.redirect("/urls");
});


app.post("/logout", (req, res) => {
  res.clearCookie("user_ID");
  //Checar si hay que limpiar tambien correo y contraseña
  res.redirect("/urls");
});


// ___________++ Go ++___________

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  if (longURL === undefined) {
    res.redirect("http://localhost:8080/urls");
  } else {res.redirect(longURL);}
});

// ___________++ Search ++___________

app.get("/urls/:id", (req, res) => {
  let userToken = req.cookies.user_ID;
  let userEmail = req.cookies.email;
  let userpsw = req.cookies.password;

  let templateVars = {
    shortURL: req.params.id ,
    longURL: urlDatabase[req.params.id],
    username: userToken,
    email: userEmail,
    password: userpsw
  };
  res.render("urls_show", templateVars);
});


// _____++ Sign IN / Register ++_____

app.get("/register", (req, res) => {
  let userToken = req.cookies.user_ID;
  let userEmail = req.cookies.email;
  let userpsw = req.cookies.password;

  let templateVars = {
    username: userToken,
    email: userEmail,
    password: userpsw};

  res.render("register", templateVars);
});


app.post("/register", (req, res) =>{
  var userRandomID = generateRandomString();
  users[userRandomID] = {};
  users[userRandomID].id = userRandomID;
  users[userRandomID].email = req.body.email;
  users[userRandomID].password = req.body.password;

  if (req.body.email === undefined || req.body.password === undefined) {
    res.status(400);
    res.send('Please write your email and password again');
  } else {
    res.cookie("user_ID", userRandomID);
    res.cookie("email", req.body.email);
    res.cookie("password", req.body.password);
    res.redirect("/urls");
  }
});

// __________++ LOGIN ++___________

app.get("/login", (req, res) => {
  let userToken = req.cookies.user_ID;
  let userEmail = req.cookies.email;
  let userpsw = req.cookies.password;

  let templateVars = {
    // shortURL: req.params.id ,
    // longURL: urlDatabase[req.params.id],
    username: userToken,
    email: userEmail,
    password: userpsw};

  res.render("login", templateVars);
});

// app.post("/login", (req,res) => {
//   res.cookie("username", req.body.username);
// });

app.post("/login", (req, res) =>{
  var userRandomID = generateRandomString();
  users[userRandomID] = {};
  users[userRandomID].id = userRandomID;
  users[userRandomID].email = req.body.email;
  users[userRandomID].password = req.body.password;

  if (req.body.email === undefined || req.body.password === undefined) {
    res.status(400);
    res.send('None shall pass');
  }
  res.redirect("/urls");
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



/*In order to do this, the endpoint will first need to try and find a user that matches the email submitted via the login form. If a user with that e-mail cannot be found, return a response with a 403 status code.
If a user with that e-mail address is located, compare the password given in the form with the existing user's password. If it does not match, return a response with a 403 status code.
If both checks pass, set the user_id cookie with the matching user's random ID, then redirect to /.*/



//usertoken = .user_ID <<nuevo nombre de la cookie
//llamar a la nueva usertoken en lugar de username
