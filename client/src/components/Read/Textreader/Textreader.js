import React, { Component } from "react";
import "./Textreader.css";

import Spanner from "../../Spanner/Spanner";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

class Textreader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
  }

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

        <div className="reader-buttons">
          <button onClick={this.props.handlePrevPage}>prev</button>
          <button onClick={this.props.handleNextPage}>next </button>
        </div>

        {this.props.unknownWords.length < 5 && (
          <>
            <p>
              {" "}
              Tip: In the words sidebar, you can click on words and parts of
              speech to expand and collapse definitions.
            </p>
            <p className="alert-message" key={this.props.unknownWords}>
              Words left to add: {5 - this.props.unknownWords.length}
            </p>
          </>
        )}
        <p>
          Page {this.props.pageNumber + 1} of {this.props.fullTextSplit.length}
        </p>
      </div>
    );
  }
}

export default Textreader;
