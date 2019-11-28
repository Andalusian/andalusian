const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');
const User = require('../models/userModel');

const dbController = {};

dbController.hashPassword = (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      console.log(`Error in dbController.bcryptify: ${err}`);
      return next(err);
    } else {
      res.locals.userInfo = {
        username: username,
        password: hash
      };
      return next();
    }
  });
}

dbController.encrypt = (req, res, next) => {
  return next();
}

dbController.decrypt = (req, res, next) => {
  return next();
}

dbController.createUser = (req, res, next) => {
  console.log("hit createUser controller");
  const { username, password } = res.locals.userInfo;
  User.create({ username, password }, function(err, response) {
    if (err) {
      console.log(`Error in dbController.createUser: ${err}`);
      return next(err);
    } else {
      // console.log(`User ${username} created in database`);
      return next();
    }
  });
};

module.exports = dbController;