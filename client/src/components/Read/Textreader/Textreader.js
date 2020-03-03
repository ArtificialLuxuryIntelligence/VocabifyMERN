import React, { Component } from "react";
import "./Textreader.css";

import Spanner from "../../Spanner/Spanner";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

class Textreader extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className={"textreader"}>
        <h2>Reader</h2>
        <button onClick={() => this.props.handleNewText()}>New text</button>
        <div className="text-reader">
          <Spanner
            handleSpanClick={this.props.handleSpanClick}
            randomString={this.props.fullText}
          ></Spanner>
        </div>
      </div>
    );
  }
}

export default Textreader;
