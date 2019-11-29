const express = require("express");
const router = express.Router();
const awsController = require("../controllers/awsController");

router.post("/configure", awsController.configure, (req, res) => {
  res.status(200);
});

router.post("/deploy", awsController.deploy, (req, res) => {
  res.status(200);
});

router.get("/listFunctions", awsController.listFunctions, (req, res) => {
  console.log("in listFunctions ROUTER --> ", res.locals.func);
  return res.status(200).json(res.locals.func);
})

module.exports = router;
