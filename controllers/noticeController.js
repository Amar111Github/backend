// const { Employee } = require("../models/employeeModel");
// const Notice = require("../models/noticeModel"); // Import your Notice model

// // NoticeBoard controller function
// const NoticeBoard = async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         // Step 1: Find the employee by ID
//         const employee = await Employee.findById(id);

//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }

//         // Step 2: Extract the array of notice IDs
//         const noticeIds = employee.Notice;

//         // Step 3: Find all notices that match the notice IDs
//         const notices = await Notice.find({ _id: { $in: noticeIds } });

//         // Step 4: Send the notices as the response
//         res.status(200).json(notices);

//     } catch (err) {
//         console.error("Error retrieving notices:", err);
//         // Pass error to the error handler middleware
//         next(err);
//     }
// };

// module.exports = { NoticeBoard };

const { Employee } = require("../models/employeeModel");
const Notice = require("../models/noticeModel"); // Import your Notice model

const NoticeBoard = async (req, res) => {
    try {
        const { id } = req.params;

        // Step 1: Find the employee by ID
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Step 2: Extract the array of notice IDs
        const noticeIds = employee.Notice;

        // Step 3: Find all notices that match the notice IDs
        const notices = await Notice.find({ _id: { $in: noticeIds } });

        // Step 4: For each notice, find the creator's profile and position
        const noticesWithCreatorDetails = await Promise.all(
            notices.map(async (notice) => {
                const creator = await Employee.findOne({ Email: notice.creatorMail }).populate({path: "position", select: "PositionName -_id"}).select("profile");
               
                return {
                    ...notice.toObject(),
                    creatorProfile: creator ? creator.profile : null,
                    creatorPosition: creator ? creator.position[0].PositionName : null
                };
            })
        );

        // Step 5: Send the enhanced notices as the response
     
        res.status(200).json(noticesWithCreatorDetails);

    } catch (err) {
        console.error("Error retrieving notices:", err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { NoticeBoard };
  
