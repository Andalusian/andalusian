import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import FileDropzone from "./FileDropzone.jsx"
import DockerCredentials from './DockerCredentials.jsx';
import axios from "axios";

// const exec = require('child_process').exec;
const DockerSetup = props => {
    function containerSetup() {
        axios
        .post('/docker/containerSetup', {
            runtimeEnv: props.runtimeEnv,
            workDir: props.workDir,
            runtimeCom: props.runtimeCom,
            exposePort: props.exposePort,
            com: props.com,
            username: props.username,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function defaultSetup() {
        axios
        .post('/docker/defaultSetup', {username: props.username,})
        .then((response) => {console.log(response);})
        .catch((error) => {console.log(error);})
    }

    function funcSetup() {
        axios
        .post('/docker/funcSetup', {
            code: props.code,
            functionName: props.functionName,
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function buildImage() {
        axios
        .post('/docker/buildImage', {
            username: props.username,
            functionName: props.functionName,
        })
        .then((response) => {console.log(response);})
        .catch((error) => {console.log(error);})
    }

    function dockerDirect(){
        axios
          .post('/docker/dockerDirect', {
            files: props.uploadedFiles,
            username: props.username,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          })
      }

    function deployDocker() {
        axios
        .post('/docker/deployDocker', {
            functionName: props.functionName,
        })
        .then((response) => {console.log(response);})
        .catch((error) => {console.log(error);})
    }
    function stopDocker() {
        axios
        .post('/docker/stopDocker', {
            functionName: props.functionName,
            username: props.username,
        })
        .then((response) => {console.log(response);})
        .catch((error) => {console.log(error);})
    }
    function dockerHubDeploy() {
        axios
        .post('/docker/dockerHubDeploy', {
            repository: props.repository,
            functionName: props.functionName,
        })
        .then((response) => {console.log(response);})
        .catch((error) => {console.log(error);})
    }

    return (
        <React.Fragment>
            <h2>Docker</h2>
            <DockerCredentials dockerUsername={props.dockerUsername} dockerPassword={props.dockerPassword} updateInfo={props.updateInfo} handleSubmitKey={props.handleSubmitKey} />
            <pre>
                <h4>Container Setup</h4>
                <input
                    type="text"
                    name="runtimeEnv"
                    placeholder="FROM"
                    onChange={e => props.updateInfo(e.target.name, e.target.value)}
                />
                <input
                    type="text"
                    name="workDir"
                    placeholder="WORKDIR"
                    onChange={e => props.updateInfo(e.target.name, e.target.value)}
                />
                <input
                    type="text"
                    name="runtimeCom"
                    placeholder="RUN"
                    onChange={e => props.updateInfo(e.target.name, e.target.value)}
                />
                <input
                    type="text"
                    name="exposePort"
                    placeholder="EXPOSE"
                    onChange={e => props.updateInfo(e.target.name, e.target.value)}
                />
                <input
                    type="text"
                    name="com"
                    placeholder="CMD [string, ...]"
                    onChange={e => props.updateInfo(e.target.name, e.target.value)}
                />
                <div>
                    <button onClick={() => containerSetup()}>Set Dockerfile</button>
                    <button onClick={() => defaultSetup()}>Default Dockerfile</button>
                </div>
                <div>
                <input onChange={(e) => props.updateInfo('functionName', e.target.value)} type="text" name="functionName" placeholder="Function Name" />
                <MyDropzone uploadedFunction={props.uploadedFunction} updateInfo={props.updateInfo} />
                <FileDropzone uploadedFiles={props.uploadedFiles} updateInfo={props.updateInfo} pageSelect={props.pageSelect} />
                <button onClick={() => funcSetup()}>Set Function</button>
                <button onClick={() => dockerDirect()}>Setup Directory</button>
                <button onClick={() => buildImage()}>Build Image</button>
                </div>
                <button onClick={() => deployDocker()}>Containerize</button>
                <button onClick={() => stopDocker()}>Stop and Delete</button>
                <div>
                    <div>
                        <input
                        type="text"
                        name="respository"
                        placeholder="Paste Docker Hub Repository and Tag Here"
                        onChange={e => props.updateInfo('repository', e.target.value)}
                        />
                        <button onClick={() => dockerHubDeploy()}>Deploy to Docker Hub</button>
                    </div>

                </div>
            </pre>
        </React.Fragment>
    )


}

export default DockerSetup;