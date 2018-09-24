class QueueItem {
  constructor(options = {}) {
    this.track = options.track || {};
    this.currentlyPlaying = options.currentlyPlaying || true;
    this.lastPausedAt = 0;
    this.totalTimePaused = 0;
    this.seekDistance = 0;
    this.user = options.user || null;
    this.startTimestamp = options.startTimestamp || null;
    this.queuedTimestamp = options.queuedTimestamp || Date.now();
  }
}

module.exports = QueueItem;
