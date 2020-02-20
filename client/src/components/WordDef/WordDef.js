import React, { Component } from "react";
// import "./WordDef.css";

import axios from "axios";
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
      wordKnown: false,
      isLoading: true,
      defintionToggled: false,
      definition: []
    };

    // this.getNewWord = this.getNewWord.bind(this);
  }

  componentDidMount = () => {
    if (this.props.autoload) {
      this.getWordDef();
    }
    return;
  };

  componentDidUpdate(prevProps) {
    if (this.props.autoload && this.props.word !== prevProps.word) {
      this.getWordDef();
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
    this.setState({ definition, isLoading: false });
    // return;
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
                    >
                      <Word
                        handleSpanClick={this.props.handleSpanClick}
                        word={word}
                      />
                    </Collapsible>
                    {/* {!this.state.wordKnown && (
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
                          >
                            <POS
                              handleSpanClick={this.props.handleSpanClick}
                              word={word}
                            />
                          </Collapsible>
                          {/* {!this.state.wordKnown && (
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
              open={i === 0 ? true : false}
              triggerClassName="clickable"
              triggerOpenedClassName="clickable"
              handleSpanClick={props.handleSpanClick}
              trigger={key}
            >
              <ol>
                <Definition
                  handleSpanClick={props.handleSpanClick}
                  def={props.word.meaning[key]}
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
  return (
    <div>
      {props.def.map((def, i) => {
        return (
          <div key={i + def.definition.slice(1, 6)}>
            {def.definition && (
              <li>
                <Spanner
                  handleSpanClick={props.handleSpanClick}
                  randomString={def.definition}
                ></Spanner>
                {/* <p>{def.definition}</p> */}
              </li>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default WordDef;
