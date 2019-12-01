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
  console.log("within createUser controller");
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

dbController.encrypt = (req, res, next) => {
  console.log('within dbController.encrypt');
  const { googleKey } = req.body;

  const iv = crypto.randomBytes(8).toString('hex');
  let cipher = crypto.createCipheriv('aes-256-cbc', cryptoKey, iv);
  let encrypted = cipher.update(googleKey, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  res.locals.userData = { googleKey: encrypted, cryptoIV: iv };

  console.log('encrypted: ' + encrypted);

  return next();
}

dbController.decrypt = (req, res, next) => {
  const { userData } = res.locals;
  const { googleKey, cryptoIV } = userData;
  let decipher = crypto.createDecipheriv('aes-256-cbc', cryptoKey, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  console.log('decrpyted: ' + decrypted);
  return next();
}

dbController.storeGoogleKey = (req, res, next) => {
  const { username } = req.body;
  const { userData } = res.locals;
  const { googleKey, cryptoIV } = userData;
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