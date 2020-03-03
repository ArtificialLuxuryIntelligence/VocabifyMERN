import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import auth from "../../utils/auth";
import "./Read.css";

import Nav from "../Nav/Nav";
import Sidebar from "./Sidebar/Sidebar";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

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

  handleSubmit = async () => {
    this.setState({ isLoading: true });
    const textarea = document.querySelector("#textarea");

    let words = this.props.sanitizeText(textarea.value);
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
    //should there be a separate box for lookup words instead  of adding them to the sidebar like this?
    //see homepage

    //currently doesnt check if word is already in list...
    this.setState({ isNewWordLoading: true });
    // console.log(e.target.classList[1]);

    let parentWord = e.target.classList[1];

    let word = e.target.innerText;
    let queryWord = this.props.sanitizeText(word);
    let def = await this.props.getDefinitions(queryWord, "false");
    if (def.length === 0) {
      this.setState({ isNewWordLoading: false });
      // show unsuccessful message
      return;
    }
    let newWord = def[0][0].word;

    let defs = [...this.state.definitionJSON]; //dont mutate state
    let sidebarWordArray = [...this.state.sidebarWords];

    if (sidebarWordArray.indexOf(parentWord) >= 0) {
      // console.log("index of", parentWord, sidebarWordArray.indexOf(parentWord));
      let index = sidebarWordArray.indexOf(parentWord);
      defs.splice(index + 1, 0, def[0]);
      sidebarWordArray.splice(index + 1, 0, newWord);
    } else {
      defs = def.concat(defs);
      sidebarWordArray.unshift(newWord);
    }

    //add new word to definition store and sidebar words (kept in sync) //sidebarwords not strictly needed but makes it a bit clearer to keep track of words; note- it is used when changed langage cf. dropdown

    //TO DO - add new def under entry that called it...

    console.log(defs, sidebarWordArray);

    //remove dupes
    defs = Array.from(new Set(defs.map(JSON.stringify)), JSON.parse);
    sidebarWordArray = [...new Set(sidebarWordArray)];
    //

    this.setState({ definitionJSON: defs });
    this.setState({ sidebarWords: sidebarWordArray });
    this.setState({ isNewWordLoading: false });
  };

  handleNewText = () => {
    this.setState({ currentView: "submit", words: "", fullText: "" });
  };

  handleAddWord = e => {
    //remove
    e.stopPropagation();
    let word = e.target.parentElement.children[0].children[0].innerText;

    this.props.addUnknownWord(word);

    //handle with props
    // e.target.style.display = "none";
    // e.target.previousElementSibling.style.display = "block";
  };
  handleRemoveWord = e => {
    //AKA i know this word
    //remove
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
  // handleDeleteWord = e => {
  //   e.stopPropagation();
  //   let word = e.target.parentElement.children[0].children[0].innerText;
  //   this.props.addKnownWord(word);
  //   //handlewithprops
  //   // e.target.parentElement.parentElement.remove();

  //   // sidebarWords.splice(sidebarWords.indexOf(word), 1);
  //   let { sidebarWords } = this.state;
  //   sidebarWords.splice(sidebarWords.indexOf(word), 1);
  //   this.setState({ sidebarWords });
  // };

  handleDeleteWord = word => {
    //removes from sidebar and sets as 'known'
    //I know this word // addknownword ??

    // e.stopPropagation();
    // let word = e.target.parentElement.children[0].children[0].innerText;
    this.props.addKnownWord(word);
    //handlewithprops
    // e.target.parentElement.parentElement.remove();

    // sidebarWords.splice(sidebarWords.indexOf(word), 1);
    let { sidebarWords } = this.state;
    sidebarWords.splice(sidebarWords.indexOf(word), 1);
    this.setState({ sidebarWords });
  };

  handleDropdownChange = e => {
    e.preventDefault();
    this.setState({ sidebarWords: [] }); // clears current sidebar (not the JSONdefinitions in the state but they get overwritten on next text submission)
    this.props.addToAppState("lang", e.target.value);
  };

  render() {
    const currentView = this.state.currentView;
    if (currentView === "submit") {
      return (
        <div>
          <Nav handleSignout={this.props.handleSignout} />
          <h1>Read</h1>
          <h2>Submit</h2>

          <LanguageDropdown
            handleDropdownChange={this.handleDropdownChange}
            lang={this.props.lang}
          ></LanguageDropdown>

          <Textarea handleSubmit={this.handleSubmit} />
        </div>
      );
    } else {
      return (
        <div>
          <Nav handleSignout={this.props.handleSignout} />
          <h1>Read</h1>

          <LanguageDropdown
            handleDropdownChange={this.handleDropdownChange}
            lang={this.props.lang}
          ></LanguageDropdown>

          <div className={""}>
            <Textreader
              fullText={this.state.fullText}
              handleNewText={this.handleNewText}
              handleSpanClick={this.handleSpanClick}
            />
            <Sidebar
              // className={"sidebar"}
              lang={this.props.lang}
              definitionJSON={this.state.definitionJSON}
              unknownWords={this.props.unknownWords}
              handleRemoveWord={this.handleRemoveWord}
              handleDeleteWord={this.handleDeleteWord}
              // handleAddWord={this.handleAddWord}
              getDefinitions={this.props.getDefinitions}
              addKnownWord={this.props.addKnownWord}
              addUnknownWord={this.props.addUnknownWord}
              removeWord={this.props.removeWord}
              sidebarWords={this.state.sidebarWords}
              handleSpanClick={this.handleSpanClick}
              isLoading={this.state.isLoading}
              isNewWordLoading={this.state.isNewWordLoading}
            />
          </div>
        </div>
      );
    }
  }
}

export default Read;
