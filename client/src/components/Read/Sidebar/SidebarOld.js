import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import "./Sidebar.css";

import Collapsible from "react-collapsible";
import Spanner from "../../Spanner/Spanner";

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // definitionJSON: this.props.definitionJSON,
    };
  }

  // componentDidUpdate() {
  //   this.forceUpdate();
  // }

  // create collapsbile and populate list with json

  // pass in json as props..

  componentDidMount() {
    // add event listeners here???
    // console.log(this.state);
    // this.populateDefinitionList(this.state.definitionJSON);
  }

  render() {
    if (this.props.isLoading) {
      return <p> Loading words...</p>;
    }
    return (
      <div>
        {this.props.sidebarWords.length === 0 ? <p>No words to show </p> : null}

        {this.props.isNewWordLoading ? <p>adding word ... </p> : null}
        <div>
          {this.props.definitionJSON.map((word, i) => {
            if (this.props.sidebarWords.indexOf(word[0].word) !== -1) {
              if (word.length > 1) {
                return (
                  <div key={i}>
                    {/* <h1>{word[0].word}</h1> */}
                    <Collapsible
                      triggerClassName="clickable"
                      triggerOpenedClassName="clickable"
                      handleSpanClick={this.props.handleSpanClick}
                      trigger={word[0].word}
                      transitionTime={120}
                    >
                      <Word
                        handleSpanClick={this.props.handleSpanClick}
                        word={word}
                      />
                    </Collapsible>
                    {this.props.unknownWords.indexOf(word[0].word) === -1 && (
                      <button onClick={e => this.props.handleAddWord(e)}>
                        Add word
                      </button>
                    )}
                    {this.props.unknownWords.indexOf(word[0].word) !== -1 && (
                      <button onClick={e => this.props.handleRemoveWord(e)}>
                        Remove word
                      </button>
                    )}
                    <button onClick={e => this.props.handleDeleteWord(e)}>
                      x
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
                            handleSpanClick={this.props.handleSpanClick}
                            trigger={word.word}
                            transitionTime={120}
                          >
                            <POS
                              handleSpanClick={this.props.handleSpanClick}
                              word={word}
                            />
                          </Collapsible>
                          {this.props.unknownWords.indexOf(word.word) ===
                            -1 && (
                            <button onClick={e => this.props.handleAddWord(e)}>
                              Add word
                            </button>
                          )}
                          {this.props.unknownWords.indexOf(word.word) !==
                            -1 && (
                            <button
                              onClick={e => this.props.handleRemoveWord(e)}
                            >
                              Remove word
                            </button>
                          )}
                          <button onClick={e => this.props.handleDeleteWord(e)}>
                            x
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            }
          })}
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
              transitionTime={120}
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
        if (def.definition) {
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
        }
      })}
    </div>
  );
}

export default Sidebar;
