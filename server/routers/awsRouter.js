const express = require("express");
const router = express.Router();
const awsController = require("../controllers/awsController");
const request = require('superagent');


router.post("/configureAWS", awsController.configureAWS, (req, res, next) => {
  res.sendStatus(200);
});

router.get("/listFunctions", awsController.listFunctions, (req, res, next) => {
  res.status(200).send(res.locals.func);
})

router.get("/allBuckets", awsController.allBuckets, (req, res, next) => {
  res.status(200).send(res.locals.buckets);
})

router.post("/getFuncInfo", awsController.getFuncInfo, (req, res, next) => {
  res.status(200).send(res.locals.funcInfo);
})

router.post("/createBucket", awsController.createBucket, (req, res, next) => {
  res.sendStatus(200);
})

router.post("/createFunction", awsController.createFunction, (req, res, next) => {
  res.sendStatus(200);
})

router.post("/deleteFunc", awsController.deleteFunc, (req, res, next) => {
  res.sendStatus(200);
})

router.post("/invokeFunc", awsController.invokeFunc, (req, res, next) => {
  res.sendStatus(200);
})

router.get("/getawsAccountID", awsController.getawsAccountID, (req, res, next) => {
  res.status(200).send(res.locals.awsAccountID);
})

// router.post("/loadCode", awsController.loadCode, (req, res, next) => {
//   res.status(200).send(res.locals.funcCode);
//   return next();
// })

module.exports = router;
