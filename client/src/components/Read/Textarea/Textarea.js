import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

class Textarea extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div>
        <h2>Textarea</h2>
        <textarea id="textarea" defaultValue="Just a bit of text"></textarea>
        <button onClick={() => this.props.handleSubmit()}>Submit</button>
      </div>
    );
  }
}

export default Textarea;
