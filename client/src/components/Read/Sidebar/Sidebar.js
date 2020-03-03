import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import "./Sidebar.css";

// import Collapsible from "react-collapsible";
// import Spanner from "../../Spanner/Spanner";
import WordDef from "../../WordDef/WordDef";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false
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
  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };

  render() {
    if (this.props.isLoading) {
      return (
        <div
          className={
            this.state.sidebarOpen
              ? "sidebar sidebar-open"
              : "sidebar sidebar-closed"
          }
        >
          <p> Loading words...</p>
        </div>
      );
    }
    return (
      <div
        className={
          this.state.sidebarOpen
            ? "sidebar sidebar-open"
            : "sidebar sidebar-closed"
        }
      >
        <button onClick={() => this.toggleSidebar()}>
          {this.state.sidebarOpen ? ">>" : "<<"}
        </button>
        {this.props.sidebarWords.length === 0 ? <p>No words to show </p> : null}

        {this.props.isNewWordLoading ? <p>adding word ... </p> : null}
        <div>
          {this.props.definitionJSON.map((word, i) => {
            if (this.props.sidebarWords.includes(word[0].word)) {
              return (
                <div key={word[0].word}>
                  <hr />

                  <button
                    className={"delete-button"}
                    onClick={() => this.props.handleDeleteWord(word[0].word)}
                  >
                    x
                  </button>
                  <WordDef
                    autoload={true}
                    definition={[word]}
                    word={word[0].word}
                    lang={this.props.lang}
                    handleSpanClick={this.props.handleSpanClick}
                    vocabSize={this.props.vocabSize}
                    getDefinitions={this.props.getDefinitions}
                    addKnownWord={this.props.addKnownWord}
                    addUnknownWord={this.props.addUnknownWord}
                    removeWord={this.props.removeWord}
                    unknownWords={this.props.unknownWords}
                    addToAppState={this.props.addToAppState}
                  ></WordDef>
                  <hr />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }
}

export default Sidebar;
