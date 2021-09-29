const pool = require("../config/db");

exports.selectAll = (data) => {
  return new Promise(function (resolve, reject) {
    var sql = `select * from obat_jadi`;
    pool.query(sql, [data], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.selectByParams = (data) => {
  return new Promise(function (resolve, reject) {
    var sql = `SELECT * FROM OBAT_JADI WHERE ID=${data.id}`;
    pool.query(sql, [data], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

exports.getCategory = (data) => {
  return new Promise(function (resolve, reject) {
    var sql = `SELECT DISTINCT KATEGORI FROM OBAT_JADI`;
    pool.query(sql, [data], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};