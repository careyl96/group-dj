# Group DJ
> DJ with friends virtually, listening to music together in real time (Spotify Premium required).

Group DJ is a personal project to make listening to music together with friends in real time over the internet possible. Unlike other DJing apps, each user has full user control over the player, meaning that performing actions that would affect the playback for one person, such as pausing or resuming the player, will affect the playback of everyone connected.

Group DJ features a fully fleshed out playing bar, allowing the user to pause, play, skip tracks, return to previous tracks, and even seek to different locations in the track while remaining in sync with other connected users. Should the player be desynced due to connection issues or a local playback change (eg a change on the spotify app and not the web app), a click of the resync button to the left of the progress bar will get you reconnected with everyone else. 

## Development setup

1. Create an application on [Spotify's Developer Site](https://developer.spotify.com/my-applications/).

2. Add http://localhost:3006/auth/callback as a redirect URI

3. Rename auth/config-example.js to auth/config.js

4. Set your HOST in auth/config.js.

5. Set your CLIENT_ID and CLIENT_SECRET in auth/config.js.

```sh
npm install
npm run build && npm start
```

## Version History

* 1.0.0
    * First version released!
