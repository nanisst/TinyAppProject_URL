//Before runing it install on the terminal: $npm install express --save

var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.set("view engine", "ejs"); //Tell Express App to use EJS as its templating engine

//To keep track of all the URLs and their shortened forms
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// The body-parser library will allow us to access POST request parameters
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => { //path is the one of the web
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//req.params is the path on the web
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id , longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log("Example app listening on port ${PORT}!");
});



/*
<!DOCTYPE html>
<html lang="en">
<head>
  <title>TinyApp</title>
</head>
<body>
    <!-- Add your EJS code here -->
  <h1>Index of Urls</h1>
  <h2>Loop</h2>
  <ul>
      <% urls.forEach(function(url) { %>
          <li><%= url.name %> - <%= url.link %></li>
      <% }); %>
  </ul>


</body>
</html>
*/
