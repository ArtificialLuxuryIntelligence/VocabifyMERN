import React, { Component } from "react";

import WordDef from "../WordDef/WordDef";
// import "./SearchForm.css";

class SearchForm extends Component {
  constructor(props) {
    super(props);
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.lang !== state.lang) {
  //     return {
  //       lang: props.lang
  //     };
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   //glitches if you refresh (calls didmount and didupdate?)
  //   if (this.props.lang != prevProps.lang) {
  //     console.log("did update");
  //     this.getNewWord();
  //   }
  //   console.log("updated-  no lang change");
  // }

  render() {
    return (
      <div className="search-form">
        <h3>Search for a word:</h3>
        <form id="searchForm">
          <input
            name="searchTerm"
            ref="searchTerm"
            value={this.props.value}
            onChange={this.props.handleChange}
            lang={this.props.lang}
          />
          <button onClick={this.props.handleSubmit}>submit</button>
        </form>
      </div>
    );
  }
}

export default SearchForm;
