const express = require('express');
const router = express.Router();

const obatJadiController = require('./controller/obatJadiController')
const authController = require('./controller/authController')

router.get('/obatjadi', obatJadiController.selectAll)
router.get('/obatjadi/:id', obatJadiController.selectByParams)
router.post('/users/register', authController.register)
router.post('/users/login', authController.login)


module.exports = router;