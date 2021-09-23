const jwt = require('../lib/jwt');

exports.authUser = (req) => {
  console.log(req)
  if(req.headers.authorization === undefined || req.headers.authorization === "") {
    return ""
  }

  return jwt.Decode(req.headers.authorization)
}