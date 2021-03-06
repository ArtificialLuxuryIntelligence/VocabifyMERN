import React, { Component } from "react";
import "./RandomWord.css";
import axios from "axios";

import WordDef from "../WordDef/WordDef";
import auth from "../../utils/auth";

let _isMounted;

class RandomWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newWord: "floof",
      wordKnown: false,
      definition: [],
      isLoading: true,
      lang: this.props.lang,
      // isLoading: false
    };

    this.getNewWord = this.getNewWord.bind(this);
  }

  render() {
    if (this.props.unknownWords.length < 5) {
      return (
        <div>
          <p>
            It looks like you don't have enough saved words for us to get a good
            idea of your level.
          </p>
          <p>
            Take this{" "}
            <a
              href="# "
              className="test-link"
              onClick={() => this.props.redirectToRead()}
            >
              reading test
            </a>{" "}
            to get started.
          </p>
        </div>
      );
    }
    if (this.state.isLoading) {
      return (
        <div className="random-word">
          <p> Loading new word...</p>
        </div>
      );
    }
    if (this.state.definition.length === 0) {
      return (
        <div className="random-word">
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
          deleteButton={false}
        />
      </div>
    );
  }

  // shouldComponentUpdate(nextProps) {
  //   return nextProps.lang == this.props.lang;
  // }

  getNewWord = async () => {
    this.setState({ isLoading: true });
    let token = JSON.parse(localStorage.getItem("vocabify")).token;
    let obj = {
      vocabSize: this.props.vocabSize,
      unknownWords: this.props.unknownWords,
      knownWords: this.props.knownWords,
      lang: this.props.lang,
    };
    let headers = {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    };
    // console.log(obj);

    // console.log("getting new word");
    try {
      let response = await axios.post("/words/random", obj, { headers });

      // console.log(response); // this.setState({ definition });

      if (_isMounted) {
        if (response.data.success) {
          this.setState({ newWord: response.data.definition[0][0].word });
          this.setState({ definition: response.data.definition });
          this.setState({ isLoading: false });
          this.setState({ wordKnown: false });
        }
        this.setState({ isLoading: false });
        return;
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("unauthorized.. loggin out");
        auth.loggingOut();
        this.props.history.push("/login");
      }
      // console.log(err);
    }
  };

  componentDidMount = () => {
    _isMounted = true;
    // console.log("myVOCAB", this.props.vocabSize);
    // console.log("did mount");
    if (
      this.state.definition.length === 0 &&
      this.props.unknownWords.length > 4
    ) {
      this.getNewWord();
    }
  };
  componentWillUnmount = () => {
    _isMounted = false;
  };

  static getDerivedStateFromProps(props, state) {
    if (props.lang !== state.lang) {
      return {
        lang: props.lang,
        definition: [],
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    //glitches if you refresh (calls didmount and didupdate?)
    //on first load getNewWord is called twice - once here and once didMount?
    if (
      this.props.lang !== prevProps.lang &&
      this.props.unknownWords.length > 4
    ) {
      this.getNewWord();
    }
  }

  handleNewWord = () => {
    this.getNewWord();
  };
}

export default RandomWord;
