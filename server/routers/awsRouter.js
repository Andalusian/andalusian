const express = require("express");
const router = express.Router();
const awsController = require("../controllers/awsController");

router.post("/configureAWS", awsController.configureAWS, (req, res) => {
  res.status(200);
});

// router.post("/configureTemp", awsController.configureTemp, (req, res) => {
//   res.status(200);
// });

// router.post("/packageSAM", awsController.packageSAM, (req, res) => {
//   res.status(200);
// });

// router.post("/deploy", awsController.deploy, (req, res) => {
//   res.status(200);
// });

router.get("/listFunctions", awsController.listFunctions, (req, res) => {
  return res.status(200).send(res.locals.func);
})

router.get("/allBuckets", awsController.allBuckets, (req, res) => {
  return res.status(200).send(res.locals.buckets);
})

// router.get("/getCurrRegion", awsController.getCurrRegion, (req, res) => {
//   return res.status(200).send(res.locals.region);
// })

router.post("/getFuncInfo", awsController.getFuncInfo, (req, res) => {
  return res.status(200).send(res.locals.funcInfo);
})

router.post("/createBucket", awsController.createBucket, (req, res) => {
  return res.status(200);
})

router.post("/createFunction", awsController.createFunction, (req, res) => {
  return res.status(200);
})

router.post("/deleteFunc", awsController.deleteFunc, (req, res) => {
  return res.status(200);
})

router.post("/invokeFunc", awsController.invokeFunc, (req, res) => {
  return res.status(200);
})

router.get("/getawsAccountID", awsController.getawsAccountID, (req, res) => {
  return res.status(200).send(res.locals.awsAccountID);
})


module.exports = router;
