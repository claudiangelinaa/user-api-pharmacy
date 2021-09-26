const pool = require("../config/db");
const obatJadiModel = require("../model/obatJadiModel");
const platform = require("../platform");
const jwt = require('../lib/jwt')
const image = require('../helper/image')
const multer = require('../lib/multer')
const transactionModel = require("../model/transactionModel");

// exports.selectAllTransaction = async(req,res) =>{
//     transactionModel.selectAll()
//     .then((result)=>{
//         res.json({
//             result
//         })
//     })
//     .catch(err=>{
//         res.json({
//             status: 'error',
//             message: 'failed to fetch data',
//             error_message: err
//         })
//     })
// }

exports.selectTransactionByUser = async (req, res) => {
  const { id } = req.params;

  const showTransaction = `SELECT
        transaksi.id,
        users.nama,
        obat_jadi.nama,
        transaksi_obat_jadi.quantity,
        transaksi.tanggal,
        transaksi.total,
        transaksi.status
          FROM transaksi 
            JOIN users
              ON transaksi.user_id = users.id 
            JOIN transaksi_obat_jadi
              ON transaksi.id = transaksi_obat_jadi.transaksi_id
            JOIN obat_jadi
              ON obat_jadi.id = transaksi_obat_jadi.obat_jadi_id
                    WHERE users.id = ${id}`;

  pool.query(showTransaction, (err, result) => {
    if (err) {
      res.status(400).send({ message: err });
    }

    res.status(200).send({ result: result });
  });
};

exports.insertTransaction = async (req, res) => {
  const { total, alamat, user_id, quantity, obat_jadi_id } = req.body;

  const insertTransaksi = `INSERT INTO transaksi (total, alamat, user_id) VALUES (${total},'${alamat}',${user_id})`;

  const showTransaksi = `SELECT id from transaksi where user_id=${user_id} order by user_id LIMIT 1 `;

  pool.query(
    insertTransaksi,
    (err, result) => {

      try {
        if (err) {
          throw err;
        }

      if (err) {
        res.status(400).send({ message: "Transaction cannot be processed" });
        return;
      }

      const id = result.insertId;

      for (let i = 0; i < obat_jadi_id.length; i++) {
        const insertObat = `INSERT INTO transaksi_obat_jadi (obat_jadi_id, transaksi_id, quantity) VALUES (${obat_jadi_id[i]},${id},${quantity[i]})`;
        pool.query(insertObat, (err, result) => {
          if (err) {
            res.status(400).send({ message: err });
            return;
          }

          // res.status(200).send({ message: "Insert Successful" });
        });
      }

      res.status(200).send({ message: "Transaction Successfully Processed" });

      // pool.query(showTransaksi, (err, result) => {
      //   if (err) {
      //     res.status(400).send({ message: err });
      //   }
      // });
    }
    catch (err) {
      console.log(err);
    }}
  );
};

exports.insertObatRacikTransaction = async (req, res) => {
  let loginData = jwt.Decode(req.headers.authorization)
  
  let fileName = image.generateImageFileName('RECEIPT_IMG')
  let filePath = `/receipt/${loginData.id}`
  
  let uploadData = {
    id: loginData.id,
    filePath: filePath,
    fileName: fileName,
    fullImgUrl: `http://${platform.baseURL}:${platform.port}/images${filePath}/${fileName}`,
  }
  console.log("obatraciktx:", uploadData)

  let upload = multer.uploadImage(uploadData.filePath, fileName)
  upload(req,res, (err) =>{
    try{
      if(err) throw err

      transactionModel.insertObatRacikTransaction({
        user_id: uploadData.id,
        alamat: req.body.alamat,
        resep_image: uploadData.fullImgUrl
      })
      .then((result) => {
        console.log(result.data)
        res.json({
          status: "OK",
          message: 'Upload successful',
          image_url: uploadData.fullImgUrl,
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          status: 'error',
          message: 'failed to insert to db',
          error_message: err
        })
      })

    } catch(err) {
      res.status(500).json({
        status: 'error',
        message: 'failed to upload',
        error_message: err
      })
    }
  })
}

exports.uploadBuktiBayar = async (req, res) => {
  const loginData = jwt.Decode(req.headers.authorization)

  let fileName = image.generateImageFileName('PAYMENT_IMG')
  let filePath = `/payment/${loginData.id}/${req.params.transactionId}`
  
  let uploadData = {
    id: loginData.id,
    filePath: filePath,
    fileName: fileName,
    fullImgUrl: `http://${platform.baseURL}:${platform.port}/images${filePath}/${fileName}`,
    transactionId: req.params.transactionId
  }

  console.log(uploadData)

  let upload = multer.uploadImage(uploadData.filePath, fileName)
  upload(req,res, (err) =>{
    try{
      if(err) throw err

      transactionModel.updateBuktiBayar(uploadData)
      .then((result) => {
        console.log(result.data)
        res.json({
          status: "OK",
          message: 'Upload successful',
          image_url: uploadData.fullImgUrl,
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          status: 'error',
          message: 'failed to insert to db',
          error_message: err
        })
      })

    } catch(err) {
      res.status(500).json({
        status: 'error',
        message: 'failed to upload',
        error_message: err
      })
    }
  })
}