const Joi = require("joi");
const moment = require('moment'); 
const moments = require('moment-timezone');
const { Employee } = require("../models/employeeModel");
const { LeaveApplication } = require("../models/leaveModel");
const { TotalLeave } = require('../models/totalLeave');
const {
  LeaveApplicationValidation,
  LeaveApplicationHRValidation
} = require("../validations/leavelValidation");

// find  all LeaveApplication Employee
const getAllLeaveApplication = async (req, res) => {

  Employee.findById(req.params.id)
    .populate({
      path: "leaveApplication"
    })
    .select("FirstName LastName MiddleName")
    .exec(function (err, employee) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.send(employee);
      }
    });
};

// find  all LeaveApplication Admin Hr
const getAllLeaveApplicationHr = async (req, res) => {
  const { hr, manager } = req.body;

  // Build the match condition based on whether hr or manager is provided
  let matchCondition = {};
  if (hr) {
    matchCondition = {
      $or: [
        { "employeeDetails.reportHr": hr },
        { "aditionalManager": hr }
      ]
    };
  } else if (manager) {
    matchCondition = {
      $or: [
        { "employeeDetails.reportManager": manager },
        { "aditionalManager": manager }
      ]
    };
    
  }

  try {
    const leaveApplications = await LeaveApplication.aggregate([
      {
        $lookup: {
          from: "employees", // The name of the employee collection
          localField: "employee", // The field in the LeaveApplication collection that references the employee
          foreignField: "_id", // The field in the employee collection to match
          as: "employeeDetails"
        }
      },
      {
        $unwind: "$employeeDetails"
      },
      {
        $match: matchCondition
      },
      {
        $project: {
          FirstName: "$employeeDetails.FirstName",
          LastName: "$employeeDetails.LastName",
          empID: "$employeeDetails.empID",
          Email: "$employeeDetails.Email",
          empObjID: "$employeeDetails._id",
          reportHr: "$employeeDetails.reportHr",
          reportManager: "$employeeDetails.reportManager",
          Leavetype: 1,
          FromDate: 1,
          ToDate: 1,
          Reasonforleave: 1,
          Status: 1,
          aditionalManager: 1,
          createdOn: 1,
          reasonOfRejection: 1,
          updatedBy: 1
        }
      }
    ]);


    res.send(leaveApplications);
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};




// create a LeaveApplication
  // Assuming Joi is required for validation

const createLeaveApplication  = async (req, res) => {
  try {
 
   
    const { error } = LeaveApplicationValidation.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

   
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send("Employee not found");
    }

 
    const newLeaveApplication = {
      Leavetype: req.body.Leavetype,
      FromDate: req.body.FromDate,
      ToDate: req.body.ToDate,
      Reasonforleave: req.body.Reasonforleave,
      Status: req.body.Status,
      employee: req.params.id,
      aditionalManager: req.body.aditionalManager,
      managerEmail: req.body.managerEmail,
      leaveDuration:req.body.leaveDuration,
    };


   
    const { Leavetype, totalLeaveRequired,leaveDuration } = req.body;
    let totalLeave = await TotalLeave.findOne({ empID: req.params.id });

    if (!totalLeave) {
      return res.status(404).json({ error: 'No leave record found for this employee' });
    }

    const numericLeaveRequired = leaveDuration === 'Half Day' ? 0.5 : parseInt(totalLeaveRequired, 10);

    if (Leavetype === "Sick Leave") {
      totalLeave.sickLeave = Math.max(0, totalLeave.sickLeave - numericLeaveRequired);
    } else if (Leavetype === "Casual Leave") {
      totalLeave.casualLeave = Math.max(0, totalLeave.casualLeave - numericLeaveRequired);
    } else if (Leavetype === "Paid Leave") {
      totalLeave.paidLeave = Math.max(0, totalLeave.paidLeave - numericLeaveRequired);
    } else if (Leavetype === "Paternity Leave") {
      totalLeave.paternityLeave = Math.max(0, totalLeave.paternityLeave - numericLeaveRequired);
    } else if (Leavetype === "Maternity Leave") {
      totalLeave.maternityLeave = Math.max(0, totalLeave.maternityLeave - numericLeaveRequired);
    }else if (Leavetype === "unPaid Leave") {
      
    }  else {
      return res.status(400).json({ message: 'Invalid leave type' });
    }

    // Step 7: Save the updated leave record
    const leaveApplication = await LeaveApplication.create(newLeaveApplication);
    employee.leaveApplication.push(leaveApplication);
    await totalLeave.save();
    await employee.save();
    // Step 8: Respond with success message
    res.status(201).json({
      message: 'Leave application created successfully',
      leaveApplication,
    });

  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// find and update the LeaveApplication
const updateLeaveApplication = async (req, res) => {
  Joi.validate(req.body, LeaveApplicationValidation, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send(err.details[0].message);
    } else {
      let newLeaveApplication;

      newLeaveApplication = {
        Leavetype: req.body.Leavetype,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Reasonforleave: req.body.Reasonforleave,
        Status: req.body.Status,
        employee: req.params.id,
        
      };

      LeaveApplication.findByIdAndUpdate(
        req.params.id,
        newLeaveApplication,
        function (err, leaveApplication) {
          if (err) {
            res.send("error");
          } else {
            res.send(newLeaveApplication);
          }
        }
      );
    }
  });
};

