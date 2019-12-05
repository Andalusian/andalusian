const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.post('/login', dbController.verifyUser, dbController.decrypt, (req, res) => {
  res.status(200).json({ userData: res.locals.userData });
});

router.post('/createNewUser', dbController.hashPassword, dbController.createUser, (req, res) => {
  res.sendStatus(200);
}
);

router.post('/storeKey', dbController.encryptKey, dbController.storeKey, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;