//component accepts OPTIONAL props
// autoload: boolean          //fetches and autoloads def of word given
// definition: array          //autoload definition supplied (set autoload true)

// REQUIRED PROPS:
// ?
///////////
// to do:
// "sorry couldn't find def" for autoload words.. (sometimes no search results - currently defaults to clickable word with no def)
///

import React, { Component } from "react";
// import "./WordDef.css";

// import axios from "axios";
// import Sidebar from "../Read/Sidebar/Sidebar";
import Collapsible from "react-collapsible";
// import Spanner from "../../Spanner/Spanner";

import Spanner from "../Spanner/Spanner";
// import { Redirect } from "react-router-dom";
// import auth from "../../utils/auth";

class WordDef extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // newWord: this.props.word,
      isLoading: true,
      defintionToggled: false,
      definition: this.props.definition || []
    };

    // this.getNewWord = this.getNewWord.bind(this);
  }

  componentDidMount = () => {
    if (this.props.definition) {
      console.log("got a def");
      this.setState({ isLoading: false, defintionToggled: true });
      return;
    }
    if (this.props.autoload) {
      this.getWordDef();
    }
    return;
  };

  componentDidUpdate(prevProps) {
    if (this.props.autoload && this.props.word !== prevProps.word) {
      this.getWordDef();
      console.log("did update");
    }
  }

  getWordDef = async () => {
    this.setState({ isLoading: true, defintionToggled: true });
    let definition = await this.props.getDefinitions(
      [this.props.word],
      "false"
    );
    //handle cant get from server
    if (definition.length === 0) {
      this.setState({ isLoading: false, defintionToggled: false });
      return;
    }
    this.setState({
      definition,
      isLoading: false,
      word: definition[0][0].word
    });

    // return;
  };

  //from state if def was fetched internally/ from props if def was passed in from parent
  handleAddWord = () => {
    this.props.addUnknownWord(this.state.word || this.props.word);
    // console.log(this.state.word || this.props.word);
    // console.log(this.props.unknownWords);
  };
  handleRemoveWord = () => {
    this.props.removeWord(this.state.word || this.props.word);
  };

  render() {
    if (this.state.defintionToggled === false) {
      return <p onClick={() => this.getWordDef()}>{this.props.word}</p>;
    }
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
                      open={true}
                      triggerClassName="clickable"
                      triggerOpenedClassName="clickable"
                      handleSpanClick={this.props.handleSpanClick}
                      trigger={word[0].word}
                      transitionTime={120}
                    >
                      <Word
                        handleSpanClick={this.props.handleSpanClick}
                        word={word}
                        lang={this.props.lang}
                      />
                    </Collapsible>
                    {this.props.unknownWords.indexOf(word[0].word) === -1 && (
                      <button onClick={e => this.handleAddWord()}>
                        Add word
                      </button>
                    )}
                    {this.props.unknownWords.indexOf(word[0].word) !== -1 && (
                      <button onClick={e => this.handleRemoveWord()}>
                        Remove word
                      </button>
                    )}
                    {/* <button onClick={e => this.props.handleDeleteWord(e)}>
                  x
                </button> */}
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
                            open={true}
                            triggerClassName="clickable"
                            triggerOpenedClassName="clickable"
                            handleSpanClick={this.props.handleSpanClick}
                            trigger={word.word}
                            transitionTime={120}
                          >
                            <POS
                              handleSpanClick={this.props.handleSpanClick}
                              word={word}
                              lang={this.props.lang}
                            />
                          </Collapsible>
                          {this.props.unknownWords.indexOf(word.word) ===
                            -1 && (
                            <button onClick={e => this.handleAddWord()}>
                              Add word
                            </button>
                          )}
                          {this.props.unknownWords.indexOf(word.word) !==
                            -1 && (
                            <button onClick={e => this.handleRemoveWord()}>
                              Remove word
                            </button>
                          )}
                          {/* <button onClick={e => this.props.handleDeleteWord(e)}>
                  x
                </button> */}
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
              open={i === 0 ? true : false}
              triggerClassName="clickable"
              triggerOpenedClassName="clickable"
              handleSpanClick={props.handleSpanClick}
              trigger={word.word}
              transitionTime={120}
            >
              <POS
                handleSpanClick={props.handleSpanClick}
                word={word}
                lang={props.lang}
              />
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
              open={i === 0 ? true : false}
              triggerClassName="clickable"
              triggerOpenedClassName="clickable"
              handleSpanClick={props.handleSpanClick}
              trigger={key}
              transitionTime={120}
            >
              <ol>
                <Definition
                  handleSpanClick={props.handleSpanClick}
                  def={props.word.meaning[key]}
                  lang={props.lang}
                />
              </ol>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

function Definition(props) {
  // console.log(props.def);
  switch (props.lang) {
    case "en":
      return (
        <div>
          {props.def.map((def, i) => {
            if (def.definition) {
              return (
                <div key={i + def.definition.slice(1, 6)}>
                  {def.definition && (
                    <li>
                      <Spanner
                        handleSpanClick={props.handleSpanClick}
                        randomString={def.definition}
                        lang={props.lang}
                      ></Spanner>
                      {/* <p>{def.definition}</p> */}
                    </li>
                  )}
                </div>
              );
            }
          })}
        </div>
      );
    case "fr":
    case "es":
      return (
        <div>
          {props.def.definitions.map((def, i) => {
            if (def.definition) {
              return (
                <div key={i + def.definition.slice(1, 6)}>
                  {def.definition && (
                    <li>
                      <Spanner
                        handleSpanClick={props.handleSpanClick}
                        randomString={def.definition}
                        lang={props.lang}
                      ></Spanner>
                      {/* <p>{def.definition}</p> */}
                    </li>
                  )}
                </div>
              );
            }
          })}
        </div>
      );
  }
}

export default WordDef;
