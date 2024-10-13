const jwt = require('jsonwebtoken');
const { Employee } = require('../models/employeeModel');
require('dotenv').config();

const verifyToken = (req, res, next) => {

  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWTKEY,async (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }
    const emp =await  Employee.findOne({_id:decoded._id},"Account -_id")
   req.emp= emp;
    next();
  });
};

module.exports = {verifyToken};
