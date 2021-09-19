const multer = require('multer');
const fs = require('fs');

exports.uploadImage = (filePath, fileName) => {
  let storage = multer.diskStorage({
    destination: function (req, file, next) {
      let path = `./images/`
      if (filePath !== undefined && filePath !== "") {
        path += filePath
        fs.mkdirSync(path, { recursive: true })
      }
      console.log("path", path)
      next(null, path)
    },
    filename: function (req, file, next) {
      if (fileName === undefined || fileName === "") {
        fileName = file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9)
      }
      console.log(file)
      next(null, fileName)
    }
  })
  
  let upload = multer({ storage: storage }).array('images', 1)

  return upload
}