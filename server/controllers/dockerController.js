// const fs = require("fs");
const path = require('path');
const { exec } = require("child_process");
const dockerController = {};


dockerController.containerSetup = (req, res, next) => {
    exec(`cd server/platforms/docker/live; touch Dockerfile; echo "FROM ${req.body.runtimeEnv} \n \n WORKDIR ${req.body.workDir} \n \n COPY package*.json ./ \n \n RUN ${req.body.runtimeCom} \n \n COPY . . \n \n EXPOSE ${req.body.exposePort} \n \n CMD ${req.body.com}" >> Dockerfile; wait`, 
    ['shell'], function(err, stdout, stderr){
    console.log(err || stdout || stderr)
    })
    next();
}

dockerController.defaultSetup = (req, res, next) => {
    exec(`cd server/platforms/docker/live; touch Dockerfile; echo "FROM node:10 \n \n WORKDIR /usr/src/app \n \n COPY package*.json ./ \n \n RUN npm install \n \n COPY . . \n \n EXPOSE 3000 \n \n CMD ['npm', 'start']" >> Dockerfile; wait`, 
    ['shell'], function(err, stdout, stderr){
    console.log(err || stdout || stderr)
    })
    next();
}

dockerController.funcSetup = (req, res, next) => {
    exec(`cd server/platforms/docker/live; touch ${req.body.functionName}.js; echo "${req.body.code}" >> ${req.body.functionName}.js; wait`, 
        ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
        })
    next();
}

dockerController.deployDocker = (req, res, next) => {
    // exec(`cd server/platforms/docker/live; docker image build -t ${req.body.functionName} .; wait; docker container run --publish 3001:3001 --detach --name ${req.body.functionName}`, ['shell'], function(err, stdout, stderr){
    //     console.log(err || stdout || stderr)
    // })
    
    exec(`cd server/platforms/docker/live; docker container ls`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
    
    // exec(`docker container run test`, ['shell'], function(err, stdout, stderr){
    //         console.log(err || stdout || stderr)
    //     })
    
  next();
}
// exec(`mv server/platforms/docker/live/* server/platforms/docker/cache/`, ['shell'], function(err, stdout, stderr){
//         console.log(err || stdout || stderr)
//     })
module.exports = dockerController;