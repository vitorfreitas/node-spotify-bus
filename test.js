const test = require('ava')
const sinon = require('sinon')
const os = require('os')

function deleteCache() {
  delete require.cache[require.resolve('./index')];
}

test('return an instance of NodeSpotifyLinux', t => {
  deleteCache()
  sinon.stub(os, 'platform').returns('linux')

  const nodeSpotifyBus = require('./index')

  t.is(nodeSpotifyBus.constructor.name, 'NodeSpotifyLinux')
  os.platform.restore()
})

test('return an instance of NodeSpotifyDarwin', t => {
  deleteCache()
  sinon.stub(os, 'platform').returns('darwin')

  const nodeSpotifyBus = require('./index')

  t.is(nodeSpotifyBus.constructor.name, 'NodeSpotifyDarwin')
  os.platform.restore()
})

test('return the current song on linux', async t => {
  deleteCache()
  const nodeSpotifyBus = require('./index')
  const songMetadataStub = sinon.stub().returns({
    'xesam:title': 'song name'
  })
  nodeSpotifyBus['_getMetadata'] = songMetadataStub

  const result = await nodeSpotifyBus.getSong()

  t.is(result, 'song name')
})

test('return the current artist on linux', async t => {
  deleteCache()
  const nodeSpotifyBus = require('./index')
  const artistMetadataStub = sinon.stub().returns({
    'xesam:artist': ['artist name']
  })
  nodeSpotifyBus['_getMetadata'] = artistMetadataStub

  const result = await nodeSpotifyBus.getArtist()

  t.is(result, 'artist name')
})

test('return the current album on linux', async t => {
  deleteCache()
  const nodeSpotifyBus = require('./index')
  const albumMetadataStub = sinon.stub().returns({
    'xesam:album': 'album name'
  })
  nodeSpotifyBus['_getMetadata'] = albumMetadataStub

  const result = await nodeSpotifyBus.getAlbum()

  t.is(result, 'album name')
})
