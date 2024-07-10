const { Transform } = require('stream')

class UpperCaseTransform extends Transform {
  constructor(options) {
    super(options)
  }

  _transform(chunk, encoding, callback) {
    const upperCaseChunk = chunk.toString().toUpperCase()
    this.push(upperCaseChunk)
    callback()
  }
}

const { Readable, Writable } = require('stream')

// Создаем поток чтения
const readableStream = new Readable({
  read() {
    this.push('hello ')
    this.push('world')
    this.push(null)
  },
})

// Создаем поток записи
const writableStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString())
    callback()
  },
})

const upperCaseTransform = new UpperCaseTransform()

readableStream.pipe(upperCaseTransform).pipe(writableStream)
