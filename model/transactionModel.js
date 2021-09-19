const pool = require('../config/db');

exports.selectAllTransaction = (data) =>{
    return new Promise(function(resolve,reject){
        var sql = `select * from transaction`
        pool.query(sql, [data], (err,result)=>{
            console.log(err,result);
            if(err) reject(err)
            resolve(result)
        })
    })
}

exports.selectTransactionByUser = (data) =>{
    return new Promise(function(resolve,reject){
        var sql = `SELECT * FROM transaction WHERE ID=${data.id}`
        pool.query(sql, [data], (err,result)=>{
            console.log(err,result);
            if(err) reject(err)
            resolve(result)
        })
    })
}