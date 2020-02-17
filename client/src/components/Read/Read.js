import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import auth from "../../utils/auth";

import Nav from "../Nav/Nav";
import Sidebar from "./Sidebar/Sidebar";
import Textarea from "./Textarea/Textarea";
import Textreader from "./Textreader/Textreader";
import axios from "axios";

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
      definitionJSON: {}
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
    console.log("did mount");
  }

  //needs to pass this function to children

  // ---- makes plain text clickable and searchable (i.e. definition lookup)

  //   searchableText = (text, targetContainer) => {
  //     let outputText = text
  //       .split(" ")
  //       .map(word => word.replace(word, "<span class='word'>" + word + "</span>"))
  //       .join(" ");
  //     targetContainer.innerHTML = outputText;

  //     let words = targetContainer.getElementsByClassName("word");

  //     [...words].forEach(word => {
  //       //cloning removes eventlisteners to avoid duplicates
  //       let clone = word.cloneNode(true);
  //       word.parentNode.replaceChild(clone, word);

  //       clone.addEventListener("click", e => {
  //         let word = sanitizeText(e.target.innerHTML);
  //         fetchDefinitions(word, false);
  //         console.log(word);
  //       });
  //     });
  //   };

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
      .replace(/[.,\/#!?$%\^&\*;:{}“”=_`~()]/g, "")
      .toLowerCase()
      .split(" ")
      .map(word => word.trim())
      .filter(word => word.length > 0);
    //returns array
    return this.uniq(inputText);
  };

  handleSubmit = async () => {
    const textarea = document.querySelector("#textarea");
    let words = this.sanitizeText(textarea.value);
    //filter: true // only get words that are probably unknown to user

    //TODO save definitions to localstorage and only request definitions not already in localS
    // let savedDefinitions = JSON.parse(localStorage.getItem("vocabify")).savedDefinitions
    // words.filter(word => ...)

    //filter == false if unknowwords <3 (otherwise it just returns all words over 200 vocabsize... (change this?))
    // need to implement clickable text then can turn this off else >3

    //try catch
    let definitions = await this.props.getDefinitions(words, "true");
    console.log(definitions);

    let sidebarWordsArray = [];
    definitions.forEach(a => sidebarWordsArray.push(a[0].word));

    this.setState({
      definitionJSON: definitions,
      sidebarWords: sidebarWordsArray
    });

    let fullText = textarea.value;
    this.setState({ currentView: "read", words, fullText });
  };

  handleSpanClick = async e => {
    let def = await this.props.getDefinitions([e.target.innerText], "false");
    let defs = this.state.definitionJSON;
    this.setState({ definitionJSON: def.concat(defs) });

    let newWord = def[0][0].word;

    let sidebarWordArray = this.state.sidebarWords;

    sidebarWordArray.push(newWord);

    this.setState({ sidebarWords: sidebarWordArray });
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
            // addKnownWord={this.props.addKnownWord}
            // addUnknownWord={this.props.addUnknownWord}
            // removeWord={this.props.removeWord}
            handleRemoveWord={this.handleRemoveWord}
            handleDeleteWord={this.handleDeleteWord}
            handleAddWord={this.handleAddWord}
            sidebarWords={this.state.sidebarWords}
          />
        </div>
      );
    }
  }
}

export default Read;
