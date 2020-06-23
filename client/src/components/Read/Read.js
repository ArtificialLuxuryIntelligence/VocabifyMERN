//NOTE handle submit function currently sets the length of page text. to be moved

import React, { Component } from "react";
import { Prompt } from "react-router";

import "./Read.scss";

import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

import Sidebar from "../Sidebar/Sidebar";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

import Textarea from "./Textarea/Textarea";
import Textreader from "./Textreader/Textreader";

class Read extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: "submit",

      words: [],
      fullText: "",
      fullTextSplit: [],
      sidebarWords: [],
      definitionJSON: [],
      isLoading: false,
      isNewWordLoading: false,
      pageNumber: 0,
      largestLoadedPageNumber: 0,
      sidebarMessage: "",
      sidebarMessageButton: "",
      textareaValue: "",
      testing: false,
    };

    // this.getDefinitions = this.props.getDefinitions.bind(this);
    this.handleSpanClick = this.handleSpanClick.bind(this);
  }

  render() {
    return this.state.currentView === "submit" ? (
      <div className="read grid-container">
        <Nav handleSignout={this.props.handleSignout} />

        <div className="content">
          <div className="main">
            {/* <h2>Read</h2> */}
            <LanguageDropdown
              handleDropdownChange={this.handleDropdownChange}
              lang={this.props.lang}
            ></LanguageDropdown>
            <div className="text-submit">
              <Textarea
                handleSubmit={this.handleSubmit}
                unknownWords={this.props.unknownWords}
                lang={this.props.lang}
              />
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    ) : (
      <div className="read grid-container">
        <Prompt
          when={this.state.fullText.length > 0 && !this.state.testing}
          message="Are you sure you want to leave your text?"
        />
        <Nav handleSignout={this.props.handleSignout} />

        <div className="content">
          <div className="main">
            <LanguageDropdown
              handleDropdownChange={this.handleDropdownChange}
              lang={this.props.lang}
            ></LanguageDropdown>

            <div className="reader">
              <Textreader
                fullText={this.state.fullText} //remove
                fullTextSplit={this.state.fullTextSplit}
                handleNewText={this.handleNewText}
                handleSpanClick={this.handleSpanClick}
                pageNumber={this.state.pageNumber}
                handleNextPage={this.handleNextPage}
                handlePrevPage={this.handlePrevPage}
                unknownWords={this.props.unknownWords}
              />
            </div>
          </div>

          <Sidebar
            history={this.props.history}
            lang={this.props.lang}
            definitionJSON={this.state.definitionJSON}
            unknownWords={this.props.unknownWords}
            handleDeleteWord={this.handleDeleteWord}
            // handleRemoveWord={this.handleRemoveWord}
            // handleAddWord={this.handleAddWord}
            getDefinitions={this.props.getDefinitions}
            addKnownWord={this.props.addKnownWord}
            addUnknownWord={this.addUnknownWord}
            removeWord={this.props.removeWord}
            sidebarWords={this.state.sidebarWords}
            handleSpanClick={this.handleSpanClick}
            isLoading={this.state.isLoading}
            isNewWordLoading={this.state.isNewWordLoading}
            pageNumber={this.state.pageNumber}
            sidebarMessage={this.state.sidebarMessage}
            sidebarMessageButton={this.state.sidebarMessageButton}
          />
        </div>
        <Footer></Footer>
      </div>
    );
  }
  //avoiding settings state from received props when page refreshed (as done in constructor)
  // maybe can do with component will receive props?
  componentDidMount() {
    // console.log("SERVER TEXT ID", this.props.serverTextId);

    //if user vocab test is required.
    if (this.props.unknownWords.length < 5) {
      console.log(this.props.unknownWords);
      this.setState({ testing: true }, () => this.handleSubmit());
    }

    // hydrate state from local
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    if (obj) {
      let { knownWords, unknownWords, vocabSize } = obj;
      this.setState({ knownWords, unknownWords, vocabSize });
    }
    return null;

    //if textId supplied then fetch text, switch views and load text to reader.
    //TODO
  }

  componentDidUpdate(prevProps) {
    if (this.props.unknownWords !== prevProps.unknownWords) {
      console.log("changed");
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.unknownWords.length === 5 && this.state.testing == true) {
  //     console.log("should");
  //     console.log(nextProps.unknownWords.length);

  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   // do things with nextProps.someProp and prevState.cachedSomeProp
  //   if (nextProps.unknownWords.length < 5) {
  //     console.log("lessss");

  //     return {
  //       redirect: true,
  //     };
  //   } else return null;

  //   // ... other derived state properties
  // }

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

  scrollToDef(word) {
    let cont = document.querySelector(".scroll-wrapper");
    let y =
      document.querySelector(`.${word}`).closest(".definition").offsetTop -
      cont.offsetTop;
    cont.scrollTop = y;
  }

  removeWordArrayDupes = (arr) => {
    let noDupes = [];
    let words = [];
    arr.forEach(function (x) {
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

    try {
      let definitions = await this.props.getDefinitions(words, "true"); //filter: true // only get words that are probably unknown to user

      let sidebarWordsArray = [];
      definitions.forEach((a) => sidebarWordsArray.push(a[0].word));
      // console.log(sidebarWordsArray);

      let oldN = this.state.sidebarWords.length;
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
      if (oldN !== 0 && this.state.sidebarWords.length > oldN) {
        // console.log(oldN);
        // console.log(this.state.sidebarWords);
        // console.log(this.state.sidebarWords[oldN]);
        //give time for sidebar to render

        this.scrollToDef(String(this.state.sidebarWords[oldN]));
      }

      //scroll to def of first new word (bug: this uses the sidebarWordsArray which has not had dupes removed yet. This means that
      //it may scroll UP to the def (as fetched for an earlier page))
      //basically, need to replace sidebarWordsArray[0] with a no dupes list

      //find first new def.
    } catch (err) {
      console.log(err);
      return;
    }
  };

  handleSubmit = async () => {
    const length = 100; //SET ELSEWHERE (props based on available space in browser e.g. innerwidth )// sets how many words per page
    const textarea = document.querySelector("#textarea");

    let fullText = textarea.value;
    let fullTextSplit = this.splitText(fullText, length);

    if (this.state.testing) {
      console.log("testing, no lookups");

      this.setState({ currentView: "read", fullText, fullTextSplit });
    } else {
      this.setState({ currentView: "read", fullText, fullTextSplit }, () =>
        this.loadPageDefinitions()
      );
    }

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
    console.log("is loading");

    // console.log(e.target.classList[1]);

    let parentWord = e.target.classList[1];

    let word = this.props.sanitizeText(e.target.innerText);

    //definition is already loaded
    if (this.state.sidebarWords.indexOf(word[0]) >= 0) {
      this.setState({
        sidebarMessage: `Definition of ${word} is already loaded!`,
      });
      setTimeout(() => this.setState({ sidebarMessage: "" }), 1500);
      this.scrollToDef(word);

      this.setState({ isNewWordLoading: false });
      //force refresh of sidebar to open it and then scrollToDef
      return;
    }
    let queryWord = word;

    try {
      let def = await this.props.getDefinitions(queryWord, "false");

      //no definition returned
      if (!def || def.length === 0) {
        this.setState({ isNewWordLoading: false });
        this.setState({
          sidebarMessage: `Could not find definition of ${queryWord}`,
        });
        setTimeout(() => this.setState({ sidebarMessage: "" }), 5000);
        this.setState({
          sidebarMessageButton: queryWord,
        });
        setTimeout(() => this.setState({ sidebarMessageButton: "" }), 5000);
        return;
      }

      let newWord = def[0][0].word;
      console.log(newWord);

      //def already in sidebar
      if (this.state.sidebarWords.indexOf(newWord) >= 0) {
        this.setState({
          sidebarMessage: `Definition of ${newWord} already loaded!!`,
        });
        setTimeout(() => this.setState({ sidebarMessage: "" }), 1500);
        this.scrollToDef(newWord);

        this.setState({ isNewWordLoading: false });

        return;
      }

      let defs = [...this.state.definitionJSON]; //dont mutate state
      let sidebarWordArray = [...this.state.sidebarWords];

      //if word is from a definition then put new word under that def in DOM
      if (sidebarWordArray.indexOf(parentWord) >= 0) {
        // console.log(
        //   "index of",
        //   parentWord,
        //   sidebarWordArray.indexOf(parentWord)
        // );
        let index = sidebarWordArray.indexOf(parentWord);
        defs.splice(index + 1, 0, def[0]);
        sidebarWordArray.splice(index + 1, 0, newWord);
      }
      //add new def to bottom of definition list
      else {
        defs = defs.concat(def);
        sidebarWordArray.push(newWord);
      }
      // console.log(defs, sidebarWordArray);

      //remove dupes (shouldn't be any?)
      defs = Array.from(new Set(defs.map(JSON.stringify)), JSON.parse);
      sidebarWordArray = [...new Set(sidebarWordArray)];
      //

      this.setState({ definitionJSON: defs });
      this.setState({ sidebarWords: sidebarWordArray });
      this.setState({ isNewWordLoading: false });
      setTimeout(this.setState({ sidebarMessage: "" }), 1000);
      this.scrollToDef(newWord);
    } catch (err) {
      console.log("ERROR", err);
      setTimeout(() => this.setState({ sidebarMessage: "" }), 1500);
      this.setState({
        sidebarMessage: `Network error, try again later`,
      });

      // this.props.history.push("./login");
    }
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

  //NO LONGER NEEDED?

  handleAddWord = (e) => {
    console.log("adding");

    //remove
    e.stopPropagation();
    let word = e.target.parentElement.children[0].children[0].innerText;

    this.props.addUnknownWord(word);

    //handle with props
    // e.target.style.display = "none";
    // e.target.previousElementSibling.style.display = "block";
    console.log(this.props.unknownWords);
    console.log("adding");
  };

  addUnknownWord = (word) => {
    this.props.addUnknownWord(word);
    if (this.state.testing && this.props.unknownWords.length === 5) {
      alert("All done");
      this.props.history.push("./");
    }
  };

  //NO LONGER NEEDED?

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

  //STILL NEEDED I THINK?

  handleDeleteWord = (word) => {
    //removes from sidebar and sets as 'known'
    //I know this word // addknownword ??

    // e.stopPropagation();
    // let word = e.target.parentElement.children[0].children[0].innerText;
    this.props.addKnownWord(word);
    //handlewithprops
    // e.target.parentElement.parentElement.remove();

    // sidebarWords.splice(sidebarWords.indexOf(word), 1);
    let { sidebarWords, definitionJSON } = this.state;
    let i = sidebarWords.indexOf(word);
    sidebarWords.splice(i, 1);
    definitionJSON.splice(i, 1);
    this.setState({ sidebarWords, definitionJSON });
  };

  handleDropdownChange = (e) => {
    e.preventDefault();
    this.setState({ sidebarWords: [] }); // clears current sidebar (not the JSONdefinitions in the state but they get overwritten on next text submission)
    this.props.addToAppState("lang", e.target.value);
  };
}

export default Read;
