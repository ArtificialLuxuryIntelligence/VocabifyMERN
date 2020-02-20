import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import Nav from "../Nav/Nav";
import RandomWord from "../RandomWord/RandomWord";
import WordDef from "../WordDef/WordDef";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null
    };
  }

  handleSpanClick = e => {
    let word = this.props.sanitizeText(e.target.innerText)[0];
    this.setState({ searchWord: word });
  };
  render() {
    return (
      <div>
        <Nav handleSignout={this.props.handleSignout} />
        <h1>Home</h1>
        <h2>Here is a word you might not know:</h2>
        <RandomWord
          vocabSize={this.props.vocabSize}
          handleSpanClick={this.handleSpanClick}
          getDefinitions={this.props.getDefinitions}
          addKnownWord={this.props.addKnownWord}
          addUnknownWord={this.props.addUnknownWord}
          removeWord={this.props.removeWord}
          unknownWords={this.props.unknownWords}
          addToAppState={this.props.addToAppState}
        />

        <div>
          {this.state.searchWord !== null && (
            <>
              <h3>Word search result: </h3>
              <WordDef
                autoload={true}
                word={this.state.searchWord}
                handleSpanClick={this.handleSpanClick}
                vocabSize={this.props.vocabSize}
                getDefinitions={this.props.getDefinitions}
                addKnownWord={this.props.addKnownWord}
                addUnknownWord={this.props.addUnknownWord}
                removeWord={this.props.removeWord}
                unknownWords={this.props.unknownWords}
                addToAppState={this.props.addToAppState}
              />{" "}
            </>
          )}
        </div>

        <div>
          <h2>Your saved words: </h2>

          <ul>
            {this.props.unknownWords.map((word, i) => {
              return (
                <li key={i}>
                  <span>
                    <button onClick={() => this.props.removeWord(word)}>
                      Remove
                    </button>
                    <WordDef
                      handleSpanClick={this.handleSpanClick}
                      word={word}
                      vocabSize={this.props.vocabSize}
                      getDefinitions={this.props.getDefinitions}
                      addKnownWord={this.props.addKnownWord}
                      addUnknownWord={this.props.addUnknownWord}
                      removeWord={this.props.removeWord}
                      unknownWords={this.props.unknownWords}
                      addToAppState={this.props.addToAppState}
                    />
                  </span>
                  {/* {word} */}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Home;
