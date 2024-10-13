

const express = require('express')
const { loginEmployee,loginVerify } = require('../controllers/loginController')
const {verifyAll} = require('../middleware/rbacMiddleware');
const loginRoute = express.Router()

loginRoute.post('/login', loginEmployee)
loginRoute.get("/login/verify", loginVerify)
module.exports = loginRoute 