import React from "react";
import MyDropzone from "./MyDropzone.jsx";
import FileDropzone from "./FileDropzone.jsx"
import DockerCredentials from './DockerCredentials.jsx';
import axios from "axios";


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
            .post('/docker/defaultSetup', { username: props.username, })
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
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
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }

    function dockerDirect() {
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
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }
    function stopDocker() {
        axios
            .post('/docker/stopDocker', {
                functionName: props.functionName,
                username: props.username,
            })
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }
    function deleteContainers() {
        axios
            .post('/docker/dockerDeleteContainers', {
                username: props.username,
            })
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }
    function dockerHubDeploy() {
        axios
            .post('/docker/dockerHubDeploy', {
                repository: props.repository,
                functionName: props.functionName,
            })
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }
    function deployImageToAws() {
        axios
            .post('/docker/deployContToAws', {
                username: props.username,
                functionName: props.functionName,
                sshKeyName: props.sshKeyName,
                ec2User: props.ec2User,
                publicDns: props.publicDns,
                awsRepoUri: props.awsRepoUri,
            })
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }
    function connectToEcr() {
        axios
            .post('/docker/connectToEcr', {
                username: props.username,
                functionName: props.functionName,
                sshKeyName: props.sshKeyName,
                ec2User: props.ec2User,
                publicDns: props.publicDns,
                awsRepoUri: props.awsRepoUri,
            })
            .then((response) => { console.log(response); })
            .catch((error) => { console.log(error); })
    }


    return (
        <div id="accountGrid" className="grid">
            <h2 className="container">Docker</h2>
            <div className="leftColumn">
                <DockerCredentials dockerUsername={props.dockerUsername} dockerPassword={props.dockerPassword} updateInfo={props.updateInfo} handleSubmitKey={props.handleSubmitKey} />
            </div>
            <div className="mainColumn container">
                <h3>Container Setup</h3>
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
                    <input onChange={(e) => props.updateInfo('functionName', e.target.value)} type="text" name="functionName" placeholder="Image/Container Name" />
                    <FileDropzone uploadedFiles={props.uploadedFiles} updateInfo={props.updateInfo} pageSelect={props.pageSelect} />
                    {/* <button onClick={() => funcSetup()}>Set Function</button> */}
                    <button onClick={() => dockerDirect()}>Setup Directory</button>
                    <button onClick={() => buildImage()}>Build Image</button>
                    <button onClick={() => deployDocker()}>Containerize</button>
                    <button onClick={() => stopDocker()}>Stop Container</button>
                    <button onClick={() => deleteContainers()}>Delete Containers/Images</button>
                </div>
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

                    <div>
                        <input
                            type="text"
                            name="awsRepoUri"
                            placeholder="Paste ECR Repo URI here"
                            onChange={e => props.updateInfo('awsRepoUri', e.target.value)}
                        />

                        <button onClick={() => connectToEcr()}>Connect to ECR Instance</button>
                        <button onClick={() => deployImageToAws()}>Push to AWS ECR</button>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default DockerSetup;