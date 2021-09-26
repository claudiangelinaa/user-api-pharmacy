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