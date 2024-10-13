// const { TotalLeave } = require('../models/totalLeave');
// const express = require('express');
// const { Employee } = require("../models/employeeModel");

// const assignLeave = async (req, res, next) => {
//     try {
//         const { employees, sickLeave, paidLeave, casualLeave, paternityLeave, maternityLeave } = req.body;

//         const numericSickLeave = parseInt(sickLeave || 0);
//         const numericPaidLeave = parseInt(paidLeave || 0);
//         const numericCasualLeave = parseInt(casualLeave || 0);
//         const numericPaternityLeave = parseInt(paternityLeave || 0);
//         const numericMaternityLeave = parseInt(maternityLeave || 0);

//         for (const employee of employees) {
//             const { value: empID } = employee;

//             if (!isNaN(numericSickLeave) && !isNaN(numericPaidLeave) && !isNaN(numericCasualLeave) && !isNaN(numericPaternityLeave) && !isNaN(numericMaternityLeave)) {
//                 let totalLeave = await TotalLeave.findOne({ empID });

//                 if (!totalLeave) {
//                     totalLeave = new TotalLeave({
//                         empID,
//                         sickLeave: numericSickLeave,
//                         totalSickLeave: numericSickLeave,
//                         paidLeave: numericPaidLeave,
//                         totalPaidLeave: numericPaidLeave,
//                         casualLeave: numericCasualLeave,
//                         totalCasualLeave: numericCasualLeave,
//                         paternityLeave: numericPaternityLeave,
//                         totalPaternityLeave: numericPaternityLeave,
//                         maternityLeave: numericMaternityLeave,
//                         totalMaternityLeave: numericMaternityLeave,
//                     });
//                 } else {
//                     totalLeave.sickLeave = numericSickLeave;
//                     totalLeave.totalSickLeave = numericSickLeave;
//                     totalLeave.paidLeave += numericPaidLeave;
//                     totalLeave.totalPaidLeave += numericPaidLeave;
//                     totalLeave.casualLeave = numericCasualLeave;
//                     totalLeave.totalCasualLeave = numericCasualLeave;
//                     totalLeave.paternityLeave = numericPaternityLeave;
//                     totalLeave.totalPaternityLeave = numericPaternityLeave;
//                     totalLeave.maternityLeave = numericMaternityLeave;
//                     totalLeave.totalMaternityLeave = numericMaternityLeave;
//                 }

//                 await totalLeave.save();
//             }
//         }

//         res.status(200).json({ message: 'Leave assigned successfully' });
//     } catch (error) {
//         next(error);
//     }
// };

// // Get available leave for a specific employee by ID
// const getAvailableLeave = async (req, res, next) => {
//     try {
//         const { id } = req.body;
//         const totalLeave = await TotalLeave.findOne({ empID: id });

//         if (!totalLeave) {
//             return res.status(404).json({ error: 'Leave data not found' });
//         }

//         const { sickLeave, totalSickLeave, paidLeave, totalPaidLeave, casualLeave, totalCasualLeave, paternityLeave, totalPaternityLeave, maternityLeave, totalMaternityLeave } = totalLeave;
//         let data = [
//             { sickLeave, totalSickLeave },
//             { paidLeave, totalPaidLeave },
//             { casualLeave, totalCasualLeave },
//             { paternityLeave, totalPaternityLeave },
//             { maternityLeave, totalMaternityLeave }
//         ];

//         res.status(200).json(data);
//     } catch (error) {
//         next(error);
//     }
// };

// // Get available leave for a specific employee by email (empID)
// const getAvailableLeaveByEmail = async (req, res, next) => {
//     try {
//         const { id } = req.body;
//         const totalLeave = await TotalLeave.findOne({ empID: id });

//         if (!totalLeave) {
//             return res.status(404).json({ error: 'Leave data not found' });
//         }

//         const { sickLeave, paidLeave, casualLeave, paternityLeave, maternityLeave } = totalLeave;
//         let data = [{
//             ["Sick Leave"]: sickLeave,
//             ["Paid Leave"]: paidLeave,
//             ["Casual Leave"]: casualLeave,
//             ["Paternity Leave"]: paternityLeave,
//             ["Maternity Leave"]: maternityLeave
//         }];

