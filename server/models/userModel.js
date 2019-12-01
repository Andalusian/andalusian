const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to Mongo
const { mongo_uri } = require('../../config');
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

// Define User Schemas
const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  googleKey: String,
  cryptoIV: String,
  awsawsAccessKey: String,
  awsSecret: String,
});

module.exports = mongoose.model('User', userSchema, 'users');