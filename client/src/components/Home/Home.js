import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import Nav from "../Nav/Nav";
import RandomWord from "../RandomWord/RandomWord";
import WordDef from "../WordDef/WordDef";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      searchTerm: ""
    };
  }

  componentDidMount() {
    console.log("HOME language is:", this.props.lang);
  }

  handleDropdownChange = e => {
    e.preventDefault();
    // this.setState({ lang: e.target.value });
    this.props.addToAppState("lang", e.target.value);
    // console.log(e.target.value);

    this.setState({ searchWord: null });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.searchTerm.length === 0) {
      return;
    }
    this.setState({ searchWord: this.state.searchTerm });
    document.getElementById("searchForm").reset();
  };

  handleSpanClick = e => {
    let word = this.props.sanitizeText(e.target.innerText)[0];
    this.setState({ searchWord: word });
  };
  render() {
    return (
      <div>
        <Nav handleSignout={this.props.handleSignout} />
        <h1>Home</h1>
        <div>
          <p>Set language</p>
          <LanguageDropdown
            handleDropdownChange={this.handleDropdownChange}
            lang={this.props.lang}
          ></LanguageDropdown>
        </div>
        <div>
          <h3>Search for a word:</h3>
          <form id="searchForm">
            <input
              name="searchTerm"
              ref="searchTerm"
              value={this.state.searchTerm}
              onChange={this.handleChange}
              lang={this.props.lang}
            />
            <button onClick={this.handleSubmit}>submit</button>
          </form>
        </div>
        <div>
          <h2>Here is a word you might not know:</h2>
          <RandomWord
            vocabSize={this.props.vocabSize}
            lang={this.props.lang}
            handleSpanClick={this.handleSpanClick}
            getDefinitions={this.props.getDefinitions}
            addKnownWord={this.props.addKnownWord}
            addUnknownWord={this.props.addUnknownWord}
            removeWord={this.props.removeWord}
            unknownWords={this.props.unknownWords}
            addToAppState={this.props.addToAppState}
          />
        </div>

        <div>
          {this.state.searchWord !== null && (
            //make separate component 'wrapper' with all the update methods from randoWord comp

            <>
              <h3>Word search result: </h3>

              <SearchResults
                autoload={true}
                word={this.state.searchWord}
                lang={this.props.lang}
                handleSpanClick={this.handleSpanClick}
                vocabSize={this.props.vocabSize}
                getDefinitions={this.props.getDefinitions}
                addKnownWord={this.props.addKnownWord}
                addUnknownWord={this.props.addUnknownWord}
                removeWord={this.props.removeWord}
                unknownWords={this.props.unknownWords}
                addToAppState={this.props.addToAppState}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Home;

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: this.props.lang
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.lang !== state.lang) {
  //     return {
  //       lang: props.lang
  //     };
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   //glitches if you refresh (calls didmount and didupdate?)
  //   if (this.props.lang != prevProps.lang) {
  //     console.log("did update");
  //     this.getNewWord();
  //   }
  //   console.log("updated-  no lang change");
  // }

  render() {
    return (
      <>
        <WordDef
          autoload={this.props.autoload}
          word={this.props.word}
          lang={this.props.lang}
          handleSpanClick={this.props.handleSpanClick}
          vocabSize={this.props.vocabSize}
          getDefinitions={this.props.getDefinitions}
          addKnownWord={this.props.addKnownWord}
          addUnknownWord={this.props.addUnknownWord}
          removeWord={this.props.removeWord}
          unknownWords={this.props.unknownWords}
          addToAppState={this.props.addToAppState}
        />
      </>
    );
  }
}
