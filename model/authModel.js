const pool = require("../config/db");

exports.register = (data) => {
  return new Promise(function (resolve, reject) {
    var sql = `insert into users set ? ; select * from users where email='${data.email}' and password='${data.password}'`;
    pool.query(sql, [data], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.login = (data) => {
  return new Promise(function (resolve, reject) {
    var sql = `select * from users where email='${data.email}' and password='${data.password}'`;
    pool.query(sql, (err, result) => {
      // console.log(err, result)
      if (err) reject(err);
      resolve(result);
    });
  });
  
};

exports.resetPassword = (data) => {
  return new Promise(function (resolve, reject) {
    var sql = `update users set password = '${data.password}' where id='${data.id}'`;
    pool.query(sql, [data], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
