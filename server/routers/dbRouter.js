const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/', dbController.decrypt, (req, res) => {
  res.sendStatus(400);
});

router.post('/', dbController.encrypt, dbController.createNewUser, (req, res) => {
  res.sendStatus(400);
});

module.exports = router;