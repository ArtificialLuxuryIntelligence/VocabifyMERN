import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import SearchForm from "../SearchForm/SearchForm";

import Nav from "../Nav/Nav";
// import RandomWord from "../RandomWord/RandomWord";
import WordDef from "../WordDef/WordDef";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import SidebarLight from "../SidebarLight/SidebarLight";

import "./Account.scss";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null, //from spanclick
      loadedWords: [],
      searchTerm: "", //from input
      sidebarOpen: false,
    };
  }

  render() {
    return (
      <div className="account grid-container">
        <Nav handleSignout={this.props.handleSignout} />
        {/* <h1>Account</h1> */}

        <div className="content">
          <div className="main">
            <div>
              {/* <div
                className={
                  this.state.sidebarOpen ? "sidebar sidebar-open" : "sidebar"
                }
              >
                <SearchForm
                  value={this.state.searchTerm}
                  handleChange={this.handleChange}
                  lang={this.props.lang}
                  handleSubmit={this.handleSubmit}
                />

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
              </div> */}
            </div>
            <div>
              <LanguageDropdown
                handleDropdownChange={this.handleDropdownChange}
                lang={this.props.lang}
              ></LanguageDropdown>
              <h2>Your saved words: </h2>
              <ul className="word-list">
                {this.props.unknownWords.map((word, i) => {
                  return (
                    <li key={word}>
                      {/* hides 'remove' button from span (wordDef component has own button) [alternate/better 'React' version of this is to keep track of words with fetched definitions...] .reason: there is a remove button rendered by the worddef component when definition is fetched*/}
                      <span
                        onClick={(e) => {
                          if (e.target.className === "word-unloaded") {
                            e.target.previousElementSibling.style.display =
                              "none";
                          }
                        }}
                      >
                        <div className="account-buttons">
                          <button
                            className="translate"
                            onClick={(e) => this.handleTranslateWord(word)}
                          >
                            Translate
                          </button>
                          <button
                            className="remove-button-unloaded"
                            onClick={() => this.props.removeWord(word)}
                          >
                            Remove
                          </button>
                        </div>
                        <WordDef
                          autoload={false}
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
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <SidebarLight
            history={this.props.history}
            lang={this.props.lang}
            definitionJSON={[]}
            unknownWords={this.props.unknownWords}
            handleRemoveWord={this.handleRemoveWord}
            handleDeleteWord={this.handleDeleteWord}
            getDefinitions={this.props.getDefinitions}
            addKnownWord={this.props.addKnownWord}
            addUnknownWord={this.props.addUnknownWord}
            removeWord={this.props.removeWord}
            handleSpanClick={this.handleSpanClick}
            searchWord={this.state.searchWord}
            sanitizeText={this.props.sanitizeText}
          />
        </div>
      </div>
    );
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.searchTerm.length === 0) {
      return;
    }
    this.setState({ searchWord: this.state.searchTerm, searchTerm: "" });
    document.getElementById("searchForm").reset();
  };

  handleSpanClick = (e) => {
    let word = this.props.sanitizeText(e.target.innerText)[0];
    this.setState({ searchWord: word });
    //if mobile on mobile logic here:--->
    // this.setState({ sidebarOpen: true });
  };

  handleDropdownChange = (e) => {
    e.preventDefault();
    // this.setState({ lang: e.target.value });
    this.props.addToAppState("lang", e.target.value);
    // console.log(e.target.value);

    this.setState({ searchWord: null });
  };
  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  handleTranslateWord = (word) => {
    //to do : response popup params
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100`;
    // window.open(
    //   `https://www.google.com/search?q=translate%20${word}%20${this.props.lang}%20to%20english`,
    //   "translate",
    //   params
    // );
    window.open(
      `https://translate.google.com/?um=1&ie=UTF-8&hl=en&client=tw-ob#${this.props.lang}/en/${word}`,
      "translate",
      params
    );
  };
}

export default Account;
