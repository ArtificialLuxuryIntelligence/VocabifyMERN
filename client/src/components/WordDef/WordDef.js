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
import "./WordDef.css";

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
      definition: this.props.definition || [],
    };

    // this.getNewWord = this.getNewWord.bind(this);
  }

  render() {
    if (
      this.state.fetchFail ||
      (this.state.defintionToggled === false && this.props.autoload)
    ) {
      return (
        <div>
          <p onClick={() => this.getWordDef()}>
            Cannot find definiton of <em>{this.props.word}</em>. Click here to
            try again
          </p>
          <button
            className="translate"
            onClick={(e) => this.handleTranslateWord(this.props.word)}
          >
            Try translate
          </button>
        </div>
      );
    }

    if (this.state.defintionToggled === false) {
      return (
        <span className="word-unloaded" onClick={() => this.getWordDef()}>
          {this.props.word}
        </span>
      );
    }
    if (this.state.isLoading) {
      return <span> Loading word...</span>;
    }

    return (
      <div className="definition">
        {/* {this.props.isNewWordLoading ? <p>adding word ... </p> : null} */}
        <div>
          {this.state.definition.map(
            (word, i) => {
              // if (this.props.sidebarWords.indexOf(word[0].word) !== -1) {
              if (word.length > 1) {
                return (
                  <div key={i}>
                    <div className="def-buttons">
                      <button
                        className="translate"
                        onClick={(e) =>
                          this.handleTranslateWord(
                            this.state.word || this.props.word
                          )
                        }
                      >
                        Translate
                      </button>
                      {this.props.unknownWords.indexOf(word[0].word) === -1 && (
                        <button
                          className={"add-button"}
                          onClick={(e) => this.handleAddWord()}
                        >
                          Add
                        </button>
                      )}

                      {this.props.unknownWords.indexOf(word[0].word) !== -1 && (
                        <button
                          className={"remove-button"}
                          onClick={(e) => this.handleRemoveWord()}
                        >
                          Remove
                        </button>
                      )}
                      {this.props.deleteButton && (
                        <button
                          className={"delete-button"}
                          onClick={() =>
                            this.props.handleDeleteWord(word[0].word)
                          }
                        >
                          x
                        </button>
                      )}
                    </div>

                    <Collapsible
                      open={true}
                      triggerClassName="clickable word-heading"
                      triggerOpenedClassName="clickable word-heading"
                      handleSpanClick={this.props.handleSpanClick}
                      trigger={word[0].word}
                      transitionTime={120}
                    >
                      <Word
                        handleSpanClick={this.props.handleSpanClick}
                        word={word}
                        lang={this.props.lang}
                        wordHeading={word[0].word}
                      />
                    </Collapsible>
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
                          <div className="def-buttons">
                            <button
                              className="translate"
                              onClick={(e) =>
                                this.handleTranslateWord(
                                  this.state.word || this.props.word
                                )
                              }
                            >
                              Translate
                            </button>
                            {this.props.unknownWords.indexOf(word.word) ===
                              -1 && (
                              <button
                                className={"add-button"}
                                onClick={(e) => this.handleAddWord()}
                              >
                                Add
                              </button>
                            )}

                            {this.props.unknownWords.indexOf(word.word) !==
                              -1 && (
                              <button
                                className={"remove-button"}
                                onClick={(e) => this.handleRemoveWord()}
                              >
                                Remove
                              </button>
                            )}
                            {this.props.deleteButton && (
                              <button
                                className={"delete-button"}
                                onClick={() =>
                                  this.props.handleDeleteWord(word.word)
                                }
                              >
                                x
                              </button>
                            )}
                          </div>

                          <Collapsible
                            open={true}
                            triggerClassName="clickable word-heading"
                            triggerOpenedClassName="clickable word-heading"
                            handleSpanClick={this.props.handleSpanClick}
                            trigger={word.word}
                            transitionTime={120}
                            wordHeading={word.word}
                          >
                            <POS
                              handleSpanClick={this.props.handleSpanClick}
                              word={word}
                              lang={this.props.lang}
                              wordHeading={word.word}
                            />
                          </Collapsible>
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

  //?? shouldComponentUpdate method here too stop too many unneccessary rerenders.
  // or pureComponent
  //[note: must work in all contexts (i.e.on home page/read pages etc) ]

  // shouldComponentUpdate(nextProps, nextState) {
  // }

  componentDidUpdate(prevProps) {
    console.log("did update");
    if (this.props.autoload && this.props.word !== prevProps.word) {
      this.getWordDef();
    }
  }

  getWordDef = async () => {
    this.setState({
      isLoading: true,
      defintionToggled: true,
      fetchFail: false,
    });
    //error only thrown for 401 (user not logged in) in getDefinitions function
    try {
      let definition = await this.props.getDefinitions(
        [this.props.word],
        "false"
      );
      //handle cant get from server

      if (!definition || definition.length === 0) {
        this.setState({
          isLoading: false,
          defintionToggled: false,
          fetchFail: true,
        });
        return;
      }
      this.setState({
        definition,
        isLoading: false,
        word: definition[0][0].word,
        fetchFail: false,
      });

      // return;
    } catch (err) {
      console.log(err);
    }
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
              triggerClassName="clickable word"
              triggerOpenedClassName="clickable word"
              handleSpanClick={props.handleSpanClick}
              trigger={word.word}
              transitionTime={120}
            >
              <POS
                handleSpanClick={props.handleSpanClick}
                word={word}
                lang={props.lang}
                wordHeading={props.wordHeading}
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
              triggerClassName="clickable pos"
              triggerOpenedClassName="clickable pos"
              handleSpanClick={props.handleSpanClick}
              trigger={key}
              transitionTime={120}
            >
              <ol>
                <Definition
                  handleSpanClick={props.handleSpanClick}
                  def={props.word.meaning[key]}
                  lang={props.lang}
                  wordHeading={props.wordHeading}
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
                        wordHeading={props.wordHeading}
                      ></Spanner>
                      {/* <p>{def.definition}</p> */}
                    </li>
                  )}
                </div>
              );
            }
            return null;
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
                        wordHeading={props.wordHeading}
                      ></Spanner>
                      {/* <p>{def.definition}</p> */}
                    </li>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    default:
      return null;
  }
}

export default WordDef;
