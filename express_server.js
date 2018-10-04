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
  let templateVars = {
    urls: urlDatabase,
    user: users[userToken],
    userData: users
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
  let templateVars = {
    urls: urlDatabase,
    user: users[userToken],
    userData: users  // <-<--<-<-<-<-<<<<-<------<<<<----
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

  let templateVars = {
    urls: urlDatabase,
    user: users[userToken],
    userData: users,
    shortURL: req.params.id ,
    longURL: urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});


// _____++ Sign IN / Register ++_____

app.get("/register", (req, res) => {
  let userToken = req.cookies.user_ID;
  let templateVars = {
    urls: urlDatabase,
    user: users[userToken],
    userData: users
  };

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
    res.redirect("/urls");
  }
});

// __________++ LOGIN ++___________

app.get("/login", (req, res) => {
  let userToken = req.cookies.user_ID;
  let templateVars = {
    urls: urlDatabase,
    user: users[userToken],
    userData: users,
    shortURL: req.params.id ,
    longURL: urlDatabase[req.params.id],
  };
  res.render("login", templateVars);
});

app.post("/login", (req,res) => {
  //res.cookie("username", req.body.username);

  const user = authenticateUser(req.body.email, req.body.password);

  if (user) {
    res.cookie("user_ID", user.id);
    console.log("user_id ", user.id)  //<-----<-------<<-------
    res.redirect("/urls");
  } else {
    res.status(400);
    res.send('None shall pass');
  }
});

function authenticateUser(email, password) {
  for (var key in users) {
    if (users[key].email === email && users[key].password === password) {
      return users[key];
    }
  }
}

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

