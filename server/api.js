const express = require('express');
// const request = require('request');
// const queryString = require('query-string');
// const config = require('../auth/config');

const { Router } = express;

const api = Router();

let users = [];

const socketApi = (io) => {
  api.get('/', (req, res) => {
    console.log('getting /api/*');
  });

  api.get('/queue', (req, res) => {
    console.log('getting /api/queue');
  });

  api.get('/users', (req, res) => {
    res.send(users);
  });

  io.on('connection', (client) => {
    console.log(`client ${client.id} connected`);
    client.on('add user', (data) => {
      users.push(data);
      io.emit('update users', users);
    });
    client.on('queue track', () => {
      console.log('queueing track');
    });
    client.on('remove track', () => {
      console.log('removing track');
    });
    client.on('disconnect', () => {
      console.log(`client ${client.id} disconnected`);
      users = users.filter(user => user.id !== client.id);
      io.emit('update users', users);
    });
  });

  return api;
};

module.exports = socketApi;
