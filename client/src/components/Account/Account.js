import React, { Component } from "react";
// import auth from "../../utils/auth";

import Nav from "../Nav/Nav";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Nav handleSignout={this.props.handleSignout} />
        <h1>Account</h1>
      </div>
    );
  }
}

export default Account;
