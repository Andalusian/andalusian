const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Connect to Mongo
const { mongo_uri } = require('../../config');
mongoose.connect(mongo_uri, { newUrlParser: true, useUnifiedTopology: true});

// Define User Schemas
const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  googleKey: String,
  awsAccessKey: String,
  awsSecret: String,
});

module.exports = mongoose.model('User', userSchema, 'users');