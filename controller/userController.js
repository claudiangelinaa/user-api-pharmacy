const userModel = require('../model/userModel')
const multer = require('../lib/multer')
const jwt = require('../lib/jwt')
const image = require('../helper/image')
const { login } = require('../model/authModel')
const platform = require("../platform");

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

exports.uploadProfilePicture = async(req,res) =>{
    let loginData = jwt.Decode(req.headers.authorization)
    let fileName = image.generateImageFileName('UIMG')

    let uploadData = {
        id: loginData.id,
        filePath: `/user-profile/${loginData.id}`,
        fileName: fileName,
        fullImgUrl: `http://${platform.baseURL}:${platform.port}/images/user-profile/${loginData.id}/${fileName}`
    }
    let upload = multer.uploadImage(uploadData.filePath, fileName)

    upload(req,res, (err) =>{
        try{
            if(err) throw err

            console.log("uploadData:", uploadData)
            userModel.updateProfilePicture(uploadData)
            .then((result)=>{
                res.json({
                    status: "OK",
                    message: 'Upload successful',
                    image_url: uploadData.fullImgUrl,
                })
            })
            .catch(err=>{
                res.json({
                    status: 'error',
                    message: 'failed to upload profile picture',
                    error_message: err
                })
            })
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: 'failed to upload',
                error_message: err
            })
        }
    })
}