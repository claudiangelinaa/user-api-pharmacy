exports.generateImageFileName = (filePrefix, fileSuffix) => {
  if (fileSuffix === undefined || fileSuffix === "") {
    fileSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  }

  return filePrefix + '-' + fileSuffix
}