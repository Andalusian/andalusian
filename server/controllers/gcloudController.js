const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const gcloudController = {};

gcloudController.authUser = (req, res, next) => {
  // const { key_file } = req.body;
  // fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/keyfile.json'), JSON.stringify(keyfile));
  // exec(`gcloud functions deploy ${fn_name} --runtime ${runtime} --trigger-http --quiet`);
  next();
}

gcloudController.deploy = (req, res, next) => {
  next();
}

module.exports = gcloudController;