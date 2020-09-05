//HELPER FUNCTIONS
function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function lookUp(user, password, users) {
  for (let key of Object.keys(users)) {
    if (users[key].email === user) {
      return 400;
    }
  }
  return 200;
}

function checkCredentials(user, password, users) {
  for (let key of Object.keys(users)) {
    if (users[key].hashedPassword === password && users[key].email === user) {
      return 200;
    }
  }
  return 400;
}

function checkUsername(user, users) {
  for (let key of Object.keys(users)) {
    if (users[key].email === user) {
      return 200;
    }
  }
  return 400;
}

function getUserId(email, users) {
  for (let key of Object.keys(users)) {
    if (users[key].email === email) {
      return key;
    }
  }
  return undefined;
}

function urlsForUser(id, urlDatabase) {
  let urls = {};
  if (!id) return urls;

  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      urls[url] = urlDatabase[url];
    }
  }
  return urls;
}

module.exports = { generateRandomString, lookUp, checkCredentials, checkUsername, getUserId, urlsForUser }