const leaveApplicationSchema = Joi.object({
  Status: Joi.string().required(),
  updatedBy: Joi.string().required(),
  leaveType: Joi.string().required(),
  reasonOfRejection: Joi.string().optional(),
  totalLeaveRequired: Joi.number().required(),
  id:Joi.string().required(),
});
// find and update the LeaveApplication adminHr
const updateLeaveApplicationHr = async (req, res) => {
  console.log(req.body)
  // Validate request body
  const { error, value } = leaveApplicationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { Status, updatedBy, reasonOfRejection, id, email, leaveType, totalLeaveRequired } = value;

  try {

    const newLeaveApplication = {
      Status,
      updatedBy,
      reasonOfRejection: Status === "3" ? reasonOfRejection : undefined,
    };

   

  
    if (Status === "3") {
      let totalLeave = await TotalLeave.findOne({ empID: id });
      if (!totalLeave) {
        return res.status(404).json({ error: 'No leave record found for this employee' });
      }

      const numericLeave = totalLeaveRequired ===0.5? 0.5:parseInt(totalLeaveRequired, 10);

      switch (leaveType) {
        case "Sick Leave":
          totalLeave.sickLeave = Math.max(0, totalLeave.sickLeave + numericLeave);
          break;
        case "Casual Leave":
          totalLeave.casualLeave = Math.max(0, totalLeave.casualLeave + numericLeave);
          break;
        case "Paid Leave":
          totalLeave.paidLeave = Math.max(0, totalLeave.paidLeave + numericLeave);
          break;
        case "Paternity Leave":
          totalLeave.paternityLeave = Math.max(0, totalLeave.paternityLeave + numericLeave);
          break;
        case "Maternity Leave":
          totalLeave.maternityLeave = Math.max(0, totalLeave.maternityLeave + numericLeave);
          break;
          case "unPaid Leave":
            
            break;
        default:
          return res.status(500).json({ message: 'Invalid leave type' });
      }
      await LeaveApplication.findByIdAndUpdate(req.params.id, { $set: newLeaveApplication });
      await totalLeave.save();
    }else if(Status === "2"){
      await LeaveApplication.findByIdAndUpdate(req.params.id, { $set: newLeaveApplication });
    }

    res.status(200).json({ message: 'Leave updated successfully', newLeaveApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// // find and delete the LeaveApplication Employee
const deleteLeaveApplication = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {

            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
              
                res.send(leaveApplication);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        }
      );
     
    }
  });
};

// // find and delete the LeaveApplication AdminHr
const deleteLeaveApplicationHr = async (req, res) => {
  Employee.findById({ _id: req.params.id }, function (err, employee) {
    if (err) {
      res.send("error");
      console.log(err);
    } else {
      LeaveApplication.findByIdAndRemove(
        { _id: req.params.id2 },
        function (err, leaveApplication) {
          if (!err) {
       
            Employee.update(
              { _id: req.params.id },
              { $pull: { leaveApplication: req.params.id2 } },
              function (err, numberAffected) {
        
                res.send(leaveApplication);
              }
            );
          } else {
            console.log(err);
            res.send("error");
          }
        }
      );
 
    }
  });
};
 // Ensure moment is required for date comparison




 const getLeaveApplicationNo = async (req, res) => {
  try {
    const { email } = req.body;

    const listOfEmployees = await Employee.find({
      $or: [{ reportHr: email }, { reportManager: email }]
    }).select("_id");
    const today = moments().tz('Asia/Kolkata').format('YYYY-MM-DD');
  
    const leaveRequestPromises = listOfEmployees.map((val) => {
    
      const query = {
        employee: val._id,
        Status: "2",
        $expr: {
          $and: [
            { $gte: [{ $dateToString: { format: "%Y-%m-%d", date: "$FromDate" } }, today] },
            { $lte: [{ $dateToString: { format: "%Y-%m-%d", date: "$ToDate" } }, today] }
          ]
        }
      };
  
    
      return LeaveApplication.find(query);
    });

    const leaveRequests = await Promise.all(leaveRequestPromises);
  

    const flattenedLeaveRequests = leaveRequests.flat();
    const obj= {
      totalEmployee: listOfEmployees.length,
      onLeave: flattenedLeaveRequests.length,
    
    }
    res.status(200).json(obj);
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getLeaveApplicationsByMonthYear = async (req, res) => {
  const { month, year } = req.query;


  if (!month || !year) {
    return res.status(400).json({ error: "Month and year are required" });
  }

  if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
    return res.status(400).json({ error: "Invalid month or year" });
  }

  try {

    const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = moment(startDate).endOf('month').toDate();


    const leaveApplications = await LeaveApplication.find({
      FromDate: { $gte: startDate },
      ToDate: { $lte: endDate }
    }).populate('employee');

 
    res.status(200).json(leaveApplications);
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  getAllLeaveApplication,
  getAllLeaveApplicationHr,
  getLeaveApplicationNo,
  createLeaveApplication,

  updateLeaveApplication,
  updateLeaveApplicationHr,

  deleteLeaveApplication,
  deleteLeaveApplicationHr,
  getLeaveApplicationsByMonthYear
};

