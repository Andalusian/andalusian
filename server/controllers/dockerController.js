const fs = require("fs-extra");
const path = require('path');
const { exec } = require("child_process");
const absolutePath = path.resolve("Relative file path");
const dockerController = {};



//DON'T FORGET TO UPDATE FILEPATHS FOR CONTROLLERS!!!!
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


dockerController.dockerDirect = (req, res, next) => {
    let files = req.body.files;
    let metadata = []
    let text = []
    for(let i = 0; i < files.length/2; i++){
        metadata.push(files[i])
    }
    for(let x = (files.length/2); x < files.length; x++){
        text.push(files[x])
    }
    for(let y = 0; y < metadata.length; y++){
        let dir = metadata[y].path.substring(0, metadata[y].path.lastIndexOf("/") + 1)
        fs.mkdirSync(path.join(__dirname, `../../users/${req.body.username}/docker${dir}`), { recursive: true }, err => {
            console.log(err)
        })
        var newPath = path.join(__dirname, `../../users/${req.body.username}/docker${metadata[y].path}`);
        fs.writeFileSync(newPath, `${text[y]}`, function (err, data) {});
    }
} 

dockerController.buildImage = (req, res, next) => {
    exec(`cd server/platforms/docker/live; docker image build -t ${req.body.functionName} .; wait; docker image ls`,
    ['shell'], function(err, stdout, stderr){
        console.log(req.body.functionName)
       console.log(err || stdout || stderr)
   })
   next();
}

dockerController.deployDocker = (req, res, next) => {
    exec(`docker run -p 8888:80 --name ${req.body.functionName} ${req.body.functionName}; curl docker`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
    
    process.argv.forEach(function (val, index, array) {
        console.log(index + ': ' + val);
      });
  next();
}

dockerController.stopDocker = (req, res, next) => {
    exec(`docker stop ${req.body.functionName}; wait;`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
    exec(`docker system prune -a -f;`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
    exec(`cd server/platforms/docker/live; rm *;`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
}
module.exports = dockerController;