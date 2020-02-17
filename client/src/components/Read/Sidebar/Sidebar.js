import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import axios from "axios";
// import auth from "../../utils/auth";

import Collapsible from "react-collapsible";

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
    return (
      <div>
        <div>
          {this.props.definitionJSON.map((word, i) => {
            if (this.props.sidebarWords.indexOf(word[0].word) != -1) {
              if (word.length > 1) {
                return (
                  <div key={i}>
                    {/* <h1>{word[0].word}</h1> */}
                    <Collapsible trigger={word[0].word}>
                      <Word word={word} />
                    </Collapsible>
                    {this.props.unknownWords.indexOf(word[0].word) === -1 && (
                      <button onClick={e => this.props.handleAddWord(e)}>
                        Add word
                      </button>
                    )}
                    {this.props.unknownWords.indexOf(word[0].word) != -1 && (
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
                          <Collapsible trigger={word.word}>
                            <POS word={word} />
                          </Collapsible>
                          {this.props.unknownWords.indexOf(word.word) ===
                            -1 && (
                            <button onClick={e => this.props.handleAddWord(e)}>
                              Add word
                            </button>
                          )}
                          {this.props.unknownWords.indexOf(word.word) != -1 && (
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
            <Collapsible trigger={word.word}>
              <POS word={word} />
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
            <Collapsible trigger={key}>
              <Definition def={props.word.meaning[key]} />
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

export default Sidebar;
