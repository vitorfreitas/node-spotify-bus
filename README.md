# Node Spotify Bus

Check the current status of the song playing on Spotify on your computer

## Dependencies

* [libdbus-1-dev](https://packages.ubuntu.com/xenial/libdbus-1-dev) (Ubuntu
  based systems)
* [libglib2.0-dev](https://packages.ubuntu.com/xenial/libglib2.0-dev) (Ubuntu
  based systems)

> You can find these dependencies for you OS or Linux distro as well.

## Instalation

`npm i node-spotify-bus`

## Usage

```js
const nodeSpotify = require('node-spotify')
// import nodeSpotify from 'node-spotify'

// Get the current playing song
nodeSpotify.getSong().then(song => console.log(song))

// Get the current playing artist
nodeSpotify.getArtist().then(artist => console.log(artist))

// Get the current playing album
nodeSpotify.getAlbum().then(album => console.log(album))
```


## LICENSE

[MIT](https://github.com/vitorfreitas/node-spotify-status/blob/master/LICENSE)
