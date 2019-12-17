const crypto = require('crypto');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { cryptoKey } = require('../../config');
const User = require('../models/userModel');
const dbController = {};

dbController.hashPassword = (req, res, next) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dbController.hashPassword | ERROR: ", `${err}`)
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
  const { username, password } = res.locals.userInfo;
  fs.mkdir(`users/${username}/aws`, { recursive: true }, () => {
    fs.mkdir(`users/${username}/gcloud`, { recursive: true }, () => {
      fs.mkdir(`users/${username}/azure`, { recursive: true }, () => {
        fs.mkdir(`users/${username}/docker`, { recursive: true }, () => {
        });
      });
    });
  });
  User.create({ username, password }, function (err, response) {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dbController.createUser | ERROR: ", `${err}`);
      return next(err);
    } else {
      console.log(`User ${username} created in database`);
      return next();
    }
  });
}

dbController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  fs.mkdir(`users/${username}/aws`, { recursive: true }, () => {
    fs.mkdir(`users/${username}/gcloud`, { recursive: true }, () => {
      fs.mkdir(`users/${username}/azure`, { recursive: true }, () => {
        fs.mkdir(`users/${username}/docker`, { recursive: true }, () => {
          fs.mkdir(`users/${username}/docker/tmp`, { recursive: true }, () => {
          });
        });
      });
    });
  });
  User.findOne({ username }, function (err, response) {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dbController.verifyUser | ERROR: ", `${err}`);
      return next(err);
    } else if (response === null) {
      console.log(`User ${username} not found in database`);
      return next();
    } else {
      bcrypt.compare(password, response.password, function (error, compareResult) {
        if (error) {
          console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dbController.verifyUserBcrypt | ERROR: ", `${error}`);
          return next(err);
        } else if (!compareResult) {
          console.log(`Password for ${username} does not match database`);
          return next();
        } else {
          res.locals.userData = {
            username: response.username,
            keys: response.keys,
          };
          return next();
        }
      });
    }
  });
}

dbController.decrypt = (req, res, next) => {
  const { keys } = res.locals.userData;
  const decryptedKeys = [];

  keys.forEach(key => {
    const { encryptedKey, cryptoIV } = key;
    let decipher = crypto.createDecipheriv('aes-256-cbc', cryptoKey, cryptoIV);
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    const decryptedKeyObject = {
      keyType: key.keyType,
      key: decrypted,
    }
    if (key.keyAlias) {
      decryptedKeyObject.keyAlias = key.keyAlias;
    }
    if (decryptedKeyObject.keyType === 'awsSecretAccessKey') {
      decryptedKeyObject.awsAccessKey = key.awsAccessKey;
    }
    if (decryptedKeyObject.keyType === 'dockerPassword') {
      decryptedKeyObject.dockerUsername = key.dockerUsername;
    }
    if (decryptedKeyObject.keyType === 'azurePass') {
      decryptedKeyObject.azureUser = key.azureUser;
      decryptedKeyObject.azureTenant = key.azureTenant;
    }
    decryptedKeys.push(decryptedKeyObject);
  });
  res.locals.userData.keys = decryptedKeys;
  return next();
}

dbController.encryptKey = (req, res, next) => {
  const { key } = req.body;
  const iv = crypto.randomBytes(8).toString('hex');
  let cipher = crypto.createCipheriv('aes-256-cbc', cryptoKey, iv);
  let encrypted = cipher.update(key, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  res.locals.encryptedKeyPair = { encryptedKey: encrypted, cryptoIV: iv };
  return next();
}

dbController.storeKey = (req, res, next) => {
  const { username, keyAlias } = req.body;
  const { encryptedKey, cryptoIV } = res.locals.encryptedKeyPair;
  const encryptedKeyObject = {
    keyType: req.body.keyType,
    encryptedKey,
    cryptoIV,
    keyAlias,
  };

  if (encryptedKeyObject.keyType === 'awsSecretAccessKey') {
    encryptedKeyObject.awsAccessKey = req.body.awsAccessKey;
  }
  if (encryptedKeyObject.keyType === 'dockerPassword') {
    encryptedKeyObject.dockerUsername = req.body.dockerUsername;
  }
  if (encryptedKeyObject.keyType === 'azurePass') {
    encryptedKeyObject.azureUser = req.body.azureUser;
    encryptedKeyObject.azureTenant = req.body.azureTenant;
  }

  User.findOneAndUpdate({ username }, { $push: { keys: encryptedKeyObject } }, { new: true }, function (err, response) {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dbController.storeKey | ERROR: ", `${err}`);
      return next(err);
    } else {
      res.locals.keys = response.keys;
      return next();
    }
  });
}


dbController.deleteUserFiles = (req, res, next) => {
  fs.rmdir(`users/${req.body.username}`, { recursive: true }, function (err, response) {
    if (err) {
      console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dbController.deleteUserFiles | ERROR: ", `${err}`)
    } else {
      return next();
    }
  })
}

module.exports = dbController;
