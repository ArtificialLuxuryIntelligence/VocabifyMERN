import React, { Component } from "react";
class SearchForm extends Component {
  render() {
    return (
      <div className="search-form">
        <h3 id="search-heading">search</h3>
        <form id="searchForm">
          <input
            name="searchTerm"
            ref="searchTerm"
            value={this.props.value}
            onChange={this.props.handleChange}
            lang={this.props.lang}
          />
          <button onClick={this.props.handleSubmit}>search</button>
        </form>
      </div>
    );
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
}

export default SearchForm;
