import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

class Textarea extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Textarea</h2>
        <textarea
          id="textarea"
          defaultValue="Welcome to the MDN learning area. This set of articles aims to provide complete beginners to web development with all that they need to start coding websites.

"
        ></textarea>
        <button onClick={() => this.props.handleSubmit()}>Submit</button>
      </div>
    );
  }
}

export default Textarea;
