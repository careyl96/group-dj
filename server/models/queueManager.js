class QueueManager {
  constructor(options = {}) {
    this.queue = [];
    this.playingContext = null;
    this.handleQueueChanged = options.handleQueueChanged;
    this.beginTrack = options.beginTrack;
    this.updatePlayingContext = options.updatePlayingContext;
    this.updateRecentlyPlayed = options.updateRecentlyPlayed;
    this.playNext = options.playNext;

    this.recentlyPlayed = [];

    this.interval = null;
    this.serverSideTrackProgress = 0;
  }

  queueTrack(track, userID) {
    if (!this.playingContext) {
      this.beginTrack(track, userID);
    } else {
      const queueItem = {
        track,
        userID,
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

  handleTrackEnd() {
    this.serverSideTrackProgress = 0;
    this.updateRecentlyPlayed();
    this.playNext();
  }
}

module.exports = QueueManager;


// No songs playing - playingContext = null;
