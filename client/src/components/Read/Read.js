//NOTE handle submit function currently sets the length of page text. to be moved

import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
// import auth from "../../utils/auth";
import "./Read.css";

import Nav from "../Nav/Nav";
import Sidebar from "./Sidebar/Sidebar";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

import Textarea from "./Textarea/Textarea";
import Textreader from "./Textreader/Textreader";
import { Logger } from "mongodb";
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
      fullTextSplit: [],
      sidebarWords: [],
      definitionJSON: [],
      isLoading: false,
      isNewWordLoading: false,
      pageNumber: 0,
      largestLoadedPageNumber: -1,
      sidebarMessage: "",
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

  splitText(string, cutoff) {
    let words = string.split(" ");

    let arr = [];
    let i = 0;
    while (i < words.length) {
      arr.push(words.slice(i, i + cutoff).join(" "));
      i += cutoff;
    }
    return arr;
  }

  removeWordArrayDupes = (arr) => {
    let noDupes = [];
    let words = [];
    arr.map(function (x) {
      if (!words.includes(x[0].word)) {
        words.push(x[0].word);
        noDupes.push(x);
      }
    });
    return noDupes;
  };
  //TO DO //
  removeCaps(string) {
    //function to remove proper names from text.
    //not capitalized words at start of sentences.
    // only words midsentence
    // /[a-z][ ][A-Z][a-z]/g something like this??
    return string;
  }

  loadPageDefinitions = async () => {
    this.setState({ isLoading: true });

    let currentPageText = this.state.fullTextSplit[this.state.pageNumber];

    let words = this.props.sanitizeText(this.removeCaps(currentPageText));

    let definitions = await this.props.getDefinitions(words, "true"); //filter: true // only get words that are probably unknown to user
    // console.log(definitions);

    let sidebarWordsArray = [];
    definitions.forEach((a) => sidebarWordsArray.push(a[0].word));

    //adds new defs to sidebar and removes duplicates
    this.setState({
      definitionJSON: this.removeWordArrayDupes([
        ...this.state.definitionJSON,
        ...definitions,
      ]),
      sidebarWords: [
        ...new Set([...this.state.sidebarWords, ...sidebarWordsArray]),
      ],
      isLoading: false,
    });
  };

  handleSubmit = async () => {
    const length = 50; //SET ELSEWHERE (props based on available space in browser e.g. innerwidth )
    const textarea = document.querySelector("#textarea");

    let fullText = textarea.value;
    let fullTextSplit = this.splitText(fullText, length);

    this.setState({ currentView: "read", fullText, fullTextSplit }, () =>
      this.loadPageDefinitions()
    );
    // this.loadDefinitions();
    // let pageText = this.state.fullTextSplit[this.state.pageNumber];
  };

  handleNextPage = () => {
    this.setState(
      {
        pageNumber:
          this.state.pageNumber < this.state.fullTextSplit.length - 1
            ? this.state.pageNumber + 1
            : this.state.pageNumber,
      },
      () => {
        if (this.state.pageNumber > this.state.largestLoadedPageNumber) {
          this.setState({ largestLoadedPageNumber: this.state.pageNumber });
          this.loadPageDefinitions();
        } else {
          this.setState({ isLoading: false });

          console.log("definitions already loaded");
        }
      }

      //
    );
  };

  handlePrevPage = () => {
    this.setState({
      pageNumber: this.state.pageNumber === 0 ? 0 : this.state.pageNumber - 1,
    });
  };

  handleSpanClick = async (e) => {
    //currently doesnt check if word is already in list BEFORE requesting...

    this.setState({ isNewWordLoading: true });
    // console.log(e.target.classList[1]);

    let parentWord = e.target.classList[1];

    let word = e.target.innerText;

    if (this.state.sidebarWords.indexOf(word) > 0) {
      this.setState({
        sidebarMessage: `Definition of ${word} is already loaded!`,
      });
      setTimeout(() => this.setState({ sidebarMessage: "" }), 1500);
      this.setState({ isNewWordLoading: false });
      return;
    }
    let queryWord = this.props.sanitizeText(word);

    let def = await this.props.getDefinitions(queryWord, "false");
    if (def.length === 0) {
      this.setState({ isNewWordLoading: false });
      this.setState({
        sidebarMessage: `Could not find definition of ${queryWord}`,
      });

      setTimeout(() => this.setState({ sidebarMessage: "" }), 1500);

      // show unsuccessful message
      return;
    }
    let newWord = def[0][0].word;
    console.log(newWord);

    if (this.state.sidebarWords.indexOf(newWord) > 0) {
      this.setState({
        sidebarMessage: `Definition of ${newWord} already loaded!`,
      });
      setTimeout(() => this.setState({ sidebarMessage: "" }), 1500);

      this.setState({ isNewWordLoading: false });

      return;
    }

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
    // console.log(defs, sidebarWordArray);

    //remove dupes (shouldn't be any?)
    defs = Array.from(new Set(defs.map(JSON.stringify)), JSON.parse);
    sidebarWordArray = [...new Set(sidebarWordArray)];
    //

    this.setState({ definitionJSON: defs });
    this.setState({ sidebarWords: sidebarWordArray });
    this.setState({ isNewWordLoading: false });
    this.setState({ sidebarMessage: "" });
  };

  handleNewText = () => {
    this.setState({
      currentView: "submit",
      words: "",
      fullText: "",
      fullTextSplit: [],
      pageNumber: 0,
      largestLoadedPageNumber: 0,
      sidebarWords: [],
      definitionJSON: [],
    });
  };

  handleAddWord = (e) => {
    //remove
    e.stopPropagation();
    let word = e.target.parentElement.children[0].children[0].innerText;

    this.props.addUnknownWord(word);

    //handle with props
    // e.target.style.display = "none";
    // e.target.previousElementSibling.style.display = "block";
  };
  handleRemoveWord = (e) => {
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

  handleDeleteWord = (word) => {
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

  handleDropdownChange = (e) => {
    e.preventDefault();
    this.setState({ sidebarWords: [] }); // clears current sidebar (not the JSONdefinitions in the state but they get overwritten on next text submission)
    this.props.addToAppState("lang", e.target.value);
  };

  render() {
    const currentView = this.state.currentView;
    if (currentView === "submit") {
      return (
        <div className="read">
          <Nav handleSignout={this.props.handleSignout} />
          <h1>Read</h1>
          <h2>Submit</h2>

          <LanguageDropdown
            handleDropdownChange={this.handleDropdownChange}
            lang={this.props.lang}
          ></LanguageDropdown>

          <Textarea
            handleSubmit={this.handleSubmit}
            unknownWords={this.props.unknownWords}
            lang={this.props.lang}
          />
        </div>
      );
    } else {
      return (
        <div className="read">
          <Nav handleSignout={this.props.handleSignout} />
          <h1>Read</h1>

          <LanguageDropdown
            handleDropdownChange={this.handleDropdownChange}
            lang={this.props.lang}
          ></LanguageDropdown>

          <div className={""}>
            <Textreader
              fullText={this.state.fullText} //remove
              fullTextSplit={this.state.fullTextSplit}
              handleNewText={this.handleNewText}
              handleSpanClick={this.handleSpanClick}
              pageNumber={this.state.pageNumber}
              handleNextPage={this.handleNextPage}
              handlePrevPage={this.handlePrevPage}
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
              pageNumber={this.state.pageNumber}
              sidebarMessage={this.state.sidebarMessage}
            />
          </div>
        </div>
      );
    }
  }
}

export default Read;
