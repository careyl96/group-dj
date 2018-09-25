const express = require('express');
const QueueManager = require('./models/queueManager');
const QueueItem = require('./models/queueItem');

const { Router } = express;
// const request = require('request');
// const queryString = require('query-string');

let users = [];

let globalSocket = null;

const queueManager = new QueueManager({
  beginTrack: (track, user) => {
    queueManager.serverSideTrackProgress = 0;
    queueManager.playingContext = new QueueItem({
      track,
      startTimestamp: Date.now(),
      user,
    });
    globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
    globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
  },
  playNext: () => {
    queueManager.updateRecentlyPlayed();
    let nextItem = null;
    if (queueManager.playHistory.node.next) {
      nextItem = queueManager.playHistory.getNext().item;
    } else if (queueManager.queue.length > 0) {
      nextItem = queueManager.getQueue().shift();
      queueManager.handleQueueChanged();
    }

    if (nextItem) {
      queueManager.beginTrack(nextItem.track, nextItem.user);
    } else {
      console.log('queue is empty');
      queueManager.playingContext = null;
    }

    globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
    globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
  },
  handleQueueChanged: () => {
    // broadcasts updated queue to all clients
    globalSocket.emit('fetch queue', queueManager.getQueue());
    globalSocket.broadcast.emit('fetch queue', queueManager.getQueue());
  },
  updatePlayingContext: (option, track, user, newTrackPosition) => {
    if (option === 'play next') {
      queueManager.playNext();
    } else if (option === 'override') {
      queueManager.playHistory.addNode({
        track,
        user,
      });
      queueManager.beginTrack(track, user);
      globalSocket.emit('fetch play history', queueManager.getPlayHistory());
      globalSocket.broadcast.emit('fetch play history', queueManager.getPlayHistory());
    } else if (option === 'pause' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: false,
        lastPausedAt: Date.now(),
      });
      globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
      globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
    } else if (option === 'play' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: true,
        totalTimePaused: queueManager.getPlayingContext().totalTimePaused + Date.now() - queueManager.getPlayingContext().lastPausedAt,
      });
      globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
      globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
    } else if (option === 'seek' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: true,
        seekDistance: queueManager.getPlayingContext().seekDistance + (newTrackPosition - (Date.now() - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance)),
      });
      globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
      globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
    } else if (option === 'back') {
      if (queueManager.serverSideTrackProgress <= 5000 && queueManager.playHistory.node.prev) {
        const prevItem = queueManager.playHistory.getPrev().item;
        queueManager.beginTrack(prevItem.track, prevItem.user);
        globalSocket.emit('fetch play history', queueManager.getPlayHistory());
        globalSocket.broadcast.emit('fetch play history', queueManager.getPlayHistory());
      } else {
        queueManager.updatePlayingContext('seek', null, null, 0);
      }
    }

    clearInterval(queueManager.interval);
    if (queueManager.getPlayingContext()) {
      queueManager.interval = setInterval(() => {
        if (queueManager.serverSideTrackProgress >= queueManager.getPlayingContext().track.duration_ms) {
          queueManager.handleTrackEnd();
          return;
        }

        if (queueManager.getPlayingContext().currentlyPlaying === true) {
          queueManager.serverSideTrackProgress = Date.now() - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance;
        } else if (queueManager.getPlayingContext.currentlyPlaying === false) {
          queueManager.serverSideTrackProgress = queueManager.getPlayingContext().lastPausedAt - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance;
        }
      }, 300);
    }
    // globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
    // globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
  },
  updateRecentlyPlayed: () => {
    if (!queueManager.getPlayingContext()) return;
    const { track } = queueManager.getPlayingContext();
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

  api.get('/server-track-progress', (req, res) => {
    res.json(queueManager.getTrackProgress());
  });

  api.get('/time', (req, res) => {
    res.json(Date.now());
  });

  io.on('connection', (client) => {
    globalSocket = client;
    client.on('time', () => {
      client.emit('fetch server time', {
        time: Date.now(),
        trackProgress: queueManager.serverSideTrackProgress,
      });
    });
    client.on('add user', (data) => {
      users.push(data);
      console.log(`${data.username} has connected!`);
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });
    client.on('override playing context', (track, user) => {
      queueManager.updatePlayingContext('override', track, user);
    });
    client.on('pause playback', () => {
      queueManager.updatePlayingContext('pause');
    });
    client.on('resume track', () => {
      queueManager.updatePlayingContext('play');
    });
    client.on('seek track', (newTrackPosition) => {
      queueManager.updatePlayingContext('seek', null, null, newTrackPosition);
    });
    client.on('back track', () => {
      queueManager.updatePlayingContext('back');
    });
    client.on('skip track', () => {
      queueManager.updatePlayingContext('play next');
    });
    client.on('queue track', (track, user) => {
      queueManager.queueTrack(track, user);
    });
    client.on('remove track', (trackID) => {
      queueManager.removeFromQueue(trackID);
    });
    client.on('disconnect', () => {
      users = users.filter(user => user.id !== client.id);
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });
  });

  return api;
};

module.exports = socketApi;
