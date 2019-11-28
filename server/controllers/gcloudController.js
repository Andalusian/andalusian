const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const gcloudController = {};

gcloudController.authUser = (req, res, next) => {
  // VARIABLES
  const { key_file } = req.body;

  // BUILD KEYFILE
  fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/keyfile.json'), JSON.stringify(keyfile));

  // AUTHORIZE USER
  exec(`gcloud auth activate-service-account --keyfile ${key_file} --quiet`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.sendStatus(400);
    }
    
    console.log(`stdout: ${stdout}`);
    return next();
  }); 
}

gcloudController.deploy = (req, res, next) => {
  // VARIABLES
  const { fn_name, runtime, fn } = req.body;
  const runTimes = new Set(['nodejs8', 'nodejs10', 'python37', 'go111', 'go113']);
  let fileName = '';

  // SANITIZATION
  // RUNTIME
  if (!runTimes.has(runtime)) {
    return res.status(400).json('Improper runtime');
  }
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    fn_name[i]
  }

  // BUILD FUNCTION FILE
  if (runtime === 'nodejs8' || runtime === 'nodejs10') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/microservice.js'), fn);
    fileName = 'microservice.js';
  } else if (runtime === 'python37') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/microservice.py'), fn);
    fileName = 'microservice.py';
  } else if (runtime === 'go111' || runtime === 'go113') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/microservice.go'), fn);
    fileName = 'microservice.go';
  }

  // DEPLOY MICROFUNCTION
  exec(`gcloud functions deploy ${fn_name} --runtime ${runtime} --source ${path.join(__dirname, ('../platforms/gcloud/' + fileName))} --trigger-http --quiet`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.sendStatus(400);
    }
    
    console.log(`stdout: ${stdout}`);
    res.locals.endpoint = stdout.httpsTrigger.url;
    return next();
  });
}

module.exports = gcloudController;