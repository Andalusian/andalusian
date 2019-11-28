const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/userInfo', dbController.decrypt, (req, res) => {
  res.sendStatus(400);
});

router.post(
  "/newUser",
  dbController.hashPassword,
  dbController.createUser,
  (req, res) => {
    res.sendStatus(400);
  }
);

module.exports = router;