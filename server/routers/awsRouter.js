const express = require("express");
const router = express.Router();
const awsController = require("../controllers/awsController");
const request = require('superagent');


router.post("/configureAWS", awsController.configureAWS, (req, res, next) => {
  res.sendStatus(200);
});

router.post("/listFunctions", awsController.listFunctions, (req, res, next) => {
  res.status(200).send(res.locals.func);
})

router.post("/allBuckets", awsController.allBuckets, (req, res, next) => {
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

router.post("/getawsAccountID", awsController.getawsAccountID, (req, res, next) => {
  res.status(200).send(res.locals.awsAccountID);
})

router.post("/loadCode", awsController.loadCode, (req, res, next) => {
  res.status(200).send(res.locals.codeLoaded);
})

module.exports = router;
