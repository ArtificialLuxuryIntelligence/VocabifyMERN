import React, { Component } from "react";
import "./Textreader.css";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

class Textreader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Reader</h2>
        <button onClick={() => this.props.handleNewText()}>New text</button>
        <div>
          <p className="text-wrap">
            <SpannerComponent
              handleSpanClick={this.props.handleSpanClick}
              randomString={this.props.fullText}
            ></SpannerComponent>{" "}
          </p>
        </div>
      </div>
    );
  }
}

const SpannerComponent = props => {
  const { randomString } = props;

  return randomString.split(" ").map((stringPart, index) => {
    return (
      <React.Fragment>
        {/* {index === 0 ? null : <span>,</span>} */}
        <span onClick={e => props.handleSpanClick(e)}>{stringPart}&nbsp;</span>
      </React.Fragment>
    );
  });
};

export default Textreader;
