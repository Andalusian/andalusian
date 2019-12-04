const express = require('express');
const router = express.Router();
const azureController = require('../controllers/azureController');

router.post('/createProj', azureController.createProj, (req, res) => {
    res.status(200)
})

module.exports = router;
