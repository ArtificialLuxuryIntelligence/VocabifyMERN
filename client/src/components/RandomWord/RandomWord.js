import React, { Component } from "react";
import "./RandomWord.css";

import "./RandomWord.css";
import axios from "axios";
// import Sidebar from "../Read/Sidebar/Sidebar";
// import Collapsible from "react-collapsible";
// import Spanner from "../Spanner/Spanner";
import WordDef from "../WordDef/WordDef";

// import Spanner from "../../Spanner/Spanner";
// import { Redirect } from "react-router-dom";
// import auth from "../../utils/auth";

class RandomWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newWord: "floof",
      wordKnown: false,
      definition: [],
      isLoading: true,
      lang: this.props.lang
      // isLoading: false
    };

    this.getNewWord = this.getNewWord.bind(this);
  }

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.lang == this.props.lang;
  // }

  static getDerivedStateFromProps(props, state) {
    if (props.lang !== state.lang) {
      return {
        lang: props.lang,
        definition: []
      };
    }
  }

  componentDidUpdate(prevProps) {
    //glitches if you refresh (calls didmount and didupdate?)
    if (this.props.lang !== prevProps.lang) {
      this.getNewWord();
    }
  }

  componentDidMount = () => {
    // console.log("myVOCAB", this.props.vocabSize);
    // console.log("did mount");
    if (this.state.definition.length === 0) {
      this.getNewWord();
    }
  };

  getNewWord = async () => {
    this.setState({ isLoading: true });
    let { token } = JSON.parse(localStorage.getItem("vocabify"));
    let obj = {
      // token,
      vocabSize: this.props.vocabSize,
      unknownWords: this.props.unknownWords,
      knownWords: this.props.knownWords,
      lang: this.props.lang
    };
    let headers = { token };
    // console.log(obj);

    let response = await axios.post("/words/random", obj, { headers });
    console.log(response.data); // this.setState({ definition });
    // console.log(this.state);
    if (response.data.success) {
      this.setState({ newWord: response.data.definition[0][0].word });
      this.setState({ definition: response.data.definition });
      this.setState({ isLoading: false });
      this.setState({ wordKnown: false });
    }
    this.setState({ isLoading: false });
    return;
  };

  handleNewWord = () => {
    this.getNewWord();
  };

  render() {
    if (this.state.isLoading) {
      return (
        <div className={"random-word"}>
          <p> Loading new word...</p>
        </div>
      );
    }
    if (this.state.definition.length === 0) {
      return (
        <div className={"random-word"}>
          <p>
            Sorry, we couldn't find a word.
            <button onClick={() => this.handleNewWord()}>Try again</button>
          </p>
        </div>
      );
    }

    return (
      <div className={"random-word"}>
        <button onClick={() => this.handleNewWord()}>New word</button>
        <WordDef
          lang={this.props.lang}
          autoload={true}
          word={this.state.newWord}
          definition={this.state.definition}
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
}

export default RandomWord;
