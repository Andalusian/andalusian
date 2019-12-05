const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const gcloudController = {};

// AUTHENTICATE THE USER
gcloudController.authUser = (req, res, next) => {
  // VARIABLES
  const { key_file, project } = req.body;

  // BUILD KEYFILE
  fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/keyfile.json'), key_file);

  // AUTHORIZE USER
  exec(`gcloud auth activate-service-account --key-file ${path.join(__dirname, '../platforms/gcloud/keyfile.json')} --project=${project} --quiet`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);
    return next();
  }); 
}

// DEPLOY THE FUNCTION
gcloudController.deploy = (req, res, next) => {
  // VARIABLES
  const { fn_name, runtime, fn, project } = req.body;
  const runTimes = new Set(['nodejs8', 'nodejs10', 'python37', 'go111', 'go113']);

  // SANITIZATION
  // RUNTIME
  if (!runTimes.has(runtime)) {
    return res.status(400).json('Improper runtime');
  }
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }
  // PROJECT
  for (let i = 0; i < project.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(project[i])) return res.status(400).json('Project Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }
  

  // BUILD FUNCTION FILE
  if (runtime === 'nodejs8' || runtime === 'nodejs10') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/function.js'), fn);
  } else if (runtime === 'python37') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/function.py'), fn);
  } else if (runtime === 'go111' || runtime === 'go113') {
    fs.writeFileSync(path.join(__dirname, '../platforms/gcloud/function.go'), fn);
  }

  // DEPLOY FUNCTION FILE
  exec(`gcloud functions deploy ${fn_name} --runtime ${runtime} --project ${project} --source ${path.join(__dirname, ('../platforms/gcloud/'))} --trigger-http --format=json --quiet`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    // RESPOND WITH ENDPOINT
    res.locals.endpoint = {endpoint: JSON.parse(stdout).httpsTrigger.url};
    return next();
  });
}

// GET FUNCTIONS ASSOCIATED WITH THE PROJECT
gcloudController.list = (req, res, next) => {
  exec(`gcloud functions list --format=json`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    // PARSE RESPONSE
    const response = JSON.parse(stdout);

    // PARSE OUT FUNCTION NAMES INTO AN ARRAY
    const fn_list = [];
    for (let i = 0; i < response.length; i++) {
      fn_list.push(response[i].entryPoint);
    }

    // RESPOND WITH FUNCTION LIST
    res.locals.list = { fn_list };
    return next();
  });
}

// DELETE FUNCTION
gcloudController.deleteFunction = (req, res, next) => {
  // VARIABLES
  const { fn_name } = req.body;

  // SANITATION
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }

  // EXECUTE GCLOUD COMMAND
  exec(`gcloud functions delete ${fn_name} --quiet`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    // RESPOND WITH 200 STATUS
    return next();
  });
}

// CALL FUNCTION
gcloudController.callFunction = (req, res, next) => {
  // VARIABLES
  const { fn_name } = req.params;

  // SANITATION
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }

  exec(`gcloud functions call ${fn_name}`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    // RESPOND WITH 200 STATUS
    return next();
  });
}

// GET INFORMATION ABOUT FUNCTION
gcloudController.getinformation = (req, res, next) => {
  // VARIABLES
  const { fn_name } = req.params;

  // SANITATION
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }

  // EXECUTE THE GCLOUD COMMAND
  exec(`gcloud functions describe ${fn_name} --format=json`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`exec error: ${error}`);
      return res.sendStatus(500);
    }
    console.error(`stderr: ${stderr}`);
    console.log(`stdout: ${stdout}`);

    // PARSE RESPONSE
    const response = JSON.parse(stdout);

    // PARSE RELEVANT INFORMATION INTO AN OBJECT
    const fn_info = {
      availableMemory: `${response.availableMemoryMb}Mb`,
      endpoint: response.httpsTrigger.url,
      runtime: response.runtime,
      status: response.status,
      timeout: response.timeout,
      version: response.versionId,
    };

    // RESPOND WITH FUNCTION INFORMATION
    res.locals.info = { fn_info };
    return next();
  });
}

// GET FUNCTION SOURCE CODE
gcloudController.getCode = (req, res, next) => {
  const { fn_name } = req.params;

  exec(`gcloud functions `, (error, stdout, stderr) => {

  });
}

module.exports = gcloudController;