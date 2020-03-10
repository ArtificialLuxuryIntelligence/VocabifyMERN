import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

class Textarea extends Component {
  // constructor(props) {
  //   super(props);
  // }

  renderText = () => {
    switch (this.props.lang) {
      case "en":
        return "English Test";
      case "fr":
        return "French TEST";
      case "es":
        return "spansih TEST";
    }
  };

  render() {
    return (
      <div>
        <h2>Textarea</h2>
        <textarea
          id="textarea"
          defaultValue={
            this.props.unknownWords.length < 5
              ? this.renderText()
              : "Paste your text here"
          }
        ></textarea>
        <button onClick={() => this.props.handleSubmit()}>Submit</button>
      </div>
    );
  }
}

export default Textarea;
