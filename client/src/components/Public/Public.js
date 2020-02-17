import React, { Component } from "react";
// import auth from "../../utils/auth";
import axios from "axios";

class Public extends Component {
  constructor(props) {
    super(props);
    this.state = { message: " no message" };
  }

  componentDidMount() {
    let token = JSON.parse(localStorage.getItem("vocabify")).token;
    axios.post("/api/protected", { token }).then(res => {
      console.log(res.data.message);
      this.setState({ message: res.data.message });
    });
  }

  render() {
    return (
      <div>
        <h1>Public</h1>
        <h2>This is a public page</h2>
        <p>
          {" "}
          If you aren't logged in, then you won't see any information here.
        </p>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Public;
