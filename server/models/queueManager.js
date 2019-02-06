const request = require('request');
const config = require('../../auth/config');

class QueueManager {
  constructor(options = {}) {
    this.queue = [];
    this.playHistory = [];
    this.playingContext = null;

    this.spotifyAuth = {
      access_token: null,
      expires_in: null,
    };
    this.autoplay = true;

    this.emitQueueChanged = options.emitQueueChanged;
    this.emitPlayingContextChanged = options.emitPlayingContextChanged;
    this.emitPlayHistoryChanged = options.emitPlayHistoryChanged;
    this.emitRecentlyPlayedChanged = options.emitRecentlyPlayedChanged;
    this.emitMostPlayedChanged = options.emitMostPlayedChanged;

    this.beginTrack = options.beginTrack;
    this.updatePlayingContext = options.updatePlayingContext;
    this.updateRecentlyPlayed = options.updateRecentlyPlayed;
    this.updateMostPlayed = options.updateMostPlayed;
    this.updateQueue = options.updateQueue;

    this.playNext = options.playNext;
    this.playPrev = options.playPrev;

    this.recentlyPlayed = [];
    this.serverSideTrackProgress = 0;

    this.interval = setInterval(() => {
      if (this.playingContext) {
        if (this.serverSideTrackProgress >= this.playingContext.track.duration_ms) {
          this.playNext();
          return;
        }

        this.serverSideTrackProgress = this.playingContext.currentlyPlaying
          ? Date.now() - this.playingContext.startTimestamp - this.playingContext.totalTimePaused + this.playingContext.seekDistance
          : this.playingContext.lastPausedAt - this.playingContext.startTimestamp - this.playingContext.totalTimePaused + this.playingContext.seekDistance;
      }
    }, 300);
  }

  // eslint-disable-next-line class-methods-use-this
  getToken() {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.SPOTIFY_CLIENT_ID}:${config.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      json: true,
    };
    return request.post(authOptions, (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        this.spotifyAuth = {
          access_token: body.access_token,
          expires_in: Date.now() + body.expires_in * 1000,
        };
      }
    });
  }

  queueUnshiftTrack(track, user) {
    const queueItem = {
      track,
      user,
    };
    this.queue.unshift(queueItem);
    this.emitQueueChanged();
  }

  queueTrack(track, user) {
    const queueItem = {
      track,
      user,
    };
    if (!this.playingContext) {
      this.beginTrack(track, user);
    } else if (!this.getQueue().find(item => item.track.id === track.id)) {
      this.queue.push(queueItem);
      this.emitQueueChanged();
    }
  }

  queuePlaylist(playlist, user) {
    const playlistTracks = playlist.tracks;
    playlistTracks.forEach((track) => {
      this.queueTrack(track.track, user);
    });
  }

  removeFromQueue(id) {
    const index = this.queue.findIndex(item => item.track.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.emitQueueChanged();
    }
  }

  modifyPlayingContext(modifiedPlayingContext) {
    this.playingContext = { ...this.playingContext, ...modifiedPlayingContext };
    this.serverSideTrackProgress = Date.now() - this.playingContext.startTimestamp - this.playingContext.totalTimePaused + this.playingContext.seekDistance;
  }

  getQueue() {
    return this.queue;
  }

  getPlayingContext() {
    // if there's nothing playing return undefined
    // if there is something playing return the playingContext along with server side track progress
    return this.playingContext ? { ...this.playingContext, trackProgress: this.serverSideTrackProgress } : undefined;
  }

  getRecentlyPlayed() {
    return this.recentlyPlayed;
  }

  getPlayHistory() {
    const playHistory = {
      prev: this.playHistory.length > 0,
      next: this.queue.length > 0,
    };
    return playHistory;
  }

  getTrackProgress() {
    return this.serverSideTrackProgress;
  }

  getTotalPlayTime() {
    if (this.playingContext) {
      return this.serverSideTrackProgress - this.playingContext.seekDistance + this.playingContext.totalTimePaused;
    }
    return 0;
  }
}

module.exports = QueueManager;


// No songs playing - playingContext = null;
