import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import axios from "axios";
// import auth from "../../utils/auth";

import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import RandomWord from "../RandomWord/RandomWord";
// import WordDef from "../WordDef/WordDef";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import SearchResults from "../SearchResults/SearchResults";
import SearchForm from "../SearchForm/SearchForm";
import WordDef from "../WordDef/WordDef";
import Sidebar from "../Sidebar/Sidebar";

import "./Home.css";
import SidebarLight from "../SidebarLight/SidebarLight";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: null,
      searchTerm: "",
      sidebarOpen: false,
    };
  }
  render() {
    return (
      <div className="home grid-container">
        <Nav handleSignout={this.props.handleSignout} />

        <div className="content">
          <div className="main">
            {/* <h1>Home</h1> */}
            <div>
              {/* <p>Set language</p>  */}
              <LanguageDropdown
                handleDropdownChange={this.handleDropdownChange}
                lang={this.props.lang}
              ></LanguageDropdown>
            </div>
            <h2>Here is a word you might not know:</h2>
            <RandomWord
              redirectToRead={this.redirectToRead}
              vocabSize={this.props.vocabSize}
              lang={this.props.lang}
              handleSpanClick={this.handleSpanClick}
              getDefinitions={this.props.getDefinitions}
              addKnownWord={this.props.addKnownWord}
              addUnknownWord={this.props.addUnknownWord}
              removeWord={this.props.removeWord}
              unknownWords={this.props.unknownWords}
              addToAppState={this.props.addToAppState}
              history={this.props.history}
            />
          </div>

          <SidebarLight
            history={this.props.history}
            lang={this.props.lang}
            definitionJSON={[]}
            unknownWords={this.props.unknownWords}
            handleRemoveWord={this.handleRemoveWord}
            handleDeleteWord={this.handleDeleteWord}
            getDefinitions={this.props.getDefinitions}
            addKnownWord={this.props.addKnownWord}
            addUnknownWord={this.props.addUnknownWord}
            removeWord={this.props.removeWord}
            handleSpanClick={this.handleSpanClick}
            searchWord={this.state.searchWord}
            sanitizeText={this.props.sanitizeText}
          />
        </div>
        <Footer></Footer>
      </div>
    );
  }

  componentDidMount() {}
  componentDidUpdate(prevProps) {
    if (this.props.lang !== prevProps.lang) {
      console.log("updated: HOME language is:", this.props.lang);
      console.log(this.props.vocabSize);

      // FETCH some texts from server with their titles/ids;
      // render to dom

      //onclick=>
      // this.props.addToAppState("serverTextId", 254634);
    }
  }
  handleDropdownChange = (e) => {
    e.preventDefault();
    // this.setState({ lang: e.target.value });
    // console.log(e.target.value);

    this.setState({ searchWord: null });
    this.props.addToAppState("lang", e.target.value);
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

  handleSpanClick = (e) => {
    let word = this.props.sanitizeText(e.target.innerText)[0];
    this.setState({ searchWord: word });
    //if mobile on mobile logic here:--->
    // this.setState({ sidebarOpen: true });
  };
  redirectToRead = () => {
    this.props.history.push("/read");
  };
  toggleSidebar = () => {
    this.setState({ sidebarOpen: !this.state.sidebarOpen });
  };
}

export default Home;
