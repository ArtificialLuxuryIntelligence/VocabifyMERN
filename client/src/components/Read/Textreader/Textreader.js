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
      <div className="textreader">
        <h2>Reader</h2>
        <button onClick={() => this.props.handleNewText()}>New text</button>
        <div className="text-reader">
          <Spanner
            handleSpanClick={this.props.handleSpanClick}
            randomString={this.props.fullTextSplit[this.props.pageNumber]}
          ></Spanner>
        </div>

        <button onClick={this.props.handlePrevPage}>previous page</button>
        <button onClick={this.props.handleNextPage}>next page</button>
      </div>
    );
  }
}

export default Textreader;
