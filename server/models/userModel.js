const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to Mongo
const { mongo_uri } = require('../../config');
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(() => {
  console.log('Connected to database!');
})
.catch(error => {
  console.log('Connection failed!');
  console.log(error);
});
;

mongoose.Promise = global.Promise;


// Define User Schemas
const userSchema =
  // async () => {
  new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    keys: [{
      keyAlias: String,
      keyType: String,
      encryptedKey: String,
      cryptoIV: String,
      awsAccessKey: String,
      dockerUsername: String,
        azureUser: String,
        azureTenant: String,
    }],
  });
// }

module.exports = mongoose.model('User', userSchema, 'users');
