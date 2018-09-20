import io from 'socket.io-client';
import config from '../auth/config';

class ServerDate {
  constructor(socket) {
    this.socket = socket;
    this.timeDifference = 0;
    this.socket.on('fetch server time', (data) => {
      this.timeDifference = Date.now() - data;
    });
  }

  now() {
    return Date.now() + this.timeDifference;
  }
}

const socket = io(config.HOST);

export default new ServerDate(socket);
