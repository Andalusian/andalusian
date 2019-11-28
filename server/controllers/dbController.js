const crypto = require('crypto');
const fs = require('fs');
const User = require('../models/userModel');

const dbController = {};

dbController.encrypt = (req, res, next) => {

  return next();
}

dbController.decrypt = (req, res, next) => {
  return next();
}

module.exports = dbController;