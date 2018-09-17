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
  overridePlayingContext: (newQueueItem) => {
    queueManager.playingContext = newQueueItem;
    globalSocket.emit('fetch now playing');
    globalSocket.broadcast.emit('fetch now playing');
  },
  handleQueueChanged: () => {
    globalSocket.emit('queue changed', queueManager.getQueue());
    globalSocket.broadcast.emit('queue changed', queueManager.getQueue());
  },
  updatePlayingContext: (option, newTrackPosition) => {
    if (option === 'pause') {
      queueManager.playingContext.currentlyPlaying = false;
      queueManager.playingContext.lastPausedAt = Date.now();
      queueManager.playingContext.trackProgress = (queueManager.playingContext.lastPausedAt - queueManager.playingContext.startTimestamp - queueManager.playingContext.totalTimePaused + queueManager.playingContext.seekDistance);
    } else if (option === 'play') {
      queueManager.playingContext.currentlyPlaying = true;
      queueManager.playingContext.totalTimePaused += (Date.now() - queueManager.playingContext.lastPausedAt);
    } else if (option === 'seek') {
      queueManager.playingContext.seekDistance += (newTrackPosition - (Date.now() - queueManager.playingContext.startTimestamp - queueManager.playingContext.totalTimePaused + queueManager.playingContext.seekDistance));
    }
    globalSocket.emit('fetch now playing');
    globalSocket.broadcast.emit('fetch now playing');
    // console.log(`Track Progress: ${parseMs(queueManager.playingContext.trackProgress)}`);
    // console.log(`Total Time Paused: ${parseMs(queueManager.playingContext.totalTimePaused)}`);
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

  api.get('/playing-context', (req, res) => {
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
      queueManager.updatePlayingContext('pause');
    });
    client.on('play track', () => {
      queueManager.updatePlayingContext('play');
    });
    client.on('seek track', (newTrackPosition) => {
      queueManager.updatePlayingContext('seek', newTrackPosition);
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

