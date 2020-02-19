import React, { Component } from "react";
import "./RandomWord.css";

// import "./RandomWord.css";
import axios from "axios";
// import Sidebar from "../Read/Sidebar/Sidebar";
import Collapsible from "react-collapsible";
// import Spanner from "../../Spanner/Spanner";

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
      isLoading: true
    };

    this.getNewWord = this.getNewWord.bind(this);
  }

  componentDidMount = () => {
    console.log("myVOCAB", this.props.vocabSize);
    console.log("rando did mount");

    this.getNewWord();
  };

  getNewWord = async () => {
    this.setState({ isLoading: true });
    let { token, vocabSize, unknownWords, knownWords, lang } = JSON.parse(
      localStorage.getItem("vocabify")
    );
    let obj = {
      token,
      vocabSize,
      unknownWords,
      knownWords,
      lang: "en"
    };
    console.log(obj);

    let response = await axios.post("/words/random", obj);
    console.log(response.data); // this.setState({ definition });
    // console.log(this.state);
    if (response.data.success) {
      this.setState({ newWord: response.data.definition[0][0].word });
      this.setState({ definition: response.data.definition });
      this.setState({ isLoading: false });
    }
    this.setState({ isLoading: false });
    return;
  };

  handleNewWord = () => {
    this.getNewWord();
  };
  handleAddWord = () => {
    this.props.addUnknownWord(this.state.newWord);
    this.setState({ wordKnown: true });
  };
  handleRemoveWord = () => {
    this.props.removeWord(this.state.newWord);
    this.setState({ wordKnown: false });
  };

  //   render() {
  //     return (
  //       <div>
  //         <h2>Random Word</h2>
  //         <p> Here is a a word you might not know:</p>
  //         {/* <h4>{this.state.newWord}</h4> */}
  //         {!this.state.wordKnown && (
  //           <button onClick={() => this.handleAddWord()}>Add word</button>
  //         )}
  //         {this.state.wordKnown && (
  //           <button onClick={() => this.handleRemoveWord()}>Remove word</button>
  //         )}
  //         <button onClick={() => this.handleNewWord()}>New word</button>

  //         <div className="definition-cont">{}</div>
  //       </div>
  //     );
  //   }

  render() {
    if (this.state.isLoading) {
      return <p> Loading word...</p>;
    }
    return (
      <div>
        {/* {this.props.isNewWordLoading ? <p>adding word ... </p> : null} */}
        <div>
          {this.state.definition.map(
            (word, i) => {
              // if (this.props.sidebarWords.indexOf(word[0].word) !== -1) {
              if (word.length > 1) {
                return (
                  <div key={i}>
                    {/* <h1>{word[0].word}</h1> */}
                    <Collapsible
                      triggerClassName="clickable"
                      triggerOpenedClassName="clickable"
                      //   handleSpanClick={() => console.log("clicked")}
                      trigger={word[0].word}
                    >
                      <Word
                        // handleSpanClick={() => console.log("clicked")}
                        word={word}
                      />
                    </Collapsible>
                    {!this.state.wordKnown && (
                      <button onClick={() => this.handleAddWord()}>
                        Add word
                      </button>
                    )}
                    {this.state.wordKnown && (
                      <button onClick={() => this.handleRemoveWord()}>
                        Remove word
                      </button>
                    )}
                    <button onClick={() => this.handleNewWord()}>
                      New word
                    </button>
                  </div>
                );
              } else {
                return (
                  <div key={i}>
                    {word.map((word, i) => {
                      return (
                        <div key={i}>
                          {/* <h1>{word.word}</h1> */}
                          <Collapsible
                            triggerClassName="clickable"
                            triggerOpenedClassName="clickable"
                            // handleSpanClick={() => console.log("clicked")}
                            trigger={word.word}
                          >
                            <POS
                              //   handleSpanClick={() => console.log("clicked")}
                              word={word}
                            />
                          </Collapsible>
                          {!this.state.wordKnown && (
                            <button onClick={() => this.handleAddWord()}>
                              Add word
                            </button>
                          )}
                          {this.state.wordKnown && (
                            <button onClick={() => this.handleRemoveWord()}>
                              Remove word
                            </button>
                          )}
                          <button onClick={() => this.handleNewWord()}>
                            New word
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            }
            //   }
          )}
        </div>
      </div>
    );
  }
}

function Word(props) {
  // console.log(props.word);

  return (
    <div>
      {props.word.map((word, i) => {
        return (
          <div key={i}>
            {/* <h2>{word.word}</h2> */}
            <Collapsible
              triggerClassName="clickable"
              triggerOpenedClassName="clickable"
              handleSpanClick={props.handleSpanClick}
              trigger={word.word}
            >
              <POS handleSpanClick={props.handleSpanClick} word={word} />
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

function POS(props) {
  // console.log(props.word.meaning);
  let keys = Object.keys(props.word.meaning);
  // console.log(keys);

  // console.log(props.word.meaning[])
  return (
    <div>
      {keys.map((key, i) => {
        return (
          <div key={i}>
            {/* <p>{key}</p> */}
            <Collapsible
              triggerClassName="clickable"
              triggerOpenedClassName="clickable"
              handleSpanClick={props.handleSpanClick}
              trigger={key}
            >
              <Definition
                handleSpanClick={props.handleSpanClick}
                def={props.word.meaning[key]}
              />
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

function Definition(props) {
  // console.log(props.def);
  return (
    <div>
      {props.def.map((def, i) => {
        return (
          <div key={i}>
            <p>{def.definition}</p>
          </div>
        );
      })}
    </div>
  );
}

export default RandomWord;

{
  /* <Sidebar
  isLoading={false}
  isNewWordLoading={false}
  sidebarWords={this.state.newWord}
  definitionJSON={this.state.definition}
  handleSpanClick={() => console.log("hi")}
  unknownWords={this.props.unknownWords}
  knownWords={this.props.knownWords}
  handleAddWord={this.handleAddWord}
  handleRemoveWord={this.handleRemoveWord}
></Sidebar>; */
}
