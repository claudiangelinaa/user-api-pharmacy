const pool = require('../config/db');

exports.selectAll = (data) =>{
    return new Promise(function(resolve,reject){
        var sql = `select * from users`
        pool.query(sql, [data], (err,result)=>{
            console.log(err,result);
            if(err) reject(err)
            resolve(result)
        })
    })
}

exports.selectByParams = (data) =>{
    return new Promise(function(resolve,reject){
        var sql = `SELECT * FROM USERS WHERE ID=${data.id}`
        pool.query(sql, [data], (err,result)=>{
            console.log(err,result);
            if(err) reject(err)
            resolve(result)
        })
    })
}