const pool = require('../config/db');

exports.insertObatRacikTransaction = (data) =>{
  return new Promise(function(resolve,reject){
    var sql = `INSERT INTO transaksi SET ?`
    pool.query(sql, [data], (err,result)=>{
      console.log(result);
      if(err) {
        console.log(err)
        reject(err)
      }
      resolve(result)
    })
  })
}

exports.updateBuktiBayar = (data) =>{
  return new Promise(function(resolve,reject){
    var sql = `UPDATE transaksi SET bukti_bayar_image = ?, status = 4 WHERE ID=${data.transactionId}`
    pool.query(sql, data.fullImgUrl, (err, result)=>{
      console.log(err,result)
      if(err) reject(err)
      resolve(result)
    })
  })
}