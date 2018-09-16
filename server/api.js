const express = require('express');
const QueueManager = require('./models/queueManager');
const QueueItem = require('./models/queueItem');

const { Router } = express;
// const request = require('request');
// const queryString = require('query-string');

const parseMs = (ms) => {
  let result = '';
  let minutes = 0;
  let seconds = 0;

  minutes = Math.floor(ms / 1000 / 60);
  seconds = Math.floor((ms / 1000) % 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  result += `${minutes}:${seconds}`;
  return result;
};

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
  overridePlayingContext: (newQueueItem) => {
    queueManager.playingContext = newQueueItem;
    globalSocket.emit('fetch now playing');
    globalSocket.broadcast.emit('fetch now playing');
  },
  handleQueueChanged: () => {
    globalSocket.emit('queue changed', queueManager.getQueue());
    globalSocket.broadcast.emit('queue changed', queueManager.getQueue());
  },
  updatePlayingContextPause: () => {
    queueManager.playingContext.currentlyPlaying = false;
    queueManager.playingContext.lastPausedAt = Date.now();
    queueManager.playingContext.trackProgress = (queueManager.playingContext.lastPausedAt - queueManager.playingContext.startTimestamp - queueManager.playingContext.totalTimePaused + queueManager.playingContext.seekDistance);
    globalSocket.emit('fetch now playing');
    globalSocket.broadcast.emit('fetch now playing');
    console.log('pausing track');
    // console.log(`Track Progress: ${parseMs(queueManager.playingContext.trackProgress)}`);
    // console.log(`Total Time Paused: ${parseMs(queueManager.playingContext.totalTimePaused)}`);
  },
  updatePlayingContextResume: () => {
    queueManager.playingContext.currentlyPlaying = true;
    queueManager.playingContext.totalTimePaused += (Date.now() - queueManager.playingContext.lastPausedAt);
    globalSocket.emit('fetch now playing');
    globalSocket.broadcast.emit('fetch now playing');
    console.log('resuming track');
  },
  updatePlayingContextSeek: (newTrackPosition) => {
    queueManager.playingContext.seekDistance += (newTrackPosition - (Date.now() - queueManager.playingContext.startTimestamp - queueManager.playingContext.totalTimePaused + queueManager.playingContext.seekDistance));
    globalSocket.emit('fetch now playing');
    globalSocket.broadcast.emit('fetch now playing');
    console.log('seeking track');
  },
});

const socketApi = (io) => {
  const api = Router();
  api.get('/', (req, res) => {
    console.log('getting /api/*');
  });

  api.get('/queue', (req, res) => {
    console.log('getting /api/queue');
    res.send(queueManager.queue);
  });

  api.get('/users', (req, res) => {
    res.send(users);
  });

  api.get('/now-playing', (req, res) => {
    res.send(queueManager.playingContext);
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
      queueManager.overridePlayingContext(formatTrack(track, client.id));
    });
    client.on('pause playback', () => {
      queueManager.updatePlayingContextPause();
    });
    client.on('resume playback', () => {
      queueManager.updatePlayingContextResume();
    });
    client.on('seek track', (newTrackPosition) => {
      queueManager.updatePlayingContextSeek(newTrackPosition);
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

