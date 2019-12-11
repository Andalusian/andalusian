const fs = require("fs-extra");
const path = require('path');
const { exec } = require("child_process");
const dockerController = {};



//DON'T FORGET TO UPDATE FILEPATHS FOR CONTROLLERS!!!!


dockerController.containerSetup = (req, res, next) => {
    let dockerfileSetup = ''
    if(req.body.runtimeEnv !== ''){
        dockerfileSetup = dockerfileSetup + `FROM ${req.body.runtimeEnv} \n \n`
    }
    if(req.body.workDir !== ''){
        dockerfileSetup = dockerfileSetup + `WORKDIR ${req.body.workDir} \n \n`
    }
    if(req.body.runtimeCom !== ''){
        dockerfileSetup = dockerfileSetup + `RUN ${req.body.runtimeCom} \n \n`
    }
    if(req.body.exposePort !== ''){
        dockerfileSetup = dockerfileSetup + `EXPOSE ${req.body.exposePort} \n \n`
    }
    if(req.body.com !== ''){
        dockerfileSetup = dockerfileSetup + `CMD ${req.body.com} \n \n`
    }
    exec(`cd users/${req.body.username}/docker/tmp; touch Dockerfile; echo "${dockerfileSetup}" >> Dockerfile; wait`),
    ['shell'], function(err, stdout, stderr){
    console.log(err || stdout || stderr)
    }
    next();
}

dockerController.defaultSetup = (req, res, next) => {
    exec(`cd users/${req.body.username}/docker/tmp; touch Dockerfile; echo "FROM node:10 \n \n WORKDIR /usr/src/app \n \n COPY package*.json ./ \n \n RUN npm install \n \n COPY . . \n \n EXPOSE 3000 \n \n CMD ['npm', 'start']" >> Dockerfile; wait`, 
    ['shell'], function(err, stdout, stderr){
    console.log(err || stdout || stderr)
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
        fs.mkdirSync(path.join(__dirname, `../../users/${req.body.username}/docker/tmp/${dir}`), { recursive: true }, err => {
            console.log(err)
        })
        var newPath = path.join(__dirname, `../../users/${req.body.username}/docker/tmp/${metadata[y].path}`);
        fs.writeFileSync(newPath, `${text[y]}`, function (err, data) {});
    }
} 

dockerController.buildImage = (req, res, next) => {
    exec(`cd users/${req.body.username}/docker/tmp; ls; docker image build -t ${req.body.functionName} .; wait; docker image ls`,
    ['shell'], function(err, stdout, stderr){
        // console.log(req.body.functionName)
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
}

dockerController.deleteContainers = (req, res, next) => {
    exec(`docker system prune -a -f;`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
    exec(`rm -rfv users/${req.body.username}/docker/tmp/*;`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
}

dockerController.dockerHubDeploy = (req, res, next) => {
    exec(`docker tag ${req.body.functionName} ${req.body.repository}; docker push ${req.body.repository}`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
}

dockerController.dockerLogin = (req, res, next) => {
    // console.log(req)
    exec(`docker login -u ${req.body.dockerUsername} -p ${req.body.dockerPassword}`, ['shell'], function(err, stdout, stderr){
        console.log(err || stdout || stderr)
    })
}
module.exports = dockerController;