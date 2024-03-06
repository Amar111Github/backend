
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
            console.log("new project Saved");
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
        console.log("project deleted");
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