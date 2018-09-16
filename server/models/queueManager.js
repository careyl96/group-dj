class QueueManager {
  constructor(options = {}) {
    this.queue = [];
    this.queueEmpty = true;
    this.playingContext = {};
    this.overridePlayingContext = options.overridePlayingContext;
    this.handleQueueChanged = options.handleQueueChanged;
    this.updatePlayingContextPause = options.updatePlayingContextPause;
    this.updatePlayingContextResume = options.updatePlayingContextResume;
  }

  play() {
    if (this.queueEmpty) return;
    const queueItem = this.queue.shift();
    this.playingContext = queueItem;
  }

  addToQueue(queueItem) {
    this.queue.push(queueItem);
    this.queueEmpty = false;
  }

  removeFromQueue(id) {
    const index = this.queue.findIndex(item => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      if (this.queue.length === 0) {
        this.queueEmpty = true;
      }
      this.handleQueueChanged();
    }
  }

  getQueue() {
    return this.queue;
  }

  getPlayingContext() {
    return this.playingContext;
  }
}

module.exports = QueueManager;
