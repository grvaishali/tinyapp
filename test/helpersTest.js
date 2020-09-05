const { assert } = require('chai');
const { generateRandomString, lookUp, checkCredentials, checkUsername, getUserId, urlsForUser } = require('../helpers.js');

describe('lookUp', () => {
  it('returns 200 if no user is found', () => {
    assert.equal(200, lookUp('test@test.com', 'test', {}));
  });

  it('returns 400 if user is found', () => {
    assert.equal(400, lookUp('test@test.com', 'test', { "test": { id: "test", email: "test@test.com", hashedPassword: "test" } }));
  });
});

describe('checkCredentials', () => {
  it('returns 400 if no user is found', () => {
    assert.equal(400, checkCredentials('test@test.com', 'test', {}));
  });

  it('returns 200 if user is found', () => {
    assert.equal(200, checkCredentials('test@test.com', 'test', { "test": { id: "test", email: "test@test.com", hashedPassword: "test" } }));
  });
});

describe('checkUsername', () => {
  it('returns 400 if no user is found', () => {
    assert.equal(400, checkUsername('test@test.com', {}));
  });

  it('returns 200 if user is found', () => {
    assert.equal(200, checkUsername('test@test.com', { "test": { id: "test", email: "test@test.com", hashedPassword: "test" } }));
  });
});

describe('getUserId', () => {
  it('returns undefined if no user is found', () => {
    assert.equal(undefined, getUserId('test@test.com', {}));
  });

  it('returns id if user is found', () => {
    assert.equal('test', getUserId('test@test.com', { "test": { id: "test", email: "test@test.com", hashedPassword: "test" } }));
  });
});

describe('urlsForUser', () => {
  it('returns empty object if no user is found', () => {
    assert.deepEqual({}, urlsForUser('test@test.com', {}));
  });

  it('returns urls if user is found', () => {
    assert.deepEqual({ test: { longURL: "https://www.tsn.ca", userID: "test" } }, urlsForUser('test', {
      test: { longURL: "https://www.tsn.ca", userID: "test" }, i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
    }));
  });
});
