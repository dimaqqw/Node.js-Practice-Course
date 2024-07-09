const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')

class FileWatcher extends EventEmitter {
  constructor(directory) {
    super()
    this.directory = directory
    this.watchers = new Map()

    this.startWatching()
  }

  startWatching() {
    fs.readdir(this.directory, (err, files) => {
      if (err) throw err

      files.forEach((file) => {
        const filePath = path.join(this.directory, file)
        this.watchFile(filePath)
      })
    })

    fs.watch(this.directory, (eventType, filename) => {
      if (filename) {
        const filePath = path.join(this.directory, filename)
        if (eventType === 'rename') {
          // Check if file is added or removed
          fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
              this.emit('fileRemoved', filePath)
              this.unwatchFile(filePath)
            } else {
              this.emit('fileAdded', filePath)
              this.watchFile(filePath)
            }
          })
        }
      }
    })
  }

  watchFile(filePath) {
    if (this.watchers.has(filePath)) return

    const watcher = fs.watch(filePath, (eventType) => {
      if (eventType === 'change') {
        this.emit('fileChanged', filePath)
      }
    })

    this.watchers.set(filePath, watcher)
  }

  unwatchFile(filePath) {
    if (this.watchers.has(filePath)) {
      this.watchers.get(filePath).close()
      this.watchers.delete(filePath)
    }
  }

  close() {
    this.watchers.forEach((watcher) => watcher.close())
    this.watchers.clear()
  }
}

// Пример использования
const watcher = new FileWatcher('./watched_directory')

watcher.on('fileAdded', (filePath) => {
  console.log(`File added: ${filePath}`)
})

watcher.on('fileChanged', (filePath) => {
  console.log(`File changed: ${filePath}`)
})

watcher.on('fileRemoved', (filePath) => {
  console.log(`File removed: ${filePath}`)
})

// Закрытие watcher-а при завершении работы
process.on('SIGINT', () => {
  watcher.close()
  console.log('Watcher closed')
  process.exit()
})
