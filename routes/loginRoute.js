

const express = require('express')
const { loginEmployee } = require('../controllers/loginController')

const loginRoute = express.Router()

loginRoute.post('/login', loginEmployee)

module.exports = loginRoute 