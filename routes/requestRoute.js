const express = require("express");
const requestRoute = express.Router();
const {verifyAll} = require('../middleware/rbacMiddleware');
const { createRequest, AllRequest,updateRequestStatus ,AllRequestRaised} = require('../controllers/requestController')



requestRoute.post('/request', createRequest)
requestRoute.post('/requestList', AllRequest)
requestRoute.post('/requestRaised', AllRequestRaised)

requestRoute.post('/updateRequest', updateRequestStatus)

module.exports = requestRoute 
