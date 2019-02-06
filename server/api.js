const express = require('express');
const request = require('request');
const { arrayMove } = require('react-sortable-hoc');
const QueueManager = require('./models/queueManager');
const QueueItem = require('./models/queueItem');
const dbHelper = require('./helpers/dbHelper');
const config = require('../auth/config');

const { Router } = express;

let users = [];
let globalSocket = null;

const queueManager = new QueueManager({
  beginTrack: (track, user) => {
    queueManager.updateRecentlyPlayed();
    queueManager.serverSideTrackProgress = 0;

    queueManager.playingContext = new QueueItem({
      track,
      startTimestamp: Date.now(),
      user,
    });
    queueManager.emitPlayingContextChanged();
  },
  playNext: () => {
    queueManager.updateMostPlayed();
    queueManager.playHistory.push(queueManager.getPlayingContext());

    let trackToPlay;
    if (queueManager.queue.length > 0) {
      trackToPlay = queueManager.getQueue().shift();
      queueManager.beginTrack(trackToPlay.track, trackToPlay.user);
      queueManager.emitQueueChanged();
    } else if (queueManager.spotifyAuth.access_token && queueManager.getRecentlyPlayed().length > 0) {
      let seed_tracks;
      if (queueManager.getRecentlyPlayed().length < 5) {
        seed_tracks = queueManager.getRecentlyPlayed().map(item => item.track.id).join(',');
      } else {
        seed_tracks = queueManager.getRecentlyPlayed().slice(-5).map(item => item.track.id).join(',');
      }
      const params = {
        url: 'https://api.spotify.com/v1/recommendations',
        qs: {
          limit: 1,
          seed_tracks,
        },
        headers: {
          Authorization: `Bearer ${queueManager.spotifyAuth.access_token}`,
        },
        json: true,
      };
      request.get(params, (error, response, body) => {
        if (error) {
          console.log(error);
          if (error.message === 'The access token expired') {
            queueManager.getToken().then(queueManager.playNext);
          }
        } else {
          const track = body.tracks[0];
          queueManager.beginTrack(track, { username: 'Bot' });
        }
      });
      queueManager.playingContext = null;
      queueManager.emitPlayingContextChanged();
    } else {
      queueManager.playingContext = null;
      queueManager.emitPlayingContextChanged();
    }
  },
  playPrev: () => {
    if (queueManager.serverSideTrackProgress <= 5000 && queueManager.playHistory.length > 0) {
      const prevItem = queueManager.playHistory.pop();
      const currentItem = queueManager.getPlayingContext();
      queueManager.queueUnshiftTrack(currentItem.track, currentItem.user);

      queueManager.beginTrack(prevItem.track, prevItem.user);
    } else {
      queueManager.updatePlayingContext('seek', null, null, 0);
    }
  },

  emitPlayingContextChanged: () => {
    globalSocket.emit('fetch playing context', queueManager.getPlayingContext());
    globalSocket.broadcast.emit('fetch playing context', queueManager.getPlayingContext());
  },
  emitRecentlyPlayedChanged: () => {
    globalSocket.emit('fetch recently played', queueManager.getRecentlyPlayed());
    globalSocket.broadcast.emit('fetch recently played', queueManager.getRecentlyPlayed());
  },
  emitMostPlayedChanged: () => {
    globalSocket.emit('fetch most played');
    globalSocket.broadcast.emit('fetch most played');
  },
  emitQueueChanged: () => {
    globalSocket.emit('fetch queue', queueManager.getQueue());
    globalSocket.broadcast.emit('fetch queue', queueManager.getQueue());
  },

  updatePlayingContext: (option, track, user, newTrackPosition) => {
    if (option === 'override') {
      if (queueManager.getPlayingContext()) {
        queueManager.playHistory.push(queueManager.getPlayingContext());
      }
      queueManager.beginTrack(track, user);
    } else if (option === 'pause' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: false,
        lastPausedAt: Date.now(),
      });
      queueManager.emitPlayingContextChanged();
    } else if (option === 'resume' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: true,
        totalTimePaused: queueManager.getPlayingContext().totalTimePaused + Date.now() - queueManager.getPlayingContext().lastPausedAt,
      });
      queueManager.emitPlayingContextChanged();
    } else if (option === 'seek' && queueManager.getPlayingContext()) {
      queueManager.modifyPlayingContext({
        currentlyPlaying: true,
        seekDistance: queueManager.getPlayingContext().seekDistance + (newTrackPosition - (Date.now() - queueManager.getPlayingContext().startTimestamp - queueManager.getPlayingContext().totalTimePaused + queueManager.getPlayingContext().seekDistance)),
      });
      queueManager.emitPlayingContextChanged();
    }
  },
  updateRecentlyPlayed: () => {
    if (!queueManager.getPlayingContext() || queueManager.getTotalPlayTime() < 30000) return;
    const { track } = queueManager.getPlayingContext();
    const index = queueManager.getRecentlyPlayed().findIndex(recentTrack => recentTrack.track.uri === track.uri);
    if (index !== -1) {
      queueManager.recentlyPlayed.splice(index, 1);
    }
    queueManager.recentlyPlayed.unshift(queueManager.getPlayingContext());
    queueManager.emitRecentlyPlayedChanged();
  },
  updateMostPlayed: () => {
    if (queueManager.getTotalPlayTime() < 30000) return;
    dbHelper.update(queueManager.playingContext.track);
    queueManager.emitMostPlayedChanged();
  },
  updateQueue: (oldIndex, newIndex) => {
    queueManager.queue = arrayMove(queueManager.queue, oldIndex, newIndex);
    queueManager.emitQueueChanged();
  },
});
queueManager.getToken();

// events that affect all connected clients
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
  client.on('queue playlist', (playlist, user) => {
    queueManager.queuePlaylist(playlist, user);
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
        newUser.socketId = client.id;
        newUser.banned = false;
        console.log(`${newUser.username} has connected!`);
        users.push(newUser);
      }
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });

    client.on('disconnect', () => {
      users = users.filter(user => user.socketId !== client.id);
      if (!users.length) {
        queueManager.updatePlayingContext('pause');
      }
      client.emit('update users', users);
      client.broadcast.emit('update users', users);
    });

    userActions(client);
  });

  return api;
};

module.exports = socketApi;


// override playing context (track, user)
// queue = [];
// playHistory = [];
// user override play context
  // if currentlyPlaying track exists, add currently playing track to playHistory
    // play override track
// user clicks next
  // add currently playing track to playHistory
  // play new track
// user clicks back
  // add currently playing track to playHistory
  // queue.push(playHistory.pop())

