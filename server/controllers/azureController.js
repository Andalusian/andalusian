const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const azureController = {};

azureController.createProj = (req, res, next) => {
    const { projectName, runtime } = req.body;
    const runtimes = new Set(['--dotnet', '--node', '--python', '--powershell']);

    if (!runtimes.has(runtime)) {
        return res.status(400).json('Improper runtime');
    }

    for (let i = 0; i < projectName.length; i++) {
        if (!/[a-z0-9A-Z-_]/gm.test(projectName[i])) return res.status(400).json('Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
    }

    if (!projectName) {
        return res.status(400).json('Name Your Project');
    }

    exec(`func init ${projectName} ${runtime}`, {cwd: './server/platforms/azure'}, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.sendStatus(500);
        }

        console.error(`stderr: ${stderr}`);
        console.log(`stdout: ${stdout}`);

        return next();
    })
}

azureController.createFunc = (req, res, next) => {
    const { projectName, template, functionName } = req.body;
    const templates = new Set(['Blob Trigger', 'Cosmos DB Trigger', 'HTTP Trigger', 'Event Grid Trigger', 'Queue Trigger', 'SendGrid', 'Service Bus Queue Trigger', 'Service Bus Topic Trigger', 'Timer Trigger']);

    if (!templates.has(template)) {
        return res.status(400).json('Improper template')
    }

    for (let i = 0; i < functionName.length; i++) {
        if (!/[a-z0-9A-Z-_]/gm.test(functionName[i])) return res.status(400).json('Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
    }

    if (!functionName) {
        return res.status(400).json('Name your function')
    }

    exec(`func new --template "${template}" --name ${functionName}`, {cwd: `./server/platforms/azure/${projectName}`}, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.sendStatus(500);
        }

        console.error(`stderr: ${stderr}`);
        console.log(`stdout: ${stdout}`);

        return next();
    })

}

azureController.deployFunc = (req, res, next) => {
    console.log('in deploy')
    const { projectName, app } = req.body;

    for (let i = 0; i < projectName.length; i++) {
        if (!/[a-z0-9A-Z-_]/gm.test(projectName[i])) return res.status(400).json('Name formatted incorrectly.\nMust only contain letters, numbers, underscores, and hyphens.');
    }

    if (!projectName) {
        return res.status(400).json('Must provide app name')
    }

    console.log('past the guards')
    exec(`func azure functionapp publish ${app}`, {cwd: `./server/platforms/azure/${projectName}`}, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.sendStatus(500);
        }

        console.error(`stderr: ${stderr}`);
        console.log(`stdout: ${stdout}`);

        return next();
    })
}


module.exports = azureController;
