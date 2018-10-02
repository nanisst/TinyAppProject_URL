//Before runing it install on the terminal: $npm install express --save


var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
})
   .get("/urls.json", (req, res) => { //De donde viene el path
    res.json(urlDatabase);
})
   .get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

