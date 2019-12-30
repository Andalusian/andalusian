import React from "react";
import { useEffect } from 'react';
import AWSCurrentFunctions from './AWSCurrentFunctions.jsx';


const AccountPage = props => {

    useEffect(() => {
        props.listAzure();
    }, [])

    return (
        <div id="accountGrid" className="grid">
            <h2 className="container">Account Overview</h2>
            <div className="container thirdColumn accountDiv">
                <h3>Google Cloud</h3>
                <select id="GKeySelect" className="keySelection" name="googleKeyAlias" onChange={function (e) {
                    props.updateInfo(e.target.name, e.target.value);
                    props.googleListFunctions()
                }} >
                    <option defaultValue=''>select project</option>
                    {
                        props.keys.map((key, i) => {
                            return (
                                <option key={i} value={key.keyAlias} >{key.keyAlias}</option>
                            )
                        })
                    }
                </select>
                {props.googleFunctionNames}
            </div>
            <div className="container thirdColumn accountDiv">
                <h3>AWS</h3>
                // Below dropdown menu (same as the one in AWSCredential.jsx) allows user to select a region and configure the users account with that region.
                <select id="awsRegionAcct" name="awsRegion" onChange={function (e) {
                    props.updateInfo(e.target.name, e.target.value);
                    setTimeout(() => props.configureAWS(), 1000)
                }} >
                    <option defaultValue={"a"}>select region</option>
                    <option value="us-east-1">US East 1</option>
                    <option value="us-east-2">US East 2</option>
                    <option value="us-west-1">US West 1</option>
                    <option value="us-west-2">US West 2</option>
                    <option value="ap-east-1">AP East 1</option>
                    <option value="ap-south-1">AP South 1</option>
                    <option value="ap-northeast-2">AP Northeast 1</option>
                    <option value="ap-southeast-1">AP Southeast 1</option>
                    <option value="ap-southeast-2">AP Southeast 1</option>
                    <option value="ap-northeast-1">AP Northeast 1</option>
                    <option value="ca-central-1">CA Central 1</option>
                    <option value="eu-central-1">EU Central 1</option>
                    <option value="eu-west-1">EU West 1</option>
                    <option value="eu-west-2">EU West 2</option>
                    <option value="eu-west-3">EU West 3</option>
                    <option value="eu-north-1">EU North 1</option>
                    <option value="me-south-1">ME South 1</option>
                    <option value="sa-east-1">SA East 1</option>
                </select>
                // The above triggers configureAWS(), which in itself triggers listFunctions(). Once listFunctions() is ran, shortCurrentFunctions in state will be populated with current function names for that given region, which will be displayed below.
                {props.shortCurrentFunctions}
            </div>
            <div className="container thirdColumn accountDiv">
                <h3>Azure</h3>
                {props.azureNames}
            </div>
        </div>
    );
};

export default AccountPage;
