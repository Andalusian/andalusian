import React from 'react';
import Signout from './Signout.jsx';

const Header = (props) => {
  return (
    <header id="headerGrid" className="grid">
      <div id="iconHolder"></div>
      <h1 id="andalusianTitle">Andalusian</h1>
      {props.isLogin && !props.isSignup && (
        <Signout
          handleSignout={props.handleSignout}
        />
      )}
    </header>
  )
}

export default Header;