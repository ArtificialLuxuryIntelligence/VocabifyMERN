import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import axios from "axios";
// import auth from "../../utils/auth";

import Nav from "../Nav/Nav";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Nav handleSignout={this.props.handleSignout} />
        <h1>Home</h1>
        {/* data passed from  function such as: 
        history.push("/", { passedData: "I am the from the login page" });
         */}
        {/* <p> {this.props.location.state.passedData}</p> */}
      </div>
    );
  }
}

export default Home;
