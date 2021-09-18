const authModel = require('../model/authModel');
const bcrypt = require('../lib/bcrypt');
const jwt = require('../lib/jwt')
const helper = require('../helper/helper')

exports.register = async(req,res) =>{
    let data ={
        nama: req.body.nama,
        email: req.body.email,
        password: bcrypt.Encrypt(req.body.password),
        alamat: req.body.alamat,
        nomor_telepon : req.body.nomor_telepon,
        umur: req.body.umur,
        gender: req.body.gender,
        profile_picture: req.body.profile_picture,
        // role: req.body.role        
    }

    if(!helper.validateEmail(data.email)){
        res.json({
            message: 'Format email tidak sesuai'
        })
        return
    }
    
    if(req.body.password.length<6){
        res.json({
            message: 'Password minimal 6 karakter'
        })
        return
    }

    // if(!helper.validatePassword(req.body.password)){
    //     res.json({
    //         message: 'Password harus mengandung angka dan special character'
    //     })
    //     return
    // }

    authModel.register(data)
    .then((result)=>{
        console.log(result);
        let tokenData = {
            id: result[1][0].id,
            role: result[1][0].role
        }
        let token = jwt.Encode(tokenData)
        res.json({
            id: result[1][0].id,
            email: result[1][0].email,
            token
        })
    })
    .catch(err=>{
        res.json({
            status: 'error',
            message: 'Failed to register user',
            error_message: err
        })
    })
}

exports.login = async(req,res) =>{
    let data = {
        email: req.body.email,
        password: bcrypt.Encrypt(req.body.password)
    }
    // console.log(data);
    authModel.login(data)
    .then((result)=>{
        let tokenData ={
            id: result[0].id,
            role: result[0].role,
            nama: result[0].nama
        }
            let token = jwt.Encode(tokenData)
            res.json({
                id: result[0].id,
                nama: result[0].nama,
                email: result[0].email,
                role: result[0].role,
                token
            })
        })
    .catch(err=>{
        // console.log('err', err)
        res.json({
            status: 'error',
            message: 'failed to login',
            error_message: err
        })
    })
}

exports.checkToken = async(req,res) =>{
    console.log(req.headers)
    let loginData = jwt.Decode(req.headers.authorization)

    res.json(loginData)
}