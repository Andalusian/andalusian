const fs = require("fs");
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

dockerController.buildImage = (req, res, next) => {
    exec(`cd server/platforms/docker/live; docker image build -t dockertest .; wait; docker image ls`,
    ['shell'], function(err, stdout, stderr){
       console.log(err || stdout || stderr)
   })
   next();
}

dockerController.dockerDirect = (req, res, next) => {
    console.log(req.body)
    let files = req.body.files;
    for(let i = 0; i < files.length; i++){
        console.log(files[i], 'files')
        fs.readFile(files[i].path, function (err, data) {
            console.log(files[i].path)
            var newPath = `server/platforms/docker/live/${files[i].path}`;
            console.log(newPath, 'newPath')
            // fs.writeFileSync(newPath, data, function (err) {
            //     if(err){
            //   console.log('Unable to Upload')
            //     }
            //     next();
            // });
          });
}}     

dockerController.deployDocker = (req, res, next) => {

    
    exec(`docker create -t -i dockertest bash; wait; docker start -a -i dockertest`, ['shell'], function(err, stdout, stderr){
            console.log(err || stdout || stderr)
        })
    
  next();
}
// exec(`mv server/platforms/docker/live/* server/platforms/docker/cache/`, ['shell'], function(err, stdout, stderr){
//         console.log(err || stdout || stderr)
//     })
module.exports = dockerController;