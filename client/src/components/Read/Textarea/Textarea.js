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
        <textarea
          id="textarea"
          defaultValue="A number of senior Iranian officials have contracted the virus. Among the latest is the head of the emergency medical services, Pirhossein Kolivand.

Twenty-three of the 290 members of parliament have also tested positive.

"
        ></textarea>
        <button onClick={() => this.props.handleSubmit()}>Submit</button>
      </div>
    );
  }
}

export default Textarea;