//         res.status(200).json(data);
//     } catch (error) {
//         next(error);
//     }
// };

// // Get all available leave for all employees
// const getAllAvailableLeave = async (req, res, next) => {
//     try {
//         const allLeaveData = await TotalLeave.find({}).populate({
//             path: 'empID',
//             select: 'profile FirstName LastName empID Email Account'
//         });

//         const transformedData = allLeaveData.map(record => {
//             const { empID, ...leaveData } = record.toObject();
//             return {
//                 ...leaveData,
//                 profile: empID.profile,
//                 FirstName: empID.FirstName,
//                 LastName: empID.LastName,
//                 email: empID.Email,
//                 Account: empID.Account,
//                 empID: empID.empID
//             };
//         });

//         res.status(200).json(transformedData);
//     } catch (error) {
//         next(error);
//     }
// };

// // Deduct leave for an employee based on leave type
// const deductLeave = async (req, res, next) => {
//     try {
//         const { id, leaveType, totalLeaveRequired } = req.body;
//         let totalLeave = await TotalLeave.findOne({ empID: id });

//         if (!totalLeave) {
//             return res.status(404).json({ error: 'No leave record found for this employee' });
//         }

//         if (leaveType === "Sick Leave") {
//             const numericSickLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.sickLeave = Math.max(0, totalLeave.sickLeave - numericSickLeave);
//         } else if (leaveType === "Casual Leave") {
//             const numericCasualLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.casualLeave = Math.max(0, totalLeave.casualLeave - numericCasualLeave);
//         } else if (leaveType === "Paid Leave") {
//             const numericPaidLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.paidLeave = Math.max(0, totalLeave.paidLeave - numericPaidLeave);
//         } else if (leaveType === "Paternity Leave") {
//             const numericPaternityLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.paternityLeave = Math.max(0, totalLeave.paternityLeave - numericPaternityLeave);
//         } else if (leaveType === "Maternity Leave") {
//             const numericMaternityLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.maternityLeave = Math.max(0, totalLeave.maternityLeave - numericMaternityLeave);
//         } else {
//             return res.status(400).json({ error: 'Invalid leave type' });
//         }

//         await totalLeave.save();
//         res.status(200).json({ message: 'Leave deducted successfully' });
//     } catch (error) {
//         next(error);
//     }
// };

// // Rejected leave logic (adds back the deducted leave)
// const rejectedLeave = async (req, res, next) => {
//     try {
//         const { id, leaveType, totalLeaveRequired } = req.body;
//         let totalLeave = await TotalLeave.findOne({ empID: id });

//         if (!totalLeave) {
//             return res.status(404).json({ error: 'No leave record found for this employee' });
//         }

//         if (leaveType === "Sick Leave") {
//             const numericSickLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.sickLeave = Math.max(0, totalLeave.sickLeave + numericSickLeave);
//         } else if (leaveType === "Casual Leave") {
//             const numericCasualLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.casualLeave = Math.max(0, totalLeave.casualLeave + numericCasualLeave);
//         } else if (leaveType === "Paid Leave") {
//             const numericPaidLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.paidLeave = Math.max(0, totalLeave.paidLeave + numericPaidLeave);
//         } else if (leaveType === "Paternity Leave") {
//             const numericPaternityLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.paternityLeave = Math.max(0, totalLeave.paternityLeave + numericPaternityLeave);
//         } else if (leaveType === "Maternity Leave") {
//             const numericMaternityLeave = parseInt(totalLeaveRequired, 10);
//             totalLeave.maternityLeave = Math.max(0, totalLeave.maternityLeave + numericMaternityLeave);
//         } else {
//             return res.status(400).json({ error: 'Invalid leave type' });
//         }

//         await totalLeave.save();
//         res.status(200).json({ message: 'Leave rejection processed successfully' });
//     } catch (error) {
//         next(error);
//     }
// };
// module.exports = {
//     assignLeave,getAllAvailableLeave,getAvailableLeave,deductLeave,rejectedLeave,getAvailableLeaveByEmail
// };

const { TotalLeave } = require("../models/totalLeave");
const express = require("express");
const { Employee } = require("../models/employeeModel");

