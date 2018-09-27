class ServerDate {
  constructor(socket) {
    this.socket = socket;
    this.timeDifference = 0;
    this.socket.on('fetch server time', (data) => {
      this.timeDifference = Date.now() - data.time;
      this.trackProgress = data.trackProgress;
    });
  }

  now() {
    return Date.now() + this.timeDifference + 100;
  }

  getTrackProgress() {
    return this.trackProgress;
  }
}

export default ServerDate;
