import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import "./Sidebar.scss";

// import Collapsible from "react-collapsible";
// import Spanner from "../../Spanner/Spanner";
import WordDef from "../WordDef/WordDef";
import SearchResults from "../SearchResults/SearchResults";
import SearchForm from "../SearchForm/SearchForm";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      searchWord: null,
      searchTerm: "",
      searchBoxOpen: true,
    };
  }

  render() {
    // if (this.props.isLoading) {
    //   return (
    //     <div
    //       className={
    //         this.state.sidebarOpen
    //           ? "sidebar sidebar-open"
    //           : "sidebar sidebar-closed"
    //       }
    //     >
    //       <p> Loading words...</p>
    //     </div>
    //   );
    // }
    return (
      <div>
        <div id="sidebar-nav-sm">
          <button
            onClick={() => this.toggleSidebar()}
            className="sidebar-toggle sidebar-toggle-sm"
          >
            {this.state.sidebarOpen ? "close" : "open"}
          </button>
        </div>
        <div
          className={
            this.state.sidebarOpen ? "sidebar sidebar-open" : "sidebar"
          }
        >
          <div className="sidebar-sticky">
            <div className="heading">
              <h2> words</h2>
              <button
                className="sidebar-toggle sidebar-toggle-md"
                onClick={() => this.toggleSidebar()}
              >
                {this.state.sidebarOpen ? ">>" : "<<"}
              </button>
            </div>
            <div className="search">
              <button id="hide-search" onClick={() => this.toggleSearchBox()}>
                {this.state.searchBoxOpen ? "close search" : "open search"}
              </button>
              <div
                className={
                  this.state.searchBoxOpen
                    ? "search-box search-box-open"
                    : "search-box search-box-closed"
                }
              >
                <SearchForm
                  value={this.state.searchTerm}
                  handleChange={this.handleChange}
                  lang={this.props.lang}
                  handleSubmit={this.handleSubmit}
                />

                <div>
                  {this.state.searchWord !== null && (
                    <>
                      <SearchResults
                        history={this.props.history}
                        autoload={true}
                        word={this.state.searchWord}
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
                    </>
                  )}
                </div>
              </div>
            </div>
            {this.props.isNewWordLoading ? <p>adding word ... </p> : null}
            {this.props.isLoading ? <p> Loading words...</p> : null}
            {this.props.sidebarMessage.length > 0 ? (
              <p className="sidebar-message">{this.props.sidebarMessage}</p>
            ) : null}
          </div>

          <div className="scroll-wrapper">
            <div className="defs">
              {this.props.sidebarWords.length === 0 ? (
                <p>No words to show </p>
              ) : null}

              <div>
                {this.props.definitionJSON.map((word, i) => {
                  if (this.props.sidebarWords.includes(word[0].word)) {
                    return (
                      <div key={word[0].word}>
                        <hr />

                        <button
                          className={"delete-button"}
                          onClick={() =>
                            this.props.handleDeleteWord(word[0].word)
                          }
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
          </div>
        </div>
      </div>
    );
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
  componentDidUpdate(prevProps) {
    if (
      this.props.isLoading !== prevProps.isLoading ||
      this.props.isNewWordLoading !== prevProps.isNewWordLoading
    ) {
      this.setState({ sidebarOpen: true });
    }
  }

  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };
  toggleSearchBox = (e) => {
    this.setState({ searchBoxOpen: !this.state.searchBoxOpen });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.searchTerm.length === 0) {
      return;
    }
    this.setState({ searchWord: this.state.searchTerm, searchTerm: "" });
    document.getElementById("searchForm").reset();
  };
}

export default Sidebar;