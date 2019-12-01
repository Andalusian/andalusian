const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { Worker, isMainThread, parentPort } = require('worker_threads');
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
  console.log('within dbController.encrypt');

  let iv = crypto.randomBytes(16);

  let secret_message = req.body.userData;
  let key = '12345678123456781234567812345678';
  let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(secret_message, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  console.log('encrypted: ' + encrypted);

  let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  console.log('decrpyted: ' + decrypted);

  return next();
  // if (isMainThread) {
  //   const worker = new Worker(__filename);
  //   worker.on('message', (msg) => { console.log(msg) });
  // } else {
  //   parentPort.postMessage('Hellooooo');
  // }
  // return next();
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