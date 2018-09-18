const express = require('express');
const QueueManager = require('./models/queueManager');
const QueueItem = require('./models/queueItem');

const { Router } = express;
// const request = require('request');
// const queryString = require('query-string');

const formatTrack = (track, userID) => {
  console.log('formatting track');
  const newQueueItem = new QueueItem({
    track,
    startTimestamp: Date.now(),
    userID,
  });
  return newQueueItem;
};

let users = [];

let globalSocket = null;

const queueManager = new QueueManager({
  handleQueueChanged: () => {
    // broadcasts updated queue to all clients
    globalSocket.emit('queue changed', queueManager.getQueue());
    globalSocket.broadcast.emit('queue changed', queueManager.getQueue());
  },
  updatePlayingContext: (option, track, clientID, newTrackPosition) => {
    clearInterval(queueManager.interval);
    if (option === 'override') {
      queueManager.playingContext = formatTrack(track, clientID);
    } else if (option === 'play next') {
      queueManager.playingContext = track;
    } else if (option === 'pause') {
      queueManager.modifyPlayingContext({
        currentlyPlaying: false,
        lastPausedAt: Date.now(),
        trackProgress: (queueManager.getPlayingContext().lastPausedAt - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance),
      });
    } else if (option === 'play') {
      queueManager.modifyPlayingContext({
        currentlyPlaying: true,
        totalTimePaused: queueManager.getPlayingContext().totalTimePaused + Date.now() - queueManager.getPlayingContext().lastPausedAt,
      });
    } else if (option === 'seek') {
      queueManager.modifyPlayingContext({
        seekDistance: queueManager.getPlayingContext().seekDistance + (newTrackPosition - (Date.now() - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance)),
      });
    } else if (option === 'back') {
      queueManager.playingContext = formatTrack(queueManager.recentlyPlayed.shift(), clientID);
    }

    if (Object.prototype.hasOwnProperty.call(queueManager.getPlayingContext(), 'track')) {
      const progressTracker = () => {
        if (queueManager.serverSideTrackProgress >= queueManager.getPlayingContext().track.duration_ms) {
          queueManager.handleTrackEnd();
        }
        if (queueManager.getPlayingContext().currentlyPlaying === true) {
          queueManager.serverSideTrackProgress = Date.now() - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance;
        } else if (queueManager.getPlayingContext.currentlyPlaying === false) {
          queueManager.serverSideTrackProgress = queueManager.getPlayingContext().lastPausedAt - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance;
        }
      };
      queueManager.interval = setInterval(progressTracker, 300);
    }
    globalSocket.emit('fetch now playing');
    globalSocket.broadcast.emit('fetch now playing');
  },
  updateRecentlyPlayed: () => {
    const { track, userID } = queueManager.getPlayingContext();
    if (queueManager.recentlyPlayed.findIndex(recentTrack => recentTrack.track.uri === track.uri) === -1) {
      queueManager.recentlyPlayed.unshift(queueManager.getPlayingContext());
    }
    globalSocket.emit('fetch recently played');
    globalSocket.broadcast.emit('fetch recently played');
  },
});

const socketApi = (io) => {
  const api = Router();
  api.get('/queue', (req, res) => {
    res.json(queueManager.getQueue());
  });

  api.get('/users', (req, res) => {
    res.json(users);
  });

  api.get('/playing-context', (req, res) => {
    res.json(queueManager.getPlayingContext());
  });

  api.get('/recently-played', (req, res) => {
    res.json(queueManager.getRecentlyPlayed());
  });

  io.on('connection', (client) => {
    globalSocket = client;
    console.log(`client ${client.id} connected`);
    client.on('add user', (data) => {
      users.push(data);
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });
    client.on('queue track', () => {
      console.log('queueing track');
    });
    client.on('remove track', () => {
      console.log('removing track');
    });
    client.on('override playing context', (track) => {
      queueManager.updatePlayingContext('override', track, client.id);
    });
    client.on('pause playback', () => {
      queueManager.updatePlayingContext('pause');
    });
    client.on('play track', () => {
      queueManager.updatePlayingContext('play');
    });
    client.on('back track', () => {
      if (queueManager.serverSideTrackProgress <= 5000 && queueManager.getRecentlyPlayed().length > 0) {
        console.log('real backing');
        queueManager.updatePlayingContext('back');
      } else {
        queueManager.updatePlayingContext('seek', null, null, 0);
      }
    });
    client.on('seek track', (newTrackPosition) => {
      queueManager.updatePlayingContext('seek', null, null, newTrackPosition);
    });
    client.on('disconnect', () => {
      console.log(`client ${client.id} disconnected`);
      users = users.filter(user => user.id !== client.id);
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });
  });

  return api;
};

module.exports = socketApi;
