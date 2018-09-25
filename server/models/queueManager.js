const DoublyLinkedList = require('../../helpers/history');

class QueueManager {
  constructor(options = {}) {
    this.queue = [];
    this.playingContext = null;

    this.handleQueueChanged = options.handleQueueChanged;
    this.handlePlayingContextChanged = options.handlePlayingContextChanged;
    this.handlePlayHistoryChanged = options.handlePlayHistoryChanged;
    this.handleRecentlyPlayedChanged = options.handleRecentlyPlayedChanged;

    this.beginTrack = options.beginTrack;
    this.updatePlayingContext = options.updatePlayingContext;
    this.updateRecentlyPlayed = options.updateRecentlyPlayed;
    this.playNext = options.playNext;
    this.playPrev = options.playPrev;
    this.playHistory = new DoublyLinkedList();

    this.recentlyPlayed = [];

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
    this.serverSideTrackProgress = 0;
  }

  queueTrack(track, user) {
    if (!this.playingContext) {
      this.beginTrack(track, user);
    } else if (!this.getQueue().find(item => item.track.id === track.id)) {
      const queueItem = {
        track,
        user,
      };
      this.queue.push(queueItem);
      this.handleQueueChanged();
    }
  }

  removeFromQueue(id) {
    const index = this.queue.findIndex(item => item.track.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.handleQueueChanged();
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
    return this.playingContext;
  }

  getRecentlyPlayed() {
    return this.recentlyPlayed;
  }

  getPlayHistory() {
    const playHistory = {
      prev: (this.playHistory.node.prev && this.playHistory.node.prev.item !== null),
      next: (this.playHistory.node.next && this.playHistory.node.next.item !== null),
    };
    return playHistory;
  }

  getTrackProgress() {
    return this.serverSideTrackProgress;
  }
}

module.exports = QueueManager;


// No songs playing - playingContext = null;
