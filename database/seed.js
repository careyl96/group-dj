const pgPool = require('./index.js');

const insertDummyData = () => {
  for (let i = 0; i < 5; i++) {
    const data = {"album":{"album_type":"compilation","artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of"},"href":"https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of","id":"0LyfQWJT6nXafLPZqxe9Of","name":"Various Artists","type":"artist","uri":"spotify:artist:0LyfQWJT6nXafLPZqxe9Of"}],"available_markets":["AD","AR","AT","AU","BE","BG","BO","BR","CA","CH","CL","CO","CR","CY","CZ","DE","DK","DO","EC","EE","ES","FI","FR","GB","GR","GT","HK","HN","HU","ID","IE","IL","IS","IT","JP","LI","LT","LU","LV","MC","MT","MX","MY","NI","NL","NO","NZ","PA","PE","PH","PL","PT","PY","RO","SE","SG","SK","SV","TH","TR","TW","US","UY","VN","ZA"],"external_urls":{"spotify":"https://open.spotify.com/album/5EoFzqCuihYOANw7RkWwUa"},"href":"https://api.spotify.com/v1/albums/5EoFzqCuihYOANw7RkWwUa","id":"5EoFzqCuihYOANw7RkWwUa","images":[{"height":600,"url":"https://i.scdn.co/image/84772db7e319d13fa9887f828226cb1add04ad13","width":600},{"height":300,"url":"https://i.scdn.co/image/a6caacdb2f7d4231a21f62a248428c4060a79526","width":300},{"height":64,"url":"https://i.scdn.co/image/0749511db491646e1eb54ac3af4401350b07d237","width":64}],"name":"New Blood Of Bass, Vol. 4","release_date":"2013-09-09","release_date_precision":"day","total_tracks":20,"type":"album","uri":"spotify:album:5EoFzqCuihYOANw7RkWwUa"},"artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/5FODVnlBocGxKKHstECQxA"},"href":"https://api.spotify.com/v1/artists/5FODVnlBocGxKKHstECQxA","id":"5FODVnlBocGxKKHstECQxA","name":"David Quinn","type":"artist","uri":"spotify:artist:5FODVnlBocGxKKHstECQxA"}],"available_markets":["AD","AR","AT","AU","BE","BG","BO","BR","CA","CH","CL","CO","CR","CY","CZ","DE","DK","DO","EC","EE","ES","FI","FR","GB","GR","GT","HK","HN","HU","ID","IE","IL","IS","IT","JP","LI","LT","LU","LV","MC","MT","MX","MY","NI","NL","NO","NZ","PA","PE","PH","PL","PT","PY","RO","SE","SG","SK","SV","TH","TR","TW","US","UY","VN","ZA"],"disc_number":1,"duration_ms":263142,"explicit":false,"external_ids":{"isrc":"QMSNZ1311879"},"external_urls":{"spotify":"https://open.spotify.com/track/1GkhxYsJvsrvE4dNkzvIC6"},"href":"https://api.spotify.com/v1/tracks/1GkhxYsJvsrvE4dNkzvIC6","id":"1GkhxYsJvsrvE4dNkzvIC6","is_local":false,"name":"ASDF - Original Mix","popularity":10,"preview_url":"https://p.scdn.co/mp3-preview/3a9c9ab6da1f306a6e49dcde44c5251e128e5a36?cid=b5b77a9488b44e918a4989bd55b46938","track_number":1,"type":"track","uri":"spotify:track:1GkhxYsJvsrvE4dNkzvIC6"};
    const savedQuery = `
    INSERT INTO saved_tracks (saved_tracks_id, saved_tracks_play_count, saved_tracks_info) 
    VALUES ('${data.uri}', 1, '${JSON.stringify(data)}') 
    ON CONFLICT (saved_tracks_id) 
    DO UPDATE SET saved_tracks_play_count = saved_tracks.saved_tracks_play_count + 1`;

    pgPool.query(savedQuery, (err, res) => {
      console.log(i);
      if (err) {
        console.log(err);
      }
    });
  }
  for (let i = 0; i < 10; i++) {
    const data = {"album":{"album_type":"compilation","artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/0LyfQWJT6nXafLPZqxe9Of"},"href":"https://api.spotify.com/v1/artists/0LyfQWJT6nXafLPZqxe9Of","id":"0LyfQWJT6nXafLPZqxe9Of","name":"Various Artists","type":"artist","uri":"spotify:artist:0LyfQWJT6nXafLPZqxe9Of"}],"available_markets":["AD","AR","AT","AU","BE","BG","BO","BR","CA","CH","CL","CO","CR","CY","CZ","DE","DK","DO","EC","EE","ES","FI","FR","GB","GR","GT","HK","HN","HU","ID","IE","IL","IS","IT","JP","LI","LT","LU","LV","MC","MT","MX","MY","NI","NL","NO","NZ","PA","PE","PH","PL","PT","PY","RO","SE","SG","SK","SV","TH","TR","TW","US","UY","VN","ZA"],"external_urls":{"spotify":"https://open.spotify.com/album/5EoFzqCuihYOANw7RkWwUa"},"href":"https://api.spotify.com/v1/albums/5EoFzqCuihYOANw7RkWwUa","id":"5EoFzqCuihYOANw7RkWwUa","images":[{"height":600,"url":"https://i.scdn.co/image/84772db7e319d13fa9887f828226cb1add04ad13","width":600},{"height":300,"url":"https://i.scdn.co/image/a6caacdb2f7d4231a21f62a248428c4060a79526","width":300},{"height":64,"url":"https://i.scdn.co/image/0749511db491646e1eb54ac3af4401350b07d237","width":64}],"name":"New Blood Of Bass, Vol. 4","release_date":"2013-09-09","release_date_precision":"day","total_tracks":20,"type":"album","uri":"spotify:album:5EoFzqCuihYOANw7RkWwUa"},"artists":[{"external_urls":{"spotify":"https://open.spotify.com/artist/5FODVnlBocGxKKHstECQxA"},"href":"https://api.spotify.com/v1/artists/5FODVnlBocGxKKHstECQxA","id":"5FODVnlBocGxKKHstECQxA","name":"David Quinn","type":"artist","uri":"spotify:artist:5FODVnlBocGxKKHstECQxA"}],"available_markets":["AD","AR","AT","AU","BE","BG","BO","BR","CA","CH","CL","CO","CR","CY","CZ","DE","DK","DO","EC","EE","ES","FI","FR","GB","GR","GT","HK","HN","HU","ID","IE","IL","IS","IT","JP","LI","LT","LU","LV","MC","MT","MX","MY","NI","NL","NO","NZ","PA","PE","PH","PL","PT","PY","RO","SE","SG","SK","SV","TH","TR","TW","US","UY","VN","ZA"],"disc_number":1,"duration_ms":263142,"explicit":false,"external_ids":{"isrc":"QMSNZ1311879"},"external_urls":{"spotify":"https://open.spotify.com/track/1GkhxYsJvsrvE4dNkzvIC6"},"href":"https://api.spotify.com/v1/tracks/1GkhxYsJvsrvE4dNkzvIC6","id":"1GkhxYsJvsrvNkzvIC6","is_local":false,"name":"ASDF - Original Mix","popularity":10,"preview_url":"https://p.scdn.co/mp3-preview/3a9c9ab6da1f306a6e49dcde44c5251e128e5a36?cid=b5b77a9488b44e918a4989bd55b46938","track_number":1,"type":"track","uri":"spotify:track:1GkhxYsJvsrvE4dNkIC6"};
    const savedQuery = `
    INSERT INTO saved_tracks (saved_tracks_id, saved_tracks_play_count, saved_tracks_info) 
    VALUES ('${data.uri}', 1, '${JSON.stringify(data)}') 
    ON CONFLICT (saved_tracks_id) 
    DO UPDATE SET saved_tracks_play_count = saved_tracks.saved_tracks_play_count + 1`;

    pgPool.query(savedQuery, (err, res) => {
      console.log(i);
      if (err) {
        console.log(err);
      }
    });
  }
};

const update = () => {
  const updateQuery = `UPDATE saved_tracks SET saved_tracks_play_count = saved_tracks_play_count + 1`;
  pgPool.query(updateQuery, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

// `UPDATE saved_tracks_info::json SET saved_tracks_play_count = saved_tracks_play_count + 1
//  WHERE saved_tracks_info#>>'{uri}' = ${uri}`;

insertDummyData();
// update();

// SELECT saved_tracks_info::json FROM saved_tracks WHERE saved_tracks_info->>'hello' = '3';
// SELECT saved_tracks_info::json FROM saved_tracks where saved_tracks_info#>>'{uri}' = 'spotify:track:1GkhxYsJvsrvE4dNkzvIC6';
