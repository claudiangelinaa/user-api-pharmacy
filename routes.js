const express = require('express');
const router = express.Router();

const obatJadiController = require('./controller/obatJadiController')
const authController = require('./controller/authController')
const userController = require('./controller/userController')

router.get('/obatjadi', obatJadiController.selectAll)
router.get('/obatjadi/:id', obatJadiController.selectByParams)
router.post('/users/register', authController.register)
router.post('/users/login', authController.login)
router.get('/users/check-token', authController.checkToken)
router.get('/users', userController.selectAll)
router.get('/users/:id', userController.selectByParams)


module.exports = router;