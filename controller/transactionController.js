const obatJadiModel = require('../model/obatJadiModel')
// const jwt = require('../lib/jwt')

exports.selectAllTransaction = async(req,res) =>{
    transactionModel.selectAll()
    .then((result)=>{
        res.json({
            result
        })
    })
    .catch(err=>{
        res.json({
            status: 'error',
            message: 'failed to fetch data',
            error_message: err
        })
    })
}

exports.selectTransactionByUser = async(req,res) =>{
    transactionModel.selectTransactionByUser(req.params)
    .then((result)=>{
        res.json({
            result
        })
    })
    .catch(err=>{
        res.json({
            status: 'error',
            message: 'failed to fetch data',
            error_message: err
        })
    })
}