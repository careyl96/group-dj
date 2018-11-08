const express = require('express');
const pgPool = require('../database/index');

const { Router } = express;

const saved = Router();

saved.get('/', (req, res) => {
  const savedQuery = `SELECT saved_tracks_play_count, saved_tracks_info::json FROM saved_tracks`;
  pgPool.query(savedQuery, (err, results) => {
    if (err) {
      res.status(500);
      res.send(err);
      return;
    }
    res.send(results.rows);
  });
});

module.exports = saved;
