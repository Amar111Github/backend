const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { Employee } = require("../models/employeeModel");
const bcrypt = require("bcrypt");
require("dotenv").config();

let jwtKey = process.env.JWTKEY;
const SALT_FECTOUR = 10;

const loginEmployee = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find employee by email
    console.log("employee ===", email);
    const employee = await Employee.findOne({
      $or: [{ Email: email }, { ContactNo: email }, { empID: email }],
    });
    console.log("employee ===========", employee);
    if (!employee) {
      return res.status(404).send("Employee not found.");
    } else {
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, employee.Password);
      if (!passwordMatch) {
        console.log("pass ==== ----------");
        return res.status(400).send("Invalid password.");
      }
      // Generate JWT token
      const token = jwt.sign(
        {
          _id: employee._id,
          Account: employee.Account,
          FirstName: employee.FirstName,
          LastName: employee.LastName,
        },
        jwtKey
      );

      // Send token as response
      res.send(token);
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  loginEmployee,
};
