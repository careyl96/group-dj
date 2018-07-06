const express = require('express');
const path = require('path');
const request = require('request');
const queryString = require('query-string');
const morgan = require('morgan');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const handleSocketEvents = require('./socket-manager');

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require('../auth/config');

io.on('connection', handleSocketEvents);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../client/dist')));

const hostURL = 'http://localhost:3006';

const redirect_uri = process.env.REDIRECT_URI || `${hostURL}/callback`;
// api routes
app.get('/login', (req, res) => {
  res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email user-read-currently-playing user-modify-playback-state playlist-read-private',
      redirect_uri
    }));
})

app.get('/callback', (req, res) => {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        // process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function (error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || hostURL;
    res.redirect(uri + '?access_token=' + access_token)
  });
});

const port = 3006;
server.listen(process.env.PORT || port, (err) => {
  if (err) throw err;
  console.log(`Listening on http://localhost:${process.env.PORT || port}`);
});

module.exports = io;
