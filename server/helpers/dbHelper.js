const pgPool = require('../../database/index');

const update = (track) => {
  const updateQuery = `
  INSERT INTO saved_tracks (saved_tracks_id, saved_tracks_play_count, saved_tracks_info) 
  VALUES ('${track.id}', 1, '${JSON.stringify(track)}') 
  ON CONFLICT (saved_tracks_id) 
  DO UPDATE SET saved_tracks_play_count = saved_tracks.saved_tracks_play_count + 1`;
  pgPool.query(updateQuery, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = {
  update,
};
