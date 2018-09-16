const express = require('express');
const request = require('request');
const queryString = require('query-string');
const rand = require('random-key');
const config = require('../auth/config');

const { Router } = express;
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require('../auth/config');

const auth = Router();

const redirect_uri = process.env.REDIRECT_URI || `${config.HOST}/auth/callback`;
const hostURL = 'http://localhost:3006';

auth.get('/login', (req, res) => {
  const state = rand.generate();
  const scope = `user-read-private
  user-read-email
  user-read-currently-playing
  user-read-playback-state
  user-modify-playback-state
  playlist-read-private`;
  const params = queryString.stringify({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope,
    redirect_uri,
    state,
  });
  // console.log('redirecting');
  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

auth.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
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
      console.log('access token cookie created');
      res.redirect(hostURL);
    });
  }
});

auth.get('/token', (req, res) => {
  if (!req.cookies) return;
  const { expires_in, refresh_token } = req.cookies;
  if (Date.now() > expires_in) {
    console.log('token expired, grabbing new token');
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
        console.log(`new access_token: ${access_token}`);
        console.log(`new expires_in: ${Date.now() + expires_in * 1000}`);
        res.cookie('access_token', access_token, { httpOnly: true });
        res.cookie('expires_in', Date.now() + expires_in * 1000, { httpOnly: true });
        res.send(req.cookies);
      }
    });
  } else {
    res.send(req.cookies);
  }
  // check expiration time for access token
  // if access token is expired, get a new token
});

module.exports = auth;
