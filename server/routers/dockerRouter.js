const express = require("express");
const router = express.Router();
const dockerController = require("../controllers/dockerController");

router.post("/containerSetup", dockerController.containerSetup, (req, res) => {
    res.status(200);
  });

router.post("/defaultSetup", dockerController.defaultSetup, (req, res) => {
    res.status(200);
  });

router.post("/funcSetup", dockerController.funcSetup, (req, res) => {
    res.status(200);
});

router.post("/deployDocker", dockerController.deployDocker, (req, res) => {
    res.status(200);
});
  module.exports = router;