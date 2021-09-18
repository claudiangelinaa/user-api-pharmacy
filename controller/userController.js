const userModel = require('../model/userModel')
// const jwt = require('../lib/jwt')

exports.selectAll = async(req,res) =>{
    userModel.selectAll()
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

exports.selectByParams = async(req,res) =>{
    userModel.selectByParams(req.params)
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

exports.update = async(req,res) =>{
    let updatedData = {
        id: req.params.id,
        nama: req.body.nama,
        email: req.body.email,
        alamat: req.body.alamat,
        nomor_telepon: req.body.nomor_telepon,
        umur: req.body.umur,
        gender: req.body.gender
    }
    userModel.update(updatedData)
    .then((result)=>{
        res.json({
            nama: req.body.nama,
            email: req.body.email,
            alamat: req.body.alamat,
            nomor_telepon: req.body.nomor_telepon,
            umur: req.body.umur,
            gender: req.body.gender
        })
    })
    .catch(err=>{
        res.json({
            status: 'error',
            message: 'failed to update data',
            error_message: err
        })
    })
}