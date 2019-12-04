const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to Mongo
const { mongo_uri } = require('../../config');
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

mongoose.Promise = global.Promise;


// Define User Schemas
const userSchema =
  // async () => {
  new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    keys: [{
      keyType: String,
      encryptedKey: String,
      cryptoIV: String,
      awsAccessKey: String,
      dockerUsername: String,
    }],
  });
// }

module.exports = mongoose.model('User', userSchema, 'users');