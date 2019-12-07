const express = require('express');
const router = express.Router();
const gcloudController = require('../controllers/gcloudController');

// AUTHENTICATION
router.post('/auth', gcloudController.authUser, (req, res) => {
  res.sendStatus(200);
});

// DEPLOY THE FUNCTION
router.post('/deploy', gcloudController.deploy, (req, res) => {
  res.status(200).json(res.locals.endpoint);
});

// GET FUNCTIONS ASSOCIATED WITH THE PROJECT
router.get('/list', gcloudController.list, (req, res) => {
  res.status(200).json(res.locals.list);
});

// DELETE THE FUNCTION
router.delete('/delete', gcloudController.deleteFunction, (req, res) => {
  res.sendStatus(200);
});

// CALL FUNCTION
router.get('/call/:fn_name', gcloudController.callFunction, (req, res) => {
  res.sendStatus(200);
});

// GET INFORMATION ABOUT FUNCTION
router.get('/info/:fn_name', gcloudController.getinformation, (req, res) => {
  res.status(200).json(res.locals.info);
});

// GET FUNCTION CODE
router.get('/source/:fn_name', gcloudController.getCode, (req, res) => {
  res.status(200).json(res.locals.endpoint);
});

module.exports = router;