// SOCKET LISTENERS

// ESTABLISH CONNECTION WITH SERVER ON SUCCESSFUL CONNECTION + AUTHENTICATION

// when a user connects to server, update users in server
  // then notify everyone connected to server by updating connected users
  // CLIENT CONNECT -> UPDATE SERVER USER LIST -> NOTIFY ALL CLIENTS

// when a user connects to server, grab queue data from server
  // update state
  // CLIENT CONNECT -> GRAB INFO FROM SERVER -> UPDATE CLIENT

// when a user queues a track, update queue
  // CLIENT QUEUE -> UPDATE SERVER QUEUE INFO -> NOTIFY ALL CLIENTS

// when a user removes/moves a track, update queue
  // CLIENT QUEUE -> UPDATE SERVER QUEUE INFO -> NOTIFY ALL CLIENTS

// when a track is removed from the queue, add to playing history
  // CLIENT QUEUE -> UPDATE SERVER QUEUE INFO -> NOTIFY ALL CLIENTS
