const express = require('express');
const { arrayMove } = require('react-sortable-hoc');
const QueueManager = require('./models/queueManager');
const QueueItem = require('./models/queueItem');
const dbHelper = require('./helpers/dbHelper');

const { Router } = express;

let users = [];

let globalSocket = null;

const queueManager = new QueueManager({
  beginTrack: (track, user) => {
    queueManager.updateRecentlyPlayed();
    queueManager.playingContext = new QueueItem({
      track,
      startTimestamp: Date.now(),
      user,
    });
    queueManager.serverSideTrackProgress = 0;
    queueManager.handlePlayingContextChanged();
  },
  playNext: () => {
    dbHelper.update(queueManager.playingContext.track);
    queueManager.serverSideTrackProgress = 0;
    queueManager.updateRecentlyPlayed();
    queueManager.updateMostPlayed();
    let nextItem = null;
    if (queueManager.playHistory.node.next) {
      nextItem = queueManager.playHistory.getNext().item;
      queueManager.beginTrack(nextItem.track, nextItem.user);
      queueManager.handlePlayHistoryChanged();
    } else if (queueManager.queue.length > 0) {
      nextItem = queueManager.getQueue().shift();
      queueManager.handleQueueChanged();
      queueManager.beginTrack(nextItem.track, nextItem.user);

      queueManager.playHistory.addNode({
        track: nextItem.track,
        user: nextItem.user,
      });
      queueManager.handlePlayHistoryChanged();
    } else {
      queueManager.playingContext = null;
      queueManager.handlePlayingContextChanged();
    }
  },
  playPrev: () => {
    if (queueManager.serverSideTrackProgress <= 5000 && queueManager.playHistory.node.prev) {
      const prevItem = queueManager.playHistory.getPrev().item;
      queueManager.beginTrack(prevItem.track, prevItem.user);
      queueManager.handlePlayHistoryChanged();
    } else {
      queueManager.updatePlayingContext('seek', null, null, 0);
    }
  },

  handlePlayingContextChanged: () => {
    globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
    globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
  },
  handleRecentlyPlayedChanged: () => {
    globalSocket.emit('fetch recently played', queueManager.getRecentlyPlayed());
    globalSocket.broadcast.emit('fetch recently played', queueManager.getRecentlyPlayed());
  },
  handlePlayHistoryChanged: () => {
    globalSocket.emit('fetch play history', queueManager.getPlayHistory());
    globalSocket.broadcast.emit('fetch play history', queueManager.getPlayHistory());
  },
  handleMostPlayedChanged: () => {
    globalSocket.emit('fetch most played');
    globalSocket.broadcast.emit('fetch most played');
  },
  handleQueueChanged: () => {
    globalSocket.emit('fetch queue', queueManager.getQueue());
    globalSocket.broadcast.emit('fetch queue', queueManager.getQueue());
  },

  updatePlayingContext: (option, track, user, newTrackPosition) => {
    if (option === 'override') {
      queueManager.beginTrack(track, user);
      queueManager.playHistory.addNode({
        track,
        user,
      });
      queueManager.handlePlayHistoryChanged();
    } else if (option === 'pause' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: false,
        lastPausedAt: Date.now(),
      });
      queueManager.handlePlayingContextChanged();
    } else if (option === 'resume' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: true,
        totalTimePaused: queueManager.getPlayingContext().totalTimePaused + Date.now() - queueManager.getPlayingContext().lastPausedAt,
      });
      queueManager.handlePlayingContextChanged();
    } else if (option === 'seek' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: true,
        seekDistance: queueManager.getPlayingContext().seekDistance + (newTrackPosition - (Date.now() - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance)),
      });
      queueManager.handlePlayingContextChanged();
    }
  },
  updateRecentlyPlayed: () => {
    if (!queueManager.getPlayingContext()) return;
    const { track } = queueManager.getPlayingContext();
    if (queueManager.recentlyPlayed.findIndex(recentTrack => recentTrack.track.uri === track.uri) === -1) {
      queueManager.recentlyPlayed.unshift(queueManager.getPlayingContext());
    }

    queueManager.handleRecentlyPlayedChanged();
  },
  updateMostPlayed: () => {
    queueManager.handleMostPlayedChanged();
  },
  updateQueue: (oldIndex, newIndex) => {
    queueManager.queue = arrayMove(queueManager.queue, oldIndex, newIndex);
    queueManager.handleQueueChanged();
  },
});


const userActions = (client) => {
  client.on('override playing context', (track, user) => {
    queueManager.updatePlayingContext('override', track, user);
  });
  client.on('pause playback', () => {
    queueManager.updatePlayingContext('pause');
  });
  client.on('resume playback', () => {
    queueManager.updatePlayingContext('resume');
  });
  client.on('seek track', (newTrackPosition) => {
    queueManager.updatePlayingContext('seek', null, null, newTrackPosition);
  });
  client.on('back track', () => {
    queueManager.playPrev();
  });
  client.on('skip track', () => {
    queueManager.playNext();
  });
  client.on('queue track', (track, user) => {
    queueManager.queueTrack(track, user);
  });
  client.on('remove track', (trackID) => {
    queueManager.removeFromQueue(trackID);
  });
  client.on('update queue', (oldIndex, newIndex) => {
    queueManager.updateQueue(oldIndex, newIndex);
  });
};

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

  io.use((client, next) => {
    client.on('override playing context', () => {
      client.broadcast.emit('user action', client.id);
      console.log('override playing context');
    });
    client.on('pause playback', () => {
      client.broadcast.emit('user action', client.id);
      console.log('pause playback');
    });
    client.on('resume playback', () => {
      client.broadcast.emit('user action', client.id);
      console.log('resume playback');
    });
    client.on('seek track', () => {
      client.broadcast.emit('user action', client.id);
      console.log('seek track');
    });
    client.on('back track', () => {
      client.broadcast.emit('user action', client.id);
      console.log('back track');
    });
    client.on('skip track', () => {
      client.broadcast.emit('user action', client.id);
      console.log('skip track');
    });
    client.on('queue track', () => {
      client.broadcast.emit('user action', client.id);
      console.log('queue track');
    });
    client.on('remove track', () => {
      client.broadcast.emit('user action', client.id);
      console.log('remove track');
    });
    client.on('update queue', () => {
      client.broadcast.emit('user action', client.id);
      console.log('update queue');
    });
    next();
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
      if (!users.find(user => user.id === data.id)) {
        const newUser = data;
        newUser.socketID = client.id;
        newUser.banned = false;
        console.log(`${newUser.username} has connected!`);
        users.push(newUser);
      }
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });
    client.on('disconnect', () => {
      users = users.filter(user => user.socketID !== client.id);
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });
    userActions(client);
  });

  return api;
};

module.exports = socketApi;
