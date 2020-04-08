import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import Nav from "../Nav/Nav";
// import RandomWord from "../RandomWord/RandomWord";
import WordDef from "../WordDef/WordDef";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

import "./Account.css";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      loadedWords: [],
    };
  }

  handleSpanClick = (e) => {
    let word = this.props.sanitizeText(e.target.innerText)[0];
    this.setState({ searchWord: word });
  };

  handleDropdownChange = (e) => {
    e.preventDefault();
    // this.setState({ lang: e.target.value });
    this.props.addToAppState("lang", e.target.value);
    // console.log(e.target.value);

    this.setState({ searchWord: null });
  };

  render() {
    return (
      <div>
        <Nav handleSignout={this.props.handleSignout} />
        <h1>Account</h1>
        <LanguageDropdown
          handleDropdownChange={this.handleDropdownChange}
          lang={this.props.lang}
        ></LanguageDropdown>

        <div className="account-content">
          <div>
            {this.state.searchWord !== null && (
              <div className="sidebar sidebar-closed">
                <h3>Word search result </h3>
                <WordDef
                  lang={this.props.lang}
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
                />
              </div>
            )}
          </div>

          <div className="saved-words">
            <h2>Your saved words: </h2>
            <ul>
              {this.props.unknownWords.map((word, i) => {
                return (
                  <li key={word}>
                    {/* hides 'remove' button from span (wordDef component has own button) [alternate/better 'React' version of this is to keep track of words with fetched definitions...] .reason: there is a remove button rendered by the worddef component when definition is fetched*/}
                    <span
                      onClick={(e) =>
                        e.target.tagName === "P"
                          ? (e.target.nextElementSibling.style.display = "none")
                          : null
                      }
                    >
                      <WordDef
                        lang={this.props.lang}
                        word={word}
                        handleSpanClick={this.handleSpanClick}
                        vocabSize={this.props.vocabSize}
                        getDefinitions={this.props.getDefinitions}
                        addKnownWord={this.props.addKnownWord}
                        addUnknownWord={this.props.addUnknownWord}
                        removeWord={this.props.removeWord}
                        unknownWords={this.props.unknownWords}
                        addToAppState={this.props.addToAppState}
                      />
                      <button
                        className="remove-button-unloaded"
                        onClick={() => this.props.removeWord(word)}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Account;
