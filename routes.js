const express = require("express");
// const multerLib = require('./lib/multer')
const router = express.Router();
// const multerLib = require('./lib/multer')
const obatJadiController = require("./controller/obatJadiController");
const authController = require("./controller/authController");
const transactionController = require("./controller/transactionController");
const userController = require('./controller/userController')

router.get("/obatjadi", obatJadiController.selectAll);
router.get("/obatjadi/:id", obatJadiController.selectByParams);


router.get('/users/check-token', authController.checkToken)
router.get('/users', userController.selectAll)
router.get('/users/:id', userController.selectByParams)
router.post('/users/profile-picture', userController.uploadProfilePicture)
router.post("/users/register", authController.register);
router.post("/users/login", authController.login);
router.post("/users/forgot-password", authController.forgotPassword);
router.post("/users/reset-password", authController.resetPassword);
router.post("/users/verify-account", authController.verifyAccount);
router.post("/users/verification", authController.verification);
router.post('/users/:id', userController.update)

router.get('/users/check-token', authController.checkToken)
router.get('/users', userController.selectAll)
router.get('/users/:id', userController.selectByParams)
router.post('/users/profile-picture', userController.uploadProfilePicture)
router.post('/users/:id', userController.update)
router.get("/getTransaction/:id", transactionController.selectTransactionByUser);
router.post("/insertTransaction", transactionController.insertTransaction);

router.use("/images", express.static("images"))

// router.post('/test-upload', (req, res) => {
//   let upload = multerLib.uploadImage("", 'asdasd')

//   upload(req, res, (err) => {
//     try {
//       if(err) throw err

//       res.status(200).send({
//         error: false,
//         title: 'Upload Success'
//       })
//     } catch (err) {
//       res.status(500).send({
//         error: true,
//         title: 'Error Multer',
//         message: err.message
//       })
//     }
//   })
//  })

module.exports = router;
