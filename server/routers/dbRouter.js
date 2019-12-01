const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/userInfo', dbController.decrypt, (req, res) => {
  res.sendStatus(200);
});

router.post('/createNewUser', dbController.hashPassword, dbController.createUser, (req, res) => {
    res.sendStatus(200);
  }
);

router.post('/storeGoogleKey', dbController.encrypt, dbController.storeGoogleKey, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;