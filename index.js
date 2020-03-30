const childProcess = require('child_process')

class NodeSpotifyLinux {
  constructor(bus, params) {
    this.bus = bus
    this.serviceName = params.serviceName
    this.objectPath = params.objectPath
    this.interfaceName = params.interfaceName
  }

  _getDbusInterface() {
    return new Promise((resolve, reject) => {
      this.bus.getInterface(
        this.serviceName,
        this.objectPath,
        this.interfaceName,
        (err, busInterface) => {
          if (err) {
            reject(err)
          }

          resolve(busInterface)
        }
      )
    })
  }

  _getMetadata() {
    return new Promise(async (resolve, reject) => {
      const dbusInterface = await this._getDbusInterface()

      dbusInterface.getProperty('Metadata', (err, metadata) => {
        if (err) {
          reject(err)
        }

        resolve(metadata)
      })
    })
  }

  async getSong() {
    const metadata = await this._getMetadata()
    return metadata['xesam:title']
  }

  async getAlbum() {
    const metadata = await this._getMetadata()
    return metadata['xesam:album']
  }

  async getArtist() {
    const metadata = await this._getMetadata()
    const [artist] = metadata['xesam:artist']
    return artist
  }
}

class NodeSpotifyDarwin {
  _runChildProcessAsync(command) {
    return new Promise((resolve, reject) => {
      childProcess.exec(command, (err, stdout) => {
        if (err) {
          reject(err)
        }

        resolve(stdout)
      })
    })
  }

  async getSong() {
    const command =
      "osascript -e 'tell application \"Spotify\" to name of current track as string'"
    const result = await this._runChildProcessAsync(command)
    return result
  }

  async getAlbum() {
    const command =
      "osascript -e 'tell application \"Spotify\" to album of current track as string'"
    const result = await this._runChildProcessAsync(command)
    return result
  }

  async getArtist() {
    const command =
      "osascript -e 'tell application \"Spotify\" to artist of current track as string'"
    const result = await this._runChildProcessAsync(command)
    return result
  }
}

class NodeSpotifyFactory {
  static create() {
    if (process.platform === 'linux') {
      const DBus = require('dbus')
      const bus = DBus.getBus('session')

      const serviceName = 'org.mpris.MediaPlayer2.spotify'
      const objectPath = '/org/mpris/MediaPlayer2'
      const interfaceName = 'org.mpris.MediaPlayer2.Player'

      return new NodeSpotifyLinux(bus, {
        serviceName,
        objectPath,
        interfaceName
      })
    }

    return new NodeSpotifyDarwin()
  }
}

module.exports = NodeSpotifyFactory.create()

