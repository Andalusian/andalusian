const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');
// const { Worker, isMainThread, parentPort } = require('worker_threads');
const { cryptoKey } = require('../../config');
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
        username,
        password: hash
      };
      return next();
    }
  });
}

dbController.createUser = (req, res, next) => {
  console.log('within dbController.createUser');
  const { username, password } = res.locals.userInfo;
  User.create({ username, password }, function (err, response) {
    if (err) {
      console.log(`Error in dbController.createUser: ${err}`);
      return next(err);
    } else {
      console.log(`User ${username} created in database`);
      return next();
    }
  });
}

dbController.verifyUser = (req, res, next) => {
  console.log('within dbController.verifyUser');
  const { username, password } = req.body;
  User.findOne({ username }, function (err, response) {
    if (err) {
      console.log(`Error in dbController.verifyUser: ${err}`);
      return next(err);
    } else if (response === null) {
      console.log(`User ${username} not found in database`);
      return next();
    } else {
      bcrypt.compare(password, response.password, function (error, compareResult) {
        if (error) {
          console.log(`Error in dbController.verifyUser bcrypt.compare: ${error}`);
          return next(err);
        } else if (!compareResult) {
          console.log(`Password for ${username} does not match database`);
          return next();
        } else {
          res.locals.userData = response;
          return next();
        }
      });
    }
  });
}

dbController.decrypt = (req, res, next) => {
  const { googleKey, cryptoIV } = res.locals.userData;
  let decipher = crypto.createDecipheriv('aes-256-cbc', cryptoKey, cryptoIV);
  let decrypted = decipher.update(googleKey, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  res.locals.userData.googleKey = decrypted;
  return next();
}

dbController.encryptKey = (req, res, next) => {
  console.log('within dbController.encrypt');
  // const { keyObject } = req.body; 

  const { key } = req.body;

  const iv = crypto.randomBytes(8).toString('hex');
  let cipher = crypto.createCipheriv('aes-256-cbc', cryptoKey, iv);
  let encrypted = cipher.update(key, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  res.locals.userData = { key: encrypted, cryptoIV: iv };

  return next();
}

dbController.storeKey = (req, res, next) => {
  const { username } = req.body;
  const { googleKey, cryptoIV } = res.locals.userData;
  // User.findOne({ username }, function(err, response) {
  //   if (err) {
  //     console.log(`Error in dbController.storeGoogleKey findOne: ${err}`);
  //     return next(err);
  //   } else {
  //     res.locals.userData.keys = [...response.keys];
  //     res.locals.userData.keys.push([keyName, googleKey, cryptoIV]);
  //   }
  // });
  User.findOneAndUpdate({ username }, { googleKey, cryptoIV }, function (err, response) {
    if (err) {
      console.log(`Error in dbController.storeGoogleKey: ${err}`);
      return next(err);
    } else {
      console.log(`Added encrypted key to ${username} in database`);
      return next();
    }
  });
}

module.exports = dbController;