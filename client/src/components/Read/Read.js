import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import auth from "../../utils/auth";
import "./Read.css";

import Nav from "../Nav/Nav";
import Sidebar from "./Sidebar/Sidebar";
import Textarea from "./Textarea/Textarea";
import Textreader from "./Textreader/Textreader";
// import axios from "axios";

class Read extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: "submit",
      knownWords: this.props.knownWords,
      unknownWords: this.props.unknownWords,
      vocabSize: this.props.vocabSize,
      words: [],
      fullText: "",
      sidebarWords: [],
      definitionJSON: {},
      isLoading: false,
      isNewWordLoading: false
    };

    // this.getDefinitions = this.props.getDefinitions.bind(this);
    this.handleSpanClick = this.handleSpanClick.bind(this);
  }

  //avoiding settings state from received props when page refreshed (as done in constructor)
  // maybe can do with component will receive props?
  componentDidMount() {
    // hydrate state from local
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    if (obj) {
      let { knownWords, unknownWords, vocabSize } = obj;
      this.setState({ knownWords, unknownWords, vocabSize });
    }
    return null;
  }

  //removes dupulicates
  uniq = a => {
    return Array.from(new Set(a));
  };

  sanitizeText = text => {
    let inputText = text
      .toLowerCase()
      .replace(/\s/g, " ")
      .replace(/^\d+$/g, " ")
      //removed hyphen from list (need to add more?)
      .replace(/[.,/#!?$%^&*;:{}“”=_`~()]/g, "")
      .toLowerCase()
      .split(" ")
      .map(word => word.trim())
      .filter(word => word.length > 0);
    //returns array
    return this.uniq(inputText);
  };

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    const textarea = document.querySelector("#textarea");

    let words = this.sanitizeText(textarea.value);
    let fullText = textarea.value;
    this.setState({ currentView: "read", words, fullText });

    //try catch
    let definitions = await this.props.getDefinitions(words, "true"); //filter: true // only get words that are probably unknown to use
    console.log(definitions);

    let sidebarWordsArray = [];
    definitions.forEach(a => sidebarWordsArray.push(a[0].word));
    console.log("setting state...");

    this.setState({
      definitionJSON: definitions,
      sidebarWords: sidebarWordsArray,
      isLoading: false
    });
  };

  handleSpanClick = async e => {
    //currently doesnt check if word is already in list...
    this.setState({ isNewWordLoading: true });
    let word = e.target.innerText;
    let queryWord = this.sanitizeText(word);
    let def = await this.props.getDefinitions(queryWord, "false");
    if (def.length === 0) {
      this.setState({ isNewWordLoading: false });
      // show unsuccessful message
      return;
    }
    let newWord = def[0][0].word;

    let defs = this.state.definitionJSON;
    let sidebarWordArray = this.state.sidebarWords;

    //add new word to definition store and sidebar words (kept in sync)
    defs = def.concat(defs);
    sidebarWordArray.unshift(newWord);
    console.log(defs, sidebarWordArray);

    //remove dupes
    defs = Array.from(new Set(defs.map(JSON.stringify)), JSON.parse);
    sidebarWordArray = [...new Set(sidebarWordArray)];

    console.log("uniq", defs, sidebarWordArray);

    this.setState({ definitionJSON: defs });
    this.setState({ sidebarWords: sidebarWordArray });

    // //----avoid duplicates in sidebar and bring new word to top
    // if (sidebarWordArray.includes(newWord)) {
    //   let index = sidebarWordArray.indexOf(newWord);
    //   sidebarWordArray.splice(index, 1);
    //   // console.log(defs);

    //   // defs.splice(index, 1);
    //   // console.log(defs);
    //   // console.log("included");
    // }
    // //-----

    // this.setState({ definitionJSON: def.concat(defs) });
    // sidebarWordArray.unshift(newWord);
    // this.setState({ sidebarWords: sidebarWordArray });

    this.setState({ isNewWordLoading: false });
  };

  handleNewText = () => {
    this.setState({ currentView: "submit", words: "", fullText: "" });
  };

  handleAddWord = e => {
    e.stopPropagation();
    let word = e.target.parentElement.children[0].children[0].innerText;

    this.props.addUnknownWord(word);

    //handle with props
    // e.target.style.display = "none";
    // e.target.previousElementSibling.style.display = "block";
  };
  handleRemoveWord = e => {
    e.stopPropagation();
    let word = e.target.parentElement.children[0].children[0].innerText;
    this.props.removeWord(word);
    // e.target.style.display = "none";
    // e.target.parentElement.parentElement.remove();
    // sidebarWords.splice(sidebarWords.indexOf(word), 1);

    // let { sidebarWords } = this.state;
    // sidebarWords.splice(sidebarWords.indexOf(word), 1);
    // this.setState({ sidebarWords });

    // e.target.nextElementSibling.style.display = "block";
    // e.target.parentElement.parentElement.remove();
  };
  handleDeleteWord = e => {
    e.stopPropagation();
    let word = e.target.parentElement.children[0].children[0].innerText;
    this.props.addKnownWord(word);

    //handlewithprops
    // e.target.parentElement.parentElement.remove();

    // sidebarWords.splice(sidebarWords.indexOf(word), 1);
    let { sidebarWords } = this.state;
    sidebarWords.splice(sidebarWords.indexOf(word), 1);
    this.setState({ sidebarWords });
  };

  render() {
    const currentView = this.state.currentView;
    if (currentView === "submit") {
      return (
        <div>
          <Nav handleSignout={this.props.handleSignout} />
          <h1>Submit</h1>
          <Textarea handleSubmit={this.handleSubmit} />
        </div>
      );
    } else {
      return (
        <div>
          <Nav handleSignout={this.props.handleSignout} />
          <h1>Read</h1>
          <Textreader
            fullText={this.state.fullText}
            handleNewText={this.handleNewText}
            handleSpanClick={this.handleSpanClick}
          />
          <Sidebar
            definitionJSON={this.state.definitionJSON}
            unknownWords={this.props.unknownWords}
            handleRemoveWord={this.handleRemoveWord}
            handleDeleteWord={this.handleDeleteWord}
            handleAddWord={this.handleAddWord}
            sidebarWords={this.state.sidebarWords}
            handleSpanClick={this.handleSpanClick}
            isLoading={this.state.isLoading}
            isNewWordLoading={this.state.isNewWordLoading}
          />
        </div>
      );
    }
  }
}

export default Read;
