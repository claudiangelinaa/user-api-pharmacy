const authModel = require("../model/authModel");
const bcrypt = require("../lib/bcrypt");
const jwt = require("../lib/jwt");
const nodemailer = require("nodemailer");
const helper = require("../helper/helper");
const pool = require("../config/db");
const platform = require("../platform");
require("dotenv").config();

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
    res.status(400).json({
      error_message: "Password harus mengandung angka dan special character",
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
        nama: result[1][0].nama,
        role: result[1][0].role,
        token,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "error",
        message: "Failed to register user",
        error_message: err,
      });
    });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const getEmail = `SELECT * FROM users WHERE email='${email}'`;
  const getVerifikasi = `SELECT verifikasi FROM users WHERE email='${email}'`;

  pool.query(getEmail, (err, result) => {
    if (err) {
      alert(err);
    }

    console.log(result);

    if (result.length === 0) {
      res.json({
        errors: "Email doesn't exist",
      });
      return;
    }

    pool.query(getVerifikasi, (err, result) => {
      if (err) {
        res.status(400).send({ message: err });
      }

      const verifikasi = result[0].verifikasi;

      if (!verifikasi) {
        res.json({
          error: "You Have to create your account first",
        });
        return;
      }

      if (verifikasi == 0) {
        res.json({
          error: "You Have to verify your account first before you can login",
        });
        return;
      }

      let data = {
        email: req.body.email,
        password: bcrypt.Encrypt(req.body.password),
        verifikasi: verifikasi,
      };

      authModel
        .login(data)
        .then((result) => {
          let tokenData = {
            id: result[0].id,
            role: result[0].role,
            nama: result[0].nama,
            email: result[0].email,
          };
          let token = jwt.Encode(tokenData);
          res.json({
            id: result[0].id,
            nama: result[0].nama,
            email: result[0].email,
            role: result[0].role,
            token,
          });
        })
        .catch((err) => {
          res.json({
            status: err,
            message: err,
          });
// =======
    })
//     .catch(err=>{
//         res.status(500).json({
//           status: err,
//           message: err,
// >>>>>>> development
        });
    });
  });
};

exports.verifyAccount = async (req, res) => {
  const { email } = req.body;
  const query = `select * from users where email='${email}'`;

  if (!helper.validateEmail(email)) {
    res.json({ error: "Make sure you entry an email format" });
    return;
  }

  if (!email) {
    res.json({ error: "You have to input email first" });
    return;
  }

  pool.query(query, (err, result) => {
    const tokenData = {
      id: result[0].id,
      email: result[0].email,
    };
    const token = jwt.Encodes(tokenData);

    const link = `${platform.urlConfig}/verify-account?token=${token}`;

    if (err || !result) {
      return res.json({ error: "User with this email does not exists" });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let message = {
      from: "Auth@mail.com",
      to: email,
      subject: "Verify Account",
      text: "Verify Account",
      html: `<p>Please Kindly click this link to verify your Account
                <strong>
                <br><br>
                <a href=${link}>
                  Verify Account
                </a>
                </br></br>
                </strong>
            </p>`,
    };

    transporter.sendMail(message, (err, data) => {
      if (err) {
        return res.status(400).send({ message: err });
      } else {
        return res.status(200).send({ message: `Email Has been sent` });
      }
    });
  });
};

exports.verification = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token) {
    res.status(404).send({ message: "Token Not found" });
    return;
  }

  if (password.length < 6) {
    res.json({ error: "Password must contain 6 character" });
    return;
  }

  if (!helper.validatePassword(password)) {
    res.json({ error: "Password must contain numbers and special character" });
    return;
  }

  if (password !== confirmPassword) {
    res.json({ error: "Password not same" });
    return;
  }

  let tokenData = jwt.Decode(token);

  let data = {
    id: tokenData.id,
    password: bcrypt.Encrypt(password),
  };

  const showDataUser = `select * from users where id=${data.id}`;

  pool.query(showDataUser, (err, result) => {
    const passwordUser = result[0].password;

    if (err) {
      res.status(500).send(err);
    }

    if (!bcrypt.comparePassword(password, passwordUser)) {
      res.json({ error: "Password for this account doesn't match" });
      return;
    } else {
      const updateVerifikasi = `update users set verifikasi=1 where id='${data.id}'`;

      pool.query(updateVerifikasi, (err, result) => {
        if (err) {
          res.status(500).send({ message: err });
        }

        res.status(200).send({ message: result });
      });
    }
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const query = `select * from users where email='${email}'`;

  if (!helper.validateEmail(email)) {
    res.json({ error: "Make sure you entry an email format" });
    return;
  }

  if (!email) {
    res.json({ error: "You have to input email first" });
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
      return res.json({ error: "User with this email does not exists" });
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    let message = {
      from: "Auth@mail.com",
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
        return res.json({ error: err });
      } else {
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

  if (password.length < 6) {
    res.json({ error: "Password must contain 6 character" });
    return;
  }

  if (!helper.validatePassword(password)) {
    res.json({ error: "Password must contain numbers and special character" });
    return;
  }

  if (password !== confirmPassword) {
    res.json({ error: "Password not same" });
    return;
  }

  let tokenData = jwt.Decode(token);

  let data = {
    id: tokenData.id,
    password: bcrypt.Encrypt(password),
  };

  const updatePassword = `update users set password = '${data.password}' where id='${data.id}'`;

  pool.query(updatePassword, (err, result) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    res.status(200).send({ message: "Password succesfully updated" });
  });
};

exports.checkToken = async (req, res) => {
  // console.log(req.headers)
  let loginData = jwt.Decode(req.headers.authorization);
  // console.log(loginData)
  res.json(loginData);
};
