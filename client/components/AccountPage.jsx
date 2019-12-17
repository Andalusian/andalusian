import React from "react";
import AWSCurrentFunctions from './AWSCurrentFunctions.jsx';


const AccountPage = props => {

    return (
        <React.Fragment>
            <h2>Account Overview</h2>
            <h3>GCloud</h3>
            <select className="keySelection" name="googleKeyAlias" onChange={e => props.updateInfo(e.target.name, e.target.value)} >
                <option defaultValue=''> -- select project -- </option>
                {
                    props.keys.map((key, i) => {
                        return (
                            <option key={i} value={key.keyAlias} >{key.keyAlias}</option>
                        )
                    })
                }
            </select>
            <h3>AWS</h3>
            <select id="awsRegion" name="awsRegion" onChange={function (e) {
                props.updateInfo(e.target.name, e.target.value);
                // props.configureAWS();
                // props.listFunctions();
                setTimeout(() => props.configureAWS(), 1000)
                // setTimeout(() => props.listFunctions(), 2000);
            }} >
                {/* <option defaultValue={"us-east-1"}>-- select region --</option> */}
                <option defaultValue="us-east-1">US East 1</option>
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
            {props.shortCurrentFunctions}
            <h3>Azure</h3>
        </React.Fragment>
    );
};

export default AccountPage;