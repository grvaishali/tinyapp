const express = require("express");
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');

const app = express();
const PORT = 8080;
const salt = bcrypt.genSaltSync(10);

const { generateRandomString, lookUp, checkCredentials, checkUsername, getUserId, urlsForUser } = require('./helpers.js');
const { users, urlDatabase } = require('./database.js');

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'user_id',
  keys: ['iamasuperkeyandilikesongs', 'pouet pouet yes spaces are okay why not']
}));

app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//HOME
app.get("/", (req, res) => {
  if (req.session.user_id !== undefined && users[req.session.user_id] !== undefined) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

// REGISTER
app.get("/register", (req, res) => {
  if (req.session.user_id === undefined || users[req.session.user_id] === undefined) {
    res.render("urls_register");
  } else {
    res.redirect('/urls');
  }
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400).send('Email and password can not be empty');
  }
  if (lookUp(email, password, users) === 400) {
    res.status(400).send('User name already exist');
  }

  const newUserId = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, salt);
  users[newUserId] = { email, hashedPassword };
  req.session.user_id = newUserId;
  res.redirect('/urls');
});

//URLS
app.get("/urls", (req, res) => {
  let email = '';
  let currentUser = false;
  if (req.session.user_id !== undefined && users[req.session.user_id] !== undefined) {
    email = users[req.session.user_id].email;
    currentUser = true;
  } else {
    res.send("Access denied");
    return;
  }
  let templateVars = { urls: urlsForUser(req.session.user_id, urlDatabase), email: email, currentUser: currentUser };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  let email = '';
  let currentUser = false;
  if (req.session.user_id !== undefined && users[req.session.user_id] !== undefined) {
    email = users[req.session.user_id].email;
    currentUser = true;
  } else {
    res.redirect('/login');
    return;
  }
  let templateVars = { email: email, currentUser: currentUser };
  res.render("urls_new", templateVars);
});


app.get("/urls/:shortURL", (req, res) => {
  let email = '';
  let currentUser = false;
  if (req.session.user_id !== undefined && users[req.session.user_id] !== undefined) {
    email = users[req.session.user_id].email;
    currentUser = true;
  } else {
    res.send("Access denied");
    return;
  }
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.send("URL doesn't exist");
    return;
  }
  if (urlDatabase[req.params.shortURL].userID !== req.session.user_id) {
    res.send("URL belongs to some other user. Access denied.");
    return;
  }
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, email: email, currentUser: currentUser };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = req.body.longURL;
  urlDatabase[shortURL].userID = req.session.user_id;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  if (url === undefined) {
    res.send("URL doesn't exist");
    return;
  }
  res.redirect(url.longURL);
});

app.put('/urls/:shortURL', (req, res) => {
  const userURLs = urlsForUser(req.session.user_id, urlDatabase);

  if (userURLs[req.params.shortURL]) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect(`/urls/${req.params.shortURL}`);
    return;
  }

  res.status(400);
  res.send("Access denied");
});

app.delete('/urls/:shortURL', (req, res) => {
  const userURLs = urlsForUser(req.session.user_id, urlDatabase);
  if (userURLs[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
    return;
  }

  res.status(400);
  res.send("Access denied");
});

//LOGIN
app.get('/login', (req, res) => {
  if (req.session.user_id === undefined || users[req.session.user_id] === undefined) {
    res.render('urls_login');
  } else {
    res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, salt);

  if (email === "" || password === "") {
    res.send("Please enter all the details");
    return;
  }
  if (checkUsername(email, users) === 200) {
    if (checkCredentials(email, hashedPassword, users) === 200) {
      req.session.user_id = getUserId(email, users);
      res.redirect('/urls');
    } else {
      res.status(403);
      res.send('Password incorrect');
    }
    return;
  } else {
    res.status(403);
    res.send('No user with that email address exists');
  }

});

//LOGOUT
app.get('/logout', (req, res) => {
  req.session.user_id = undefined;
  res.redirect('/urls');
});

