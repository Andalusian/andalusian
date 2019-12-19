import React from 'react';
import Signout from './Signout.jsx';
const logo = require('./../../logo.png')
const andalname = require('./../../andalusianname.png')

const Header = (props) => {


  return (
    <header id="headerGrid" className="grid">
      <img id="myLogo" src={logo} />
      {/*<img id="andalusianname" src={andalname}></img>*/}
      <div id="andalusianname" >Andalusian</div>
      {props.isLogin && !props.isSignup && (
        <Signout
          handleSignout={props.handleSignout}
        />
      )}
    </header>
  )
}

export default Header;
