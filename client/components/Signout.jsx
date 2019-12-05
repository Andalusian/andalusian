import React from "react";

const Signout = props => {
    return (
        <button type="button" onClick={props.handleSignout}>Sign Out</button>
    );
};

export default Signout;
