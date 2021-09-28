const pool = require("../config/db");
const obatJadiModel = require("../model/obatJadiModel");

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

  pool.query(insertTransaksi, (err, result) => {
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
        const showQuantity = `SELECT stock from obat_jadi where id=${obat_jadi_id[i]}`;

        pool.query(showQuantity, (err, result) => {
          if (err) {
            res.status(400).send(err);
            return;
          }
          const data = result[0].stock;

          const qty = data - quantity[i];

          const updateQuantity = `UPDATE obat_jadi SET stock=${qty} WHERE id=${obat_jadi_id[i]}`;

          pool.query(updateQuantity, (err, result) => {
            if (err) {
              res.status(400).send(err);
              return;
            }

            pool.query(insertObat, (err, result) => {
              if (err) {
                res.status(400).send({ message: err });
                return;
              }
            });
          });
        });
      }
      res.status(200).send({ message: "Transaction Successfully Processed" });
    } catch (err) {
      console.log(err);
    }
  });
};
