import React, { Component } from "react";

import WordDef from "../WordDef/WordDef";
import "./SearchResults.css";

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: this.props.lang,
    };
  }

  render() {
    return (
      <div className="search-results">
        {/* <h3>Word search result: </h3> */}

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
      </div>
    );
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
}

export default SearchResults;
