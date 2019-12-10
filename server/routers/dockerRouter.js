const express = require("express");
const router = express.Router();
const dockerController = require("../controllers/dockerController");

router.post("/containerSetup", dockerController.containerSetup, (req, res) => {
  res.status(200);
});

router.post("/defaultSetup", dockerController.defaultSetup, (req, res) => {
  res.status(200);
});

// router.post("/funcSetup", dockerController.funcSetup, (req, res) => {
//   res.status(200);
// });

router.post("/deployDocker", dockerController.deployDocker, (req, res) => {
  res.status(200);
});

router.post("/buildImage", dockerController.buildImage, (req, res) => {
  res.status(200);
})

router.post("/dockerDirect", dockerController.dockerDirect, (req, res) => {
  res.status(200);
})

router.post("/stopDocker", dockerController.stopDocker, (req, res) => {
  res.status(200);
})

router.post("/dockerLogin", dockerController.dockerLogin, (req, res) => {
  res.status(200);
})

router.post("/dockerHubDeploy", dockerController.dockerHubDeploy, (req, res) => {
  res.status(200);
})
router.post("/dockerDeleteContainers", dockerController.deleteContainers, (req, res) => {
  res.status(200);
})
module.exports = router;