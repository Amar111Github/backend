
// const Joi = require('joi');
// const { Project } = require('../models/projectModel');
// const { ProjectValidation } = require('../validations/projectValidation');

// // fint all project 
// const getAllProject = async (req, res, next) => {
//   try {
//     const projects = await Project.find().populate("portals").exec();
//     res.status(200).json(projects);
//   } catch (err) {
//     console.error("Error fetching projects:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };

// // Create a project
// const createProject = async (req, res, next) => {
//   try {
//     const { error } = ProjectValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const project = {
//       ProjectTitle: req.body.ProjectTitle,
//       ProjectURL: req.body.ProjectURL,
//       ProjectDesc: req.body.ProjectDesc,
//       portals: req.body.Portal_ID,
//       EstimatedTime: req.body.EstimatedTime,
//       EstimatedCost: req.body.EstimatedCost,
//       ResourceID: req.body.ResourceID,
//       Status: req.body.Status,
//       Remark: req.body.Remark
//     };

//     const newProject = await Project.create(project);
//     res.status(201).json(newProject);
//     console.log("New project saved");
//   } catch (err) {
//     console.error("Error creating project:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };

// // Update a project
// const updateProject = async (req, res, next) => {
//   try {
//     const { error } = ProjectValidation.validate(req.body);
//     if (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }

//     const updateProject = {
//       ProjectTitle: req.body.ProjectTitle,
//       ProjectURL: req.body.ProjectURL,
//       ProjectDesc: req.body.ProjectDesc,
//       portals: req.body.Portal_ID,
//       EstimatedTime: req.body.EstimatedTime,
//       EstimatedCost: req.body.EstimatedCost,
//       ResourceID: req.body.ResourceID,
//       Status: req.body.Status,
//       Remark: req.body.Remark
//     };

//     const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateProject, { new: true });
//     if (!updatedProject) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     res.status(200).json(updatedProject);
//   } catch (err) {
//     console.error("Error updating project:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };

// // Delete a project
// const deleteProject = async (req, res, next) => {
//   try {
//     const project = await Project.findByIdAndRemove(req.params.id);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     res.status(200).json({ message: "Project deleted successfully", project });
//     console.log("Project deleted");
//   } catch (err) {
//     console.error("Error deleting project:", err);
//     next(err); // Pass error to the error handler middleware
//   }
// };
  
//   module.exports = {
//     getAllProject,
//     createProject,
//     updateProject,
//     deleteProject
//   }




const Joi = require('joi');
const { Project } = require('../models/projectModel');
const { ProjectValidation } = require('../validations/projectValidation');

// fint all project 
const getAllProject = async (req, res) => {
  Project.find().populate("portals").exec(function (err, project) {
    if (err) {
      console.log(err);
      res.send("err");
    } else {
      res.send(project);
    }
  });
  }
  
  // create a project 
  const createProject = async (req, res) => {
    Joi.validate(req.body, ProjectValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        let project;
        project = {
          ProjectTitle: req.body.ProjectTitle,
          ProjectURL: req.body.ProjectURL,
          ProjectDesc: req.body.ProjectDesc,
          portals: req.body.Portal_ID,
          EstimatedTime: req.body.EstimatedTime,
          EstimatedCost: req.body.EstimatedCost,
          ResourceID: req.body.ResourceID,
          Status: req.body.Status,
          Remark: req.body.Remark
        };
        Project.create(project, function (err, project) {
          if (err) {
            console.log(err);
            res.send("error");
          } else {
            res.send(project);
          }
        });
      }
    });
  }
  
  // find and update the project 
  const updateProject = async (req, res) => {
    Joi.validate(req.body, ProjectValidation, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err.details[0].message);
      } else {
        let updateProject;
        updateProject = {
          ProjectTitle: req.body.ProjectTitle,
          ProjectURL: req.body.ProjectURL,
          ProjectDesc: req.body.ProjectDesc,
          portals: req.body.Portal_ID,
          EstimatedTime: req.body.EstimatedTime,
          EstimatedCost: req.body.EstimatedCost,
          ResourceID: req.body.ResourceID,
          Status: req.body.Status,
          Remark: req.body.Remark
        };
  
        Project.findByIdAndUpdate(req.params.id, updateProject, function (
          err,
          Project
        ) {
          if (err) {
            res.send("error");
          } else {
            res.send(updateProject);
          }
        });
      }
    });
  }
  
  // find and delete the project 
  const deleteProject = async (req, res) => {
    Project.findByIdAndRemove({ _id: req.params.id }, function (err, project) {
      if (err) {
        console.log("error");
        res.send("err");
      } else {
        res.send(project);
      }
    });
  }
  
  
  module.exports = {
    getAllProject,
    createProject,
    updateProject,
    deleteProject
  }