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

exports.update = (data) =>{
    return new Promise(function(resolve,reject){
        var sql = `UPDATE users SET? WHERE ID= ${data.id}`
        pool.query(sql, [data], (err,result)=>{
            console.log(err,result);
            if(err) reject(err)
            resolve(result)
        })
    })
}

exports.updateProfilePicture = (data) =>{
    return new Promise(function(resolve,reject){
        console.log("data:", data)
        var sql = `UPDATE users SET profile_picture= ? WHERE ID=${data.id}`
        pool.query(sql, data.filePath + data.fileName, (err,result)=>{
            console.log(err,result)
            if(err) reject(err)
            resolve(result)
        })
    })
}