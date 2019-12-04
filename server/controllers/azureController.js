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

    exec(`func init ${projectName} ${runtime}`, {cwd: './../platforms/azure'}, (error, stdout, stderr) => {
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
