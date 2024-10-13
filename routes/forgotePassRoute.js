const express = require('express')
const {verifyAll} = require('../middleware/rbacMiddleware');

const { emailVerify, verifyOtp, sendOtp, forgetUserPass } = require('../controllers/forgotPass')

const forgotePassRoute = express.Router()

forgotePassRoute.post('/verfy_email', emailVerify)
forgotePassRoute.post('/verfy_otp',verifyOtp)
forgotePassRoute.post('/send_otp/:id', sendOtp)
forgotePassRoute.post('/forgot_pass/:id',forgetUserPass)

module.exports = {
    forgotePassRoute
}