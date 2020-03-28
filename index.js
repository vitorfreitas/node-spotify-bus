const DBus = require('dbus')

class NodeSpotify {
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

class NodeSpotifyFactory {
  static create() {
    const bus = DBus.getBus('session')

    const serviceName = 'org.mpris.MediaPlayer2.spotify'
    const objectPath = '/org/mpris/MediaPlayer2'
    const interfaceName = 'org.mpris.MediaPlayer2.Player'

    return new NodeSpotify(bus, {
      serviceName,
      objectPath,
      interfaceName
    })
  }
}

module.exports = {
  NodeSpotifyFactory
}
