const express = require("express");
const router = express.Router();
const awsController = require("../controllers/awsController");

router.post("/configure", awsController.configure, (req, res) => {
  console.log("in awsRouter configure");
  res.status(200);
});

router.post("/deploy", awsController.deploy, (req, res) => {
  console.log("in awsRouter deploy");
  res.status(200);
});

module.exports = router;
