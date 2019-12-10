const express = require('express');
const router = express.Router();
const azureController = require('../controllers/azureController');

router.post('/createProj', azureController.createProj, (req, res) => {
    res.status(200).send(res.locals)
})

router.post('/createFunc', azureController.createFunc, (req, res) => {
    res.status(200).send(res.locals)
})

router.post('/updateCode', azureController.updateCode, (req, res) => {
    res.status(200).send(res.locals)
})

router.post('/deployFunc', azureController.deployFunc, (req, res) => {
    res.status(200).send(res.locals)
})

router.post('/auth', azureController.auth, (req, res) => {
    res.status(200).send(res.locals)
})

module.exports = router;

