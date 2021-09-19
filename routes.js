const express = require('express');
const router = express.Router();

const obatJadiController = require('./controller/obatJadiController')
const authController = require('./controller/authController')
const userController = require('./controller/userController')

const multerLib = require('./lib/multer')

router.get('/obatjadi', obatJadiController.selectAll)
router.get('/obatjadi/:id', obatJadiController.selectByParams)

router.post('/users/register', authController.register)
router.post('/users/login', authController.login)
router.get('/users/check-token', authController.checkToken)
router.get('/users', userController.selectAll)
router.get('/users/:id', userController.selectByParams)
router.post('/users/profile-picture', userController.uploadProfilePicture)
router.post('/users/:id', userController.update)


router.post('/test-upload', (req, res) => {
  let upload = multerLib.uploadImage("", 'asdasd')

  upload(req, res, (err) => {
    try {
      if(err) throw err

      res.status(200).send({
        error: false,
        title: 'Upload Success'
      })
    } catch (err) {
      res.status(500).send({
        error: true,
        title: 'Error Multer',
        message: err.message
      })
    }
  })
 })


module.exports = router;