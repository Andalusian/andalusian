const express = require('express');
const router = express.Router();
const gcloudController = require('../controllers/gcloudController');

router.put('/auth', gcloudController.authUser, (req, res) => {
  res.sendStatus(200);
});

router.put('/deploy', gcloudController.deploy, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;