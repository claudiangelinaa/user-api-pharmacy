const authModel = require("../model/authModel");
const bcrypt = require("../lib/bcrypt");
const jwt = require("../lib/jwt");
const nodemailer = require("nodemailer");
const helper = require("../helper/helper");
const pool = require("../config/db");
const platform = require("../platform");
require("dotenv").config();
// const authModel = require('../model/authModel');
// const bcrypt = require('../lib/bcrypt');
// const jwt = require('../lib/jwt')
// const helper = require('../helper/helper')

exports.register = async (req, res) => {
  let data = {
    nama: req.body.nama,
    email: req.body.email,
    password: bcrypt.Encrypt(req.body.password),
    alamat: req.body.alamat,
    nomor_telepon: req.body.nomor_telepon,
    umur: req.body.umur,
    gender: req.body.gender,
    profile_picture: req.body.profile_picture,
    role: req.body.role,
  };

// <<<<<<< feature/transaction
//   if (!helper.validateEmail(data.email)) {
//     res.json({
//       message: "Format email tidak sesuai",
//     });
//     return;
//   }

//   if (req.body.password.length < 6) {
//     res.json({
//       message: "Password minimal 6 karakter",
//     });
//     return;
//   }
// =======
    // if(!helper.validatePassword(req.body.password)){
    //     res.json({
    //         message: 'Password harus mengandung angka dan special character'
    //     })
    //     return
    // }

  if (!helper.validatePassword(req.body.password)) {
    res.json({
      message: "Password harus mengandung angka dan special character",
    });
    return;
  }

  authModel
    .register(data)
    .then((result) => {
      let tokenData = {
        id: result[1][0].id,
        role: result[1][0].role,
        nama: result[1][0].nama,
      };
      let token = jwt.Encode(tokenData);
      res.json({
        id: result[1][0].id,
        email: result[1][0].email,
        token,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "Failed to register user",
        error_message: err,
      });
    });
};

exports.login = async (req, res) => {
  // const { email } = req.body;

  // const getVerifikasi = `SELECT verifikasi FROM users WHERE email='${email}'`;

  // pool.query(getVerifikasi, (err, result) => {
  //   if (err) {
  //     res.status(400).send({ message: err });
  //   }

  //   const verifikasi = result

    let data = {
      email: req.body.email,
      password: bcrypt.Encrypt(req.body.password),
      verifikasi: result,
    };

    authModel
      .login(data)
      .then((result) => {
        console.log(data)
        let tokenData = {
          id: result[0].id,
          role: result[0].role,
        };
        let token = jwt.Encode(tokenData);
        res.json({
            id: result[1][0].id,
            nama: result[1][0].nama,
            email: result[1][0].email,
            role: result[1][0].role,
            token
        })
    })
    .catch(err=>{
        res.json({
          status: err,
          message: err,
        });
      });
  // });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const query = `select * from users where email='${email}'`;

  if (!helper.validateEmail(email)) {
    res.json({
      message: "Format email tidak sesuai",
    });
    return;
  }

  if (!email) {
    res.json({
      message: "email tidak sesuai",
    });
    return;
  }

  pool.query(query, (err, result) => {
    const tokenData = {
      id: result[0].id,
      email: result[0].email,
    };
    const token = jwt.Encodes(tokenData);

    const link = `${platform.urlConfig}/reset-password?token=${token}`;

    if (err || !result) {
      return res
        .status(400)
        .json({ error: "User with this email does not exists" });
    }
    
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let message = {
      from: "haryonovianto@gmail.com",
      to: email,
      subject: "Password Recovery",
      text: "Password Recovery",
      html: `<p>Please Kindly click this link to recover your password 
                <strong>
                <br><br>
                <a href=${link}>
                  Recover Password
                </a>
                </br></br>
                </strong>
            </p>`,
    };

    transporter.sendMail(message, (err, data) => {
      if (err) {
        return res.status(400).send({ message: err });
      } else {
        helper.tokenPasser(token);
        return res.status(200).send({ message: `Email Has been sent` });
      }
    });
  });
};

exports.resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token) {
    res.status(404).send({ message: "Token Not found" });
    return;
  }

  let tokenData = jwt.Decode(token);

  let data = {
    id: tokenData.id,
    password: bcrypt.Encrypt(password),
  };

  if (password.length < 6) {
    res.json({
      message: "Password must contain 6 character",
    });
    return;
  }

  if (!helper.validatePassword(password)) {
    res.json({
      message: "Password must contain numbers and special character",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.json({
      message: "Password not same",
    });
    return;
  }

  authModel
    .resetPassword(data)
    .then((result) => {
      res.json({
        message: "Your password has been updated successfully",
      });
    })
    .catch((err) => {
      res.json({
        status: err,
        message: "Failed to update password",
      });
    });
};

// exports.checkToken = async(req,res) =>{
//   console.log(req.headers)
//   let loginData = jwt.Decode(req.headers.authorization)

//   res.json(loginData)
    // console.log(data);
//     authModel.login(data)
//     .then((result)=>{
//         let tokenData ={
//             id: result[0].id,
//             role: result[0].role,
//             nama: result[0].nama
//         }
//             let token = jwt.Encode(tokenData)
//             res.json({
//                 id: result[0].id,
//                 nama: result[0].nama,
//                 email: result[0].email,
//                 role: result[0].role,
//                 token
//             })
//         })
//     .catch(err=>{
//         // console.log('err', err)
//         res.json({
//             status: 'error',
//             message: 'failed to login',
//             error_message: err
//         })
//     })

exports.checkToken = async(req,res) =>{
    console.log(req.headers)
    let loginData = jwt.Decode(req.headers.authorization)

    res.json(loginData)
}
