const fs = require("fs-extra");
const path = require('path');
const { exec } = require("child_process");
const dockerController = {};
const AWS = require("aws-sdk");


    //Generates and writes Dockerfile based on passed down data
dockerController.containerSetup = (req, res, next) => {
    let dockerfileSetup = ''
    if (req.body.runtimeEnv !== '') {
        dockerfileSetup = dockerfileSetup + `FROM ${req.body.runtimeEnv} \n \n`
    }
    if (req.body.workDir !== '') {
        dockerfileSetup = dockerfileSetup + `WORKDIR ${req.body.workDir} \n \n`
    }
    if (req.body.runtimeCom !== '') {
        dockerfileSetup = dockerfileSetup + `RUN ${req.body.runtimeCom} \n \n`
    }
    if (req.body.exposePort !== '') {
        dockerfileSetup = dockerfileSetup + `EXPOSE ${req.body.exposePort} \n \n`
    }
    if (req.body.com !== '') {
        dockerfileSetup = dockerfileSetup + `CMD ${req.body.com} \n \n`
    }
    exec(`cd users/${req.body.username}/docker/tmp; touch Dockerfile; echo "${dockerfileSetup}" >> Dockerfile; wait`),
        ['shell'], function (err, stdout, stderr) {
            console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.containerSetup | ", err || stdout || stderr)
        }
    next();
}

    //Generates 'default' Dockerfile
dockerController.defaultSetup = (req, res, next) => {
    exec(`cd users/${req.body.username}/docker/tmp; touch Dockerfile; echo "FROM node:10 \n \n WORKDIR /usr/src/app \n \n COPY package*.json ./ \n \n RUN npm install \n \n COPY . . \n \n EXPOSE 3000 \n \n CMD ['npm', 'start']" >> Dockerfile; wait`,
        ['shell'], function (err, stdout, stderr) {
            console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.defaultSetup | ", err || stdout || stderr)
        })
    next();
}

// dockerController.funcSetup = (req, res, next) => {
//     exec(`cd users/${req.body.username}/docker/tmp; touch ${req.body.functionName}.js; echo "${req.body.code}" >> ${req.body.functionName}.js; wait`,
//         ['shell'], function(err, stdout, stderr){
//         console.log(err || stdout || stderr)
//         })
//     next();
// }

    //Recreates uploaded files and directory structure in /<username>/docker/tmp
dockerController.dockerDirect = (req, res, next) => {
    let files = req.body.files;
    let metadata = []
    let text = []
    for (let i = 0; i < files.length / 2; i++) {
        metadata.push(files[i])
    }
    for (let x = (files.length / 2); x < files.length; x++) {
        text.push(files[x])
    }
    for (let y = 0; y < metadata.length; y++) {
        let dir = metadata[y].path.substring(0, metadata[y].path.lastIndexOf("/") + 1)
        fs.mkdirSync(path.join(__dirname, `../../users/${req.body.username}/docker/tmp/${dir}`), { recursive: true }, err => {
            console.log(err)
        })
        var newPath = path.join(__dirname, `../../users/${req.body.username}/docker/tmp/${metadata[y].path}`);
        fs.writeFileSync(newPath, `${text[y]}`, function (err, data) { });
    }
}

    //Builds Docker image from data uploaded to the /<username>/docker/tmp directory
dockerController.buildImage = (req, res, next) => {

    exec(`cd users/${req.body.username}/docker/tmp; ls; docker image build -t ${req.body.functionName} .; wait; docker image ls`,
        ['shell'], function (err, stdout, stderr) {
            console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.buildImage | ", err || stdout || stderr)
        })
    next();
}

    //Containerizes and runs active image locally on port 8888
dockerController.deployDocker = (req, res, next) => {
    // JOURDAN TO PULL USERNAME
    exec(`docker run -p 8888:80 --name ${req.body.functionName} ${req.body.functionName}; curl docker`, ['shell'], function (err, stdout, stderr) {
        console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.deployDocker | ", err || stdout || stderr)
    })

    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
    });
    next();
}

    //Stops locally running container
dockerController.stopDocker = (req, res, next) => {
    exec(`docker stop ${req.body.functionName}; wait;`, ['shell'], function (err, stdout, stderr) {
        console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.stopDocker | ", err || stdout || stderr)
    })
}

    //Deletes all images and containers on system
dockerController.deleteContainers = (req, res, next) => {
    exec(`docker system prune -a -f;`, ['shell'], function (err, stdout, stderr) {
        console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.deleteContainers 1 | ", err || stdout || stderr)
    })
    exec(`rm -rfv users/${req.body.username}/docker/tmp/*;`, ['shell'], function (err, stdout, stderr) {
        console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.deleteContainers 2 | ", err || stdout || stderr)
    })
}
    //Deploys active image to supplied Docker Hub repository
dockerController.dockerHubDeploy = (req, res, next) => {
    exec(`docker tag ${req.body.functionName} ${req.body.repository}; docker push ${req.body.repository}`, ['shell'], function (err, stdout, stderr) {
        console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.dockerHubDeploy | ", err || stdout || stderr)
    })
}

    //Logs the user into the Docker Daemon
dockerController.dockerLogin = (req, res, next) => {
    exec(`docker login -u ${req.body.dockerUsername} -p ${req.body.dockerPassword}`, ['shell'], function (err, stdout, stderr) {
        console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.dockerLogin | ", err || stdout || stderr)
    })
}

    //Verifies ECR login credentials and establishes a connection to the supplied ECR repository URI
dockerController.connectToEcr = (req, res, next) => {
    AWS.config.loadFromPath(`users/${req.body.username}/aws/credentials.json`);
    const ecr = new AWS.ECR();
    var params = {
        registryIds: [
        '691202161934',
        ]
    };
    ecr.getAuthorizationToken(params, function(err, data) {
      let text
      let connectUri
        if (err) console.log(err, err.stack);
        else {
          let data64 = data.authorizationData[0].authorizationToken;
          connectUri = data.authorizationData[0].proxyEndpoint
          let buff = new Buffer(data64, 'base64')
          text = buff.toString('ascii');
          text = /:(.+)/.exec(text)[1];
          console.log(text); 

              exec(`docker login -u AWS --password ${text} ${connectUri};`, ['shell'], function (err, stdout, stderr) {
                console.log(err || stdout || stderr)
              })
        };
    })
}

    //Deploys active image to supplied ECR repository URI
dockerController.deployContToAws = (req, res, next) => {

    exec(`docker tag ${req.body.functionName} ${req.body.awsRepoUri}; docker push ${req.body.awsRepoUri}`, ['shell'], function (err, stdout, stderr) {
            console.log(err || stdout || stderr)
        })
}
module.exports = dockerController;