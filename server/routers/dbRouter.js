const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/', dbController.decrypt, (req, res) => {});

router.post('/', dbController.encrypt, dbController.createNewUser, (req, res) => {});

module.exports = router;