class QueueManager {
  constructor(options = {}) {
    this.queue = [1, 2, 3, 4, 5];
    this.playingContext = {};
    this.handleQueueChanged = options.handleQueueChanged;
    this.updatePlayingContext = options.updatePlayingContext;
    this.updateRecentlyPlayed = options.updateRecentlyPlayed;

    this.recentlyPlayed = [];

    this.interval = null;
    this.serverSideTrackProgress = 0;
  }

  playNextInQueue() {
    let queueItem = {};
    if (this.queue.length > 0) {
      queueItem = this.queue.shift();
      this.playingContext = queueItem;
      this.handleQueueChanged();
    }
    this.updatePlayingContext('play next', queueItem);
  }

  addToQueue(queueItem) {
    this.queue.push(queueItem);
    this.queueEmpty = false;
    this.handleQueueChanged();
  }

  removeFromQueue(id) {
    const index = this.queue.findIndex(item => item.id === id);
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
    this.playNextInQueue();
  }
}

module.exports = QueueManager;
