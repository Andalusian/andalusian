const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const gcloudController = {};

// AUTHENTICATE THE USER
gcloudController.authUser = (req, res, next) => {
  // VARIABLES
  const { key_file, project, user_name } = req.body;

  // BUILD KEYFILE
  fs.writeFileSync(path.join(__dirname, `../../users/${user_name}/gcloud/keyfile.json`), key_file);

  // AUTHORIZE USER
  exec(`gcloud auth activate-service-account --key-file ${path.join(__dirname, `../../users/${user_name}/gcloud/keyfile.json`)} --project=${project} --quiet`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.authUser | exec error: ", `${error}`);
      return res.sendStatus(500);
    }
    console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.authUser | stderr: ", `${stderr}`);
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.authUser | stdout: ", `${stdout}`);
    return next();
  });
}

// DEPLOY THE FUNCTION
gcloudController.deploy = (req, res, next) => {
  // VARIABLES
  const { fn_name, runtime, fn, project, user_name } = req.body;
  const runTimes = new Set(['nodejs8', 'nodejs10', 'python37', 'go111', 'go113']);

  // SANITIZATION
  // RUNTIME
  if (!runTimes.has(runtime)) {
    return res.status(400).json('Improper runtime');
  }
  // FUNCTION NAME
  if (typeof fn_name !== 'string' || fn_name.length === 0) return res.status(400).json('No Function Name given.');
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }
  // PROJECT
  if (typeof project !== 'string' || project.length === 0) return res.status(400).json('No Project Name given.');
  for (let i = 0; i < project.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(project[i])) return res.status(400).json('Project Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }
  // USERNAME
  if (typeof user_name !== 'string' || user_name.length === 0) return res.status(400).json('No Username given.');

  // BUILD FUNCTION FILE
  if (runtime === 'nodejs8' || runtime === 'nodejs10') {
    fs.writeFileSync(path.join(__dirname, `../../users/${user_name}/gcloud/function.js`), fn);
  } else if (runtime === 'python37') {
    fs.writeFileSync(path.join(__dirname, `../../users/${user_name}/gcloud/function.py`), fn);
  } else if (runtime === 'go111' || runtime === 'go113') {
    fs.writeFileSync(path.join(__dirname, `../../users/${user_name}/gcloud/function.go`), fn);
  }

  // DEPLOY FUNCTION FILE
  exec(`gcloud functions deploy ${fn_name} --runtime ${runtime} --project ${project} --source ${path.join(__dirname, (`../../users/${user_name}/gcloud/`))} --trigger-http --format=json --quiet`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.deploy | exec error: ", `${error}`);
      return res.sendStatus(500);
    }
    console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.deploy | stderr: ", `${stderr}`);
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.deploy | stdout: ", `${stdout}`);

    // RESPOND WITH 200 STATUS
    return next();
  });
}

// GET FUNCTIONS ASSOCIATED WITH THE PROJECT
gcloudController.list = (req, res, next) => {
  // VARIABLES
  const { user_name } = req.params;

  exec(`gcloud functions list --format=json`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.list | exec error: ", `${error}`);
      return res.sendStatus(500);
    }
    console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.list | stderr: ", `${stderr}`);
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.list | stdout: ", `${stdout}`);

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
  const { fn_name, user_name } = req.body;

  // SANITATION
  // FUNCTION NAME
  if (typeof fn_name !== 'string' || fn_name.length === 0) return res.status(400).json('No Function Name given.');
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }

  // EXECUTE GCLOUD COMMAND
  exec(`gcloud functions delete ${fn_name} --quiet`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.deleteFunction | exec error: ", `${error}`);
      return res.sendStatus(500);
    }
    console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.deleteFunction | stderr: ", `${stderr}`);
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.deleteFunction | stdout: ", `${stdout}`);

    // RESPOND WITH 200 STATUS
    return next();
  });
}

// CALL FUNCTION
gcloudController.callFunction = (req, res, next) => {
  // VARIABLES
  const { fn_name, user_name } = req.params;

  // SANITATION
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }

  exec(`gcloud functions call ${fn_name}`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.callFunction | exec error: ", `${error}`);
      return res.sendStatus(500);
    }
    console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.callFunction | stderr: ", `${stderr}`);
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.callFunction | stdout: ", `${stdout}`);

    // RESPOND WITH 200 STATUS
    return next();
  });
}

// GET INFORMATION ABOUT FUNCTION
gcloudController.getinformation = (req, res, next) => {
  // VARIABLES
  const { fn_name, user_name } = req.params;

  // SANITATION
  // FUNCTION NAME
  for (let i = 0; i < fn_name.length; i++) {
    if (!/[a-z0-9A-Z-_]/gm.test(fn_name[i])) return res.status(400).json('Function Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
  }

  // EXECUTE THE GCLOUD COMMAND
  exec(`gcloud functions describe ${fn_name} --format=json`, (error, stdout, stderr) => {
    // OUTPUT HANDLING
    if (error) {
      console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.getinformation | exec error: ", `${error}`);
      return res.sendStatus(500);
    }
    console.error(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.getinformation | stderr: ", `${stderr}`);
    console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${user_name}`, "| gcloudController.getinformation | stdout: ", `${stdout}`);

    // PARSE RESPONSE
    const response = JSON.parse(stdout);

    // PARSE RELEVANT INFORMATION INTO AN OBJECT
    const fn_info = {
      'Available Memory': `${response.availableMemoryMb}Mb`,
      'Endpoint': response.httpsTrigger.url,
      'Runtime': response.runtime,
      'Status': response.status,
      'Timeout': response.timeout,
      'Version': response.versionId,
    };

    // RESPOND WITH FUNCTION INFORMATION
    res.locals.info = { fn_info, name: response.entryPoint };
    return next();
  });
}

// GET FUNCTION SOURCE CODE
gcloudController.getCode = (req, res, next) => {
  const { fn_name, user_name } = req.params;

  exec(`gcloud functions `, (error, stdout, stderr) => {

  });
}

module.exports = gcloudController;