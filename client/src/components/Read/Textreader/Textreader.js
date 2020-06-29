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
        {/* <h2>Reader</h2> */}
        <button onClick={() => this.props.handleNewText()}>New text</button>
        <div className="text-reader">
          {this.props.unknownWords.length < 5 && (
            <>
              <p> We don't yet have enough words to estimate your level. </p>
              <h3> Level finder:</h3>
              <ul>
                <li>
                  <p>
                    Click on any word in the list below to look up its
                    definition.
                  </p>
                </li>
                <li>
                  <p>
                    Click "add" to add a word to your personal vocabulary list.
                    You can see and edit these words in 'Account'.
                  </p>
                </li>

                <li>
                  <p> Please add 5 words to get started.</p>
                </li>
                <li>
                  <p>
                    As you continue to use Vocabify, it will get better at
                    guessing the words you don't know.
                  </p>
                </li>
                <li>
                  <p>
                    If you know all the words listed, then feel free to use the
                    search bar to add words you have learned recently.
                  </p>
                </li>
              </ul>
              <p>
                Tip: In the words sidebar, you can click on words and parts of
                speech to expand and collapse definitions.
              </p>

              <p className="alert-message" key={this.props.unknownWords}>
                Words left to add: {5 - this.props.unknownWords.length}
              </p>
              <hr></hr>
            </>
          )}
          <Spanner
            handleSpanClick={this.props.handleSpanClick}
            randomString={this.props.fullTextSplit[this.props.pageNumber]}
          ></Spanner>
        </div>

        <div className="reader-buttons">
          <button onClick={this.props.handlePrevPage}>prev</button>
          <button onClick={this.props.handleNextPage}>next </button>
        </div>

        <p>
          Page {this.props.pageNumber + 1} of {this.props.fullTextSplit.length}
        </p>
      </div>
    );
  }


  componentDidUpdate(prevProps) {
   

    if (this.props.lang !== prevProps.lang) {
      // redirectToRead();
      console.log("uh oh");
      this.props.handleNewText()
    }
  }

}

export default Textreader;
