const express = require('express');
const request = require('request');
const queryString = require('query-string');
const rand = require('random-key');
const { HOST, REDIRECT_URI, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require('../auth/config');

console.log(`HOST: ${HOST}`);
console.log(`REDIRECT_URI: ${REDIRECT_URI}`);

const { Router } = express;

const auth = Router();

auth.get('/login', (req, res) => {
  const state = rand.generate();
  const scope = `user-read-private
  user-read-email
  user-read-currently-playing
  user-read-playback-state
  user-modify-playback-state
  user-library-read
  playlist-read-private
  user-top-read`;
  const params = queryString.stringify({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

auth.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    json: true,
  };

  if (state !== null) {
    request.post(authOptions, (error, response, body) => {
      const { access_token, refresh_token, expires_in } = body;
      res.cookie('access_token', access_token, { httpOnly: true });
      res.cookie('refresh_token', refresh_token, { httpOnly: true });
      res.cookie('expires_in', Date.now() + expires_in * 1000, { httpOnly: true });
      res.cookie('user_id', rand.generate(), { httpOnly: true });
      res.redirect(HOST);
    });
  }
});

auth.get('/token', (req, res) => {
  console.log('getting /token');
  if (!Object.keys(req.cookies).length) res.status(401).send('not logged in');
  const { expires_in, refresh_token } = req.cookies;
  // if (Date.now() > expires_in) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      refresh_token,
      grant_type: 'refresh_token',
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
    },
    json: true,
  };
  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token, expires_in } = body;
      res.cookie('access_token', access_token, { httpOnly: true });
      res.cookie('expires_in', Date.now() + expires_in * 1000, { httpOnly: true });
      res.send({
        access_token,
        expires_in: Date.now() + expires_in * 1000,
        user_id: req.cookies.user_id,
      });
    }
  });
  // } else {
  // res.send(req.cookies);
  // }
  // check expiration time for access token
  // if access token is expired, get a new token
});

module.exports = auth;
