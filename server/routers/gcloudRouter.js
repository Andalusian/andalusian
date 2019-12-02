const express = require('express');
const router = express.Router();
const gcloudController = require('../controllers/gcloudController');

router.put('/auth', gcloudController.authUser, (req, res) => {
  res.sendStatus(200);
});

router.put('/deploy', gcloudController.deploy, (req, res) => {
  res.status(200).json(res.locals.endpoint);
});

module.exports = router;