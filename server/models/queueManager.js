class QueueManager {
  constructor(options = {}) {
    this.queue = [];
    this.queueEmpty = true;
    this.playingContext = {
      track: null,
      trackProgress: null,
      user: 
    };
  }

  play() {
    if (this.queueEmpty) return;
    const queueItem = this.queue.shift();
    this.playingContext.track = queueItem.track;
    this.playingContext.startTime = Date.now();
    this.user = queueItem.user;
  }

  addToQueue(track) {
    this.queue.push(track);
  }

  removeFromQueue(track) {

  }

  handleQueueChange() {

  }
}

module.exports = QueueManager;
