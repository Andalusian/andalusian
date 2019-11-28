const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  googleKey: String,
  awsAccessKey: String,
  awsSecret: String,
});

module.exports = mongoose.model('User', userSchema, 'users');