const assignLeave = async (req, res) => {
  try {
    const {
      employees,
      sickLeave,
      paidLeave,
      casualLeave,
      paternityLeave,
      maternityLeave,
    } = req.body;

    const numericSickLeave = parseInt(sickLeave || 0);
    const numericPaidLeave = parseInt(paidLeave || 0);
    const numericCasualLeave = parseInt(casualLeave || 0);
    const numericPaternityLeave = parseInt(paternityLeave || 0);
    const numericMaternityLeave = parseInt(maternityLeave || 0);

    // Loop through the employees array and update leave quantities for each employee
    for (const employee of employees) {
      const { value: empID } = employee;

      // Ensure the values to be incremented are numeric
      if (
        !isNaN(numericSickLeave) &&
        !isNaN(numericPaidLeave) &&
        !isNaN(numericCasualLeave) &&
        !isNaN(numericPaternityLeave) &&
        !isNaN(numericMaternityLeave)
      ) {
        // Find the TotalLeave document for the current employee
        let totalLeave = await TotalLeave.findOne({ empID });

        // If TotalLeave document doesn't exist, create a new one
        if (!totalLeave) {
          totalLeave = new TotalLeave({
            empID,
            sickLeave: numericSickLeave,
            totalSickLeave: numericSickLeave,
            paidLeave: numericPaidLeave,
            totalPaidLeave: numericPaidLeave,
            casualLeave: numericCasualLeave,
            totalCasualLeave: numericCasualLeave,
            paternityLeave: numericPaternityLeave,
            totalPaternityLeave: numericPaternityLeave,
            maternityLeave: numericMaternityLeave,
            totalMaternityLeave: numericMaternityLeave,
          });
        } else {
          totalLeave.sickLeave = numericSickLeave;
          totalLeave.totalSickLeave = numericSickLeave;
          totalLeave.paidLeave += numericPaidLeave;
          totalLeave.totalPaidLeave += numericPaidLeave;
          totalLeave.casualLeave = numericCasualLeave;
          totalLeave.totalCasualLeave = numericCasualLeave;
          totalLeave.paternityLeave = numericPaternityLeave;
          totalLeave.totalPaternityLeave = numericPaternityLeave;
          totalLeave.maternityLeave = numericMaternityLeave;
          totalLeave.totalMaternityLeave = numericMaternityLeave;
        }

        await totalLeave.save();
      }
    }

    res.status(200).json({ message: "Leave assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAvailableLeave = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the TotalLeave document for the given email
    const totalLeave = await TotalLeave.findOne({ empID: id });
    const gender = await TotalLeave.findOne({ empID: id }).populate({
      path: "empID",
      select: "Gender -_id",
    });

    if (!totalLeave) {
      return res.status(404).json({ error: "Leave data not found" });
    }
    if (gender.empID.Gender === "male") {
      const {
        sickLeave,
        totalSickLeave,
        paidLeave,
        totalPaidLeave,
        casualLeave,
        totalCasualLeave,
        paternityLeave,
        totalPaternityLeave,
      } = totalLeave;

      let data = [
        { sickLeave, totalSickLeave },
        { paidLeave, totalPaidLeave },
        { casualLeave, totalCasualLeave },
        { paternityLeave, totalPaternityLeave },
      ];

      res.status(200).json(data);
    } else {
      const {
        sickLeave,
        totalSickLeave,
        paidLeave,
        totalPaidLeave,
        casualLeave,
        totalCasualLeave,
        maternityLeave,
        totalMaternityLeave,
      } = totalLeave;

      let data = [
        { sickLeave, totalSickLeave },
        { paidLeave, totalPaidLeave },
        { casualLeave, totalCasualLeave },
        { maternityLeave, totalMaternityLeave },
      ];

      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAvailableLeaveByEmail = async (req, res) => {
  try {
    const { id } = req.body;

    // Find the TotalLeave document for the given email
    const totalLeave = await TotalLeave.findOne({ empID: id });
    const gender = await TotalLeave.findOne({ empID: id }).populate({
      path: "empID",
      select: "Gender -_id",
    });
    if (!totalLeave) {
      return res.status(404).json({ error: "Leave data not found" });
    }
    if (gender.empID.Gender === "male") {
      const { sickLeave, paidLeave, casualLeave, paternityLeave } = totalLeave;

      let data = [
        {
          ["Sick Leave"]: sickLeave,
          ["Paid Leave"]: paidLeave,
          ["Casual Leave"]: casualLeave,
          ["Paternity Leave"]: paternityLeave,
        },
      ];

      res.status(200).json(data);
    } else {
      const { sickLeave, paidLeave, casualLeave, maternityLeave } = totalLeave;

      let data = [
        {
          ["Sick Leave"]: sickLeave,
          ["Paid Leave"]: paidLeave,
          ["Casual Leave"]: casualLeave,
          ["Maternity Leave"]: maternityLeave,
        },
      ];

      res.status(200).json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllAvailableLeave = async (req, res) => {
  try {
    const allLeaveData = await TotalLeave.find({}).populate({
      path: "empID",
      select: "profile FirstName LastName empID Email Account",
    });

    // Transform the data to move populated fields to the top level
  
    const transformedData = allLeaveData.map((record) => {
      const { empID, ...leaveData } = record.toObject();

      return {
        ...leaveData,
        profile: empID.profile,
        FirstName: empID.FirstName,
        LastName: empID.LastName,
        email: empID.Email,
        Account: empID.Account,
        empID: empID.empID,
      };
    });

    res.status(200).json(transformedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deductLeave = async (req, res) => {
  try {
    // Destructure the required fields directly from the request body
    const { id, email, leaveType, totalLeaveRequired } = req.body;

    let totalLeave = await TotalLeave.findOne({ empID: id });

    if (!totalLeave) {
      return res
        .status(404)
        .json({ error: "No leave record found for this employee" });
    }
    // Convert the leave counts to numeric values
    if (leaveType === "Sick Leave") {
      const numericSickLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.sickLeave = Math.max(
        0,
        totalLeave.sickLeave - numericSickLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave deducted successfully" });
    } else if (leaveType === "Casual Leave") {
      const numericCasualLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.casualLeave = Math.max(
        0,
        totalLeave.casualLeave - numericCasualLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave deducted successfully" });
    } else if (leaveType === "Paid Leave") {
      const numericPaidLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.paidLeave = Math.max(
        0,
        totalLeave.paidLeave - numericPaidLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave deducted successfully" });
    } else if (leaveType === "Paternity Leave") {
      const numericPaternityLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.paternityLeave = Math.max(
        0,
        totalLeave.paternityLeave - numericPaternityLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave deducted successfully" });
    } else if (leaveType === "Maternity Leave") {
      const numericMaternityLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.maternityLeave = Math.max(
        0,
        totalLeave.maternityLeave - numericMaternityLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave deducted successfully" });
    } else {
      res.status(500).json({ message: "No data found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const rejectedLeave = async (req, res) => {
  try {
    const { id, email, leaveType, totalLeaveRequired } = req.body;
    let totalLeave = await TotalLeave.findOne({ empID: id });
    if (!totalLeave) {
      return res
        .status(404)
        .json({ error: "No leave record found for this employee" });
    }

    if (leaveType === "Sick Leave") {
      const numericSickLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.sickLeave = Math.max(
        0,
        totalLeave.sickLeave + numericSickLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave rejected successfully" });
    } else if (leaveType === "Casual Leave") {
      const numericCasualLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.casualLeave = Math.max(
        0,
        totalLeave.casualLeave + numericCasualLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave rejected successfully" });
    } else if (leaveType === "Paid Leave") {
      const numericPaidLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.paidLeave = Math.max(
        0,
        totalLeave.paidLeave + numericPaidLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave rejected successfully" });
    } else if (leaveType === "Paternity Leave") {
      const numericPaternityLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.paternityLeave = Math.max(
        0,
        totalLeave.paternityLeave + numericPaternityLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave rejected successfully" });
    } else if (leaveType === "Maternity Leave") {
      const numericMaternityLeave = parseInt(totalLeaveRequired, 10);
      totalLeave.maternityLeave = Math.max(
        0,
        totalLeave.maternityLeave + numericMaternityLeave
      );
      await totalLeave.save();
      res.status(200).json({ message: "Leave rejected successfully" });
    } else {
      res.status(500).json({ message: "No data found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  assignLeave,
  getAllAvailableLeave,
  getAvailableLeave,
  deductLeave,
  rejectedLeave,
  getAvailableLeaveByEmail,
};
