const express = require("express");
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session')
const cookieParser = require('cookie-parser')

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'user_id',
  keys: ['iamasuperkeyandilikesongs', 'pouet pouet yes spaces are okay why not']
}))


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {
  "userRandomID": {
    id: "1",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "2",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post('/register', (req, res) => {
  const { email, password } = req.body
  if (email == "" || password == "") {
    res.status(400).send('Email and password can not be empty')
  }

  if (lookUp(email) === 400) {
    res.status(400).send('User name already exist')
  }

  users[generateRandomString()] = { email, password }
  //const hashedPassword = bcrypt.hashSync(password, salt);
  req.session.userId = users
  console.log(users)
  res.redirect('/urls')
})

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});
shortURL = generateRandomString();
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase.b2xVn2
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  delete urlDatabase.b2xVn2
  res.send("delete")
  console.log("delete")
  res.redirect("http://localhost:8080/urls");
});

function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function lookUp(user) {
  for (let key of Object.keys(users)) {
    if (users[key].email === user) {
      return 400;
    }
  }

}