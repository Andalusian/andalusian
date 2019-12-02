const express = require('express');
const router = express.Router();
const gcloudController = require('../controllers/gcloudController');

router.post('/auth', gcloudController.authUser, (req, res) => {
  res.sendStatus(200);
});

router.post('/deploy', gcloudController.deploy, (req, res) => {
  res.status(200).json(res.locals.endpoint);
});

module.exports = router;