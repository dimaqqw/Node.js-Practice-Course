const fs = require('fs')
const path = require('path')

const sourceDir = './source_directory'
const targetDir = './target_directory'

function moveFiles(source, target) {
  fs.readdir(source, (err, files) => {
    if (err) {
      console.error(`Ошибка чтения директории: ${err}`)
      return
    }

    files.forEach((file) => {
      const sourceFile = path.join(source, file)
      const targetFile = path.join(target, file)

      fs.rename(sourceFile, targetFile, (err) => {
        if (err) {
          console.error(`Ошибка перемещения файла ${file}: ${err}`)
          return
        }

        console.log(`Файл ${file} успешно перемещен`)
      })
    })
  })
}

fs.access(targetDir, fs.constants.F_OK, (err) => {
  if (err) {
    fs.mkdir(targetDir, { recursive: true }, (err) => {
      if (err) {
        console.error(`Ошибка создания директории: ${err}`)
        return
      }
      moveFiles(sourceDir, targetDir)
    })
  } else {
    moveFiles(sourceDir, targetDir)
  }
})
