const { Employee } = require("../models/employeeModel");
const otpModule = require("../models/otpModel");
const SendMails = require("../sendMail/sendMail");
const bcrypt = require("bcrypt");
const SALT_FECTOUR = 10;

require("dotenv").config();

// forget password
const emailVerify = async (req, res) => {
  const { email } = req.body;
  // console.log(email)
  const findemail = await Employee.findOne({ Email: email });

  try {
    if (!findemail) {
      // res.status(400).send("Enter valid email id")
      return res.status(401).json({
        message: "Enter valid email id",
      });
    } else {
      return res.status(200).json({
        message: "ok",
        user: findemail,
      });
    }
  } catch {
    return res.status(403).json({
      message: "your requist is faild",
    });
  }
};

// verify otp
const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const findnum = await otpModule.findOne({ otp: otp });
    const id = findnum._id;

    if (findnum) {
      await otpModule.findByIdAndDelete(id);
      res.status(200).json({
        message: "ok",
      });
    } else {
      res.status(401).json({
        message: "enter valid num",
      });
    }
  } catch {
    res.status(403).json({
      message: "your requist is faild",
    });
  }
};

// send otp
const sendOtp = async (req, res) => {
  const id = req.params.id;

  const otp = { userId: id, otp: Math.floor(Math.random() * 9000) + 1000 };
  const find = await Employee.findOne({ _id: id });
  const findOtp = await otpModule.findOne({ userId: id });
  const newOtp = otpModule(otp);
  let { _id } = newOtp;

  try {
    let day = new Date();
    let secound = day.getSeconds() + 60;
    if (findOtp) {
      await otpModule.findByIdAndUpdate(findOtp._id, otp);
      res.status(200).json({
        message: "ok",
        time: secound,
      });
    } else {
      await newOtp.save();
      res.status(201).json({
        message: "ok",
        time: secound,
      });
      SendMails(otp.otp.toString(), find.Email);
      deleteOtp(_id);
    }
  } catch {
    res.send("otp requst is faild");
  }
};

// delete otp in database
const deleteOtp = async (id) => {
  let time = 60;
  setInterval(async () => {
    if (time <= 0) {
    } else {
      time = time - 1;
    }
    if (time === 0) {
      try {
        await otpModule.findByIdAndDelete(id);
      } catch {
        console.log("faild this api");
      }
    }
  }, 1000);
};

// forget password
const forgetUserPass = async (req, res) => {
  let { pass } = req.body;
  const id = req.params.id;
  try {
    await bcrypt.hash(pass, SALT_FECTOUR, async (err, hash) => {
      if (err) {
        return res.status(400).send("password is note secure");
      } else {
        const update = await Employee.findByIdAndUpdate(
          id,
          { Password: hash },
          { new: true }
        );

        res.status(200).json({
          message: "password is updated",
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      message: "Password forget request is faild",
    });
  }
};

module.exports = {
  emailVerify,
  verifyOtp,
  sendOtp,
  forgetUserPass,
};
