const obatJadiModel = require("../model/obatJadiModel");
// const jwt = require('../lib/jwt')

exports.selectAll = async (req, res) => {
  obatJadiModel
    .selectAll()
    .then((result) => {
      res.json({
        result,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "failed to fetch data",
        error_message: err,
      });
    });
};

exports.selectByParams = async (req, res) => {
  obatJadiModel
    .selectByParams(req.params)
    .then((result) => {
      res.json({
        result,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "failed to fetch data",
        error_message: err,
      });
    });
};

exports.getCategory = async (req, res) => {
  obatJadiModel
    .getCategory()
    .then((result) => {
      console.log(result);

      let data = []
      result.map((value)=>{
        console.log("value:" , value, value.KATEGORI);

        data.push(value.KATEGORI)
      })
      console.log(data);
      res.json({
        data,
      });
    })
    .catch((err) => {
      res.json({
        status: "error",
        message: "failed to fetch data",
        error_message: err,
      });
    });
};