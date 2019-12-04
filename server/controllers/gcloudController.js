const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const gcloudController = {};

gcloudController.authUser = (req, res, next) => {
  // VARIABLES
  const { key_file, project } = req.body;

  console.log(
    `Key File: ${key_file}`
  )

  // BUILD KEYFILE
  fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/keyfile.json'), key_file);

  // AUTHORIZE USER
  exec(`gcloud auth activate-service-account --key-file ${path.join(__dirname, '../platforms/gcloud/keyfile.json')} --project=${project} --quiet`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
    return next();
  });
}

gcloudController.deploy = (req, res, next) => {
  // VARIABLES
  const { fn_name, runtime, fn, project } = req.body;
  const runTimes = new Set(['nodejs8', 'nodejs10', 'python37', 'go111', 'go113']);

  console.log(
    `Function Name: ${fn_name}\n\n
    Runtime: ${runtime}\n\n
    Function: ${fn}\n\n
    Project: ${project}\n\n`
  )

  // SANITIZATION
  // RUNTIME
  if (!runTimes.has(runtime)) {
    return res.status(400).json('Improper runtime');
  }
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }
  // PROJECT
  if (!project) {
    return res.status(400).json('No Project Given');
  }

  // BUILD FUNCTION FILE
  if (runtime === 'nodejs8' || runtime === 'nodejs10') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/function.js'), fn);
  } else if (runtime === 'python37') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/function.py'), fn);
  } else if (runtime === 'go111' || runtime === 'go113') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/function.go'), fn);
  }

  // DEPLOY MICROFUNCTION
  exec(`gcloud functions deploy ${fn_name} --runtime ${runtime} --project ${project} --source ${path.join(__dirname, ('../platforms/gcloud/'))} --trigger-http --format=json --quiet`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }

    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    res.locals.endpoint = { endpoint: JSON.parse(stdout).httpsTrigger.url };
    return next();
  });
}

module.exports = gcloudController;