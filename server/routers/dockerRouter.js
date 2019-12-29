const express = require("express");
const router = express.Router();
const dockerController = require("../controllers/dockerController");

//Dockerfile Setup
router.post("/containerSetup", dockerController.containerSetup, (req, res) => {
  res.status(200);
});

//Default Dockerfile Setup
router.post("/defaultSetup", dockerController.defaultSetup, (req, res) => {
  res.status(200);
});

// router.post("/funcSetup", dockerController.funcSetup, (req, res) => {
//   res.status(200);
// });

//Containerization
router.post("/deployDocker", dockerController.deployDocker, (req, res) => {
  res.status(200);
});

//Docker image build
router.post("/buildImage", dockerController.buildImage, (req, res) => {
  res.status(200);
})

//Tmp directory creation and setup
router.post("/dockerDirect", dockerController.dockerDirect, (req, res) => {
  res.status(200);
})

//Stop active container
router.post("/stopDocker", dockerController.stopDocker, (req, res) => {
  res.status(200);
})

//Login to Docker Daemon
router.post("/dockerLogin", dockerController.dockerLogin, (req, res) => {
  res.status(200);
})

//Deploy to Docker Hub
router.post("/dockerHubDeploy", dockerController.dockerHubDeploy, (req, res) => {
  res.status(200);
})

//Delete all images and containers on system
router.post("/dockerDeleteContainers", dockerController.deleteContainers, (req, res) => {
  res.status(200);
})

//Deploy active image to ECR repository
router.post("/deployContToAws", dockerController.deployContToAws, (req, res) => {
  res.status(200);
})

//Establish connection to ECR repository
router.post("/connectToEcr", dockerController.connectToEcr, (req, res) => {
  res.status(200);
})
module.exports = router;