import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import auth from "./utils/auth";

// import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./components/Home/Home";
import Signin from "./components/Signin/Signin";
import Account from "./components/Account/Account";
import Read from "./components/Read/Read";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // knownWords: [],
      // unknownWords: [],
      vocabSize: 0,
      lang: "placeholder", //can set this to a lang (EN) in case there is a problem loading a language on startup?
      words: {
        en: { knownWords: [], unknownWords: [], vocabSize: "" },
        es: { knownWords: [], unknownWords: [], vocabSize: "" },
        fr: { knownWords: [], unknownWords: [], vocabSize: "" },
        //before language is set..:
        placeholder: { knownWords: [], unknownWords: [], vocabSize: "" },
      },
    };

    this.addToAppState = this.addToAppState.bind(this);
    this.addKnownWord = this.addKnownWord.bind(this);
    this.addUnknownWord = this.addUnknownWord.bind(this);
    this.removeWord = this.removeWord.bind(this);
    this.handleSignout = this.handleSignout.bind(this);
    this.sendAppStateToServer = this.sendAppStateToServer.bind(this);
    this.getDefinitions = this.getDefinitions.bind(this);

    this.saveToLocal = this.saveToLocal.bind(this);
  }
  componentDidMount() {
    //app holds its own islogged in state
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    if (obj && obj.isLoggedIn) {
      // let { knownWords, unknownWords, vocabSize, lang, words } = obj; //to be removed
      let { lang, words } = obj;

      // this.setState({ knownWords, unknownWords, vocabSize, lang, words }); //to be removed
      this.setState({ lang, words });

      // hydrate state from local (all data, including definitions)
      console.log("did mount and is logged in");
    }

    console.log("did mount");
  }

  // util functions -------------------------------------------

  // save state to local storage
  saveToLocal() {
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    // obj.unknownWords = this.state.unknownWords; //to be removed
    // obj.knownWords = this.state.knownWords; //to be removed
    // obj.vocabSize = this.state.vocabSize;
    obj.lang = this.state.lang;
    obj.words = this.state.words;
    localStorage.setItem("vocabify", JSON.stringify(obj));
  }

  // will unmount? / window will close// closing window?
  // componentWillUnmount() {
  //   // unload definitions onto localStorage on logout
  // }

  //set global App state
  addToAppState(key, value) {
    this.setState({ [key]: value });
    console.log("key", key, "value", value);

    // console.log(this.state);
    this.saveToLocal();
  }

  sendAppStateToServer = async () => {
    let obj = {
      // id: JSON.parse(localStorage.getItem("vocabify")).token,
      words: this.state.words,
      lang: this.state.lang,
    };
    console.log(obj);
    let token = JSON.parse(localStorage.getItem("vocabify")).token;
    //trycatch
    let res = await axios.post("/users/updateuser", obj, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    });
    if (res.data.message === "User updated") {
      return { success: true };
    } else {
      return { success: false };
    }
  };

  //removes dupulicates
  uniq = (a) => {
    return Array.from(new Set(a));
  };

  //returns array
  sanitizeText = (string, lang = this.state.lang) => {
    let inputText = string
      .toLowerCase()
      .replace(/\s/g, " ")
      .replace(/^\d+$/g, " ")
      //removed hyphen from list (need to add more?)
      .replace(/[.,/#!?$%^&*;:{}“”=_`~()]/g, "")
      .toLowerCase()
      .split(" ")
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    if (lang === "fr") {
      inputText = inputText.map((word) =>
        word.replace(/^l'|^l’|^m'|^m’|^t'|^t’|^s'|^s’/gi, "")
      );
      console.log(lang);
    }
    return this.uniq(inputText);
  };

  // -----------------------------------------------------------------

  getDefinitions = async (wordArray, filter) => {
    let token = JSON.parse(localStorage.getItem("vocabify")).token;
    let obj = {
      lang: this.state.lang,
      // knownWords: this.state.knownWords, //to be removed
      // unknownWords: this.state.unknownWords, //to be removed
      knownWords: this.state.words[this.state.lang].knownWords,
      unknownWords: this.state.words[this.state.lang].unknownWords,
      // vocabSize: this.state.vocabSize,
      words: wordArray,
      filter: filter,
    };
    let headers = {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    };
    // console.log(obj);
    //try catch
    try {
      let json = await axios.post("/words/definitions", obj, { headers });
      console.log("vocabSize", json.data.vocabSize);
      console.log(json.data);

      // this.setState({ vocabSize: json.data.vocabSize });
      this.setState((prevState) => ({
        ...prevState,
        words: {
          ...prevState.words,
          [this.state.lang]: {
            ...prevState.words[this.state.lang],
            vocabSize: json.data.vocabSize,
          },
        },
      }));
      return json.data.definitions;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log("unauthorized.. loggin out");
        auth.loggingOut();
        //force rerender (=> redirect to login page now there is no token  )
        //this saves from having to check auth state in every component at every update (protected routes check when they mount)
        this.forceUpdate();
      }
      console.log(err);
    }
  };
  addKnownWord(word) {
    let { knownWords, unknownWords } = this.state.words[this.state.lang];
    //only adds as known word IF not 'unknown' -
    if (unknownWords.indexOf(word) < 0 && knownWords.indexOf(word) < 0) {
      knownWords.push(word);
    }
    // this.setState({ knownWords, unknownWords }); //change

    this.setState((prevState) => ({
      ...prevState,
      words: {
        ...prevState.words,
        [this.state.lang]: {
          ...prevState.words[this.state.lang],
          knownWords,
          unknownWords,
        },
      },
    }));

    this.saveToLocal();
    // console.log(this.state);
  }

  addUnknownWord(word) {
    let { knownWords, unknownWords } = this.state.words[this.state.lang];
    // if (unknownWords.indexOf(word) !== -1) {   //shouldn't be needed
    //   return;
    // }
    unknownWords.unshift(word);
    if (knownWords.indexOf(word) > 0) {
      knownWords.splice(knownWords.indexOf(word), 1);
    }
    // this.setState({ knownWords, unknownWords }); //change

    this.setState((prevState) => ({
      ...prevState,
      words: {
        ...prevState.words,
        [this.state.lang]: {
          ...prevState.words[this.state.lang],
          knownWords,
          unknownWords,
        },
      },
    }));

    this.saveToLocal();
  }

  removeWord(word) {
    //AKA i know this word ?
    let { knownWords, unknownWords } = this.state.words[this.state.lang];
    let i = unknownWords.indexOf(word);
    if (i >= 0) {
      unknownWords.splice(i, 1);
    }
    knownWords.push(word);

    // this.setState({ knownWords, unknownWords });

    this.setState((prevState) => ({
      ...prevState,
      words: {
        ...prevState.words,
        [this.state.lang]: {
          ...prevState.words[this.state.lang],
          knownWords,
          unknownWords,
        },
      },
    }));

    this.saveToLocal();
  }

  handleSignout = async (e) => {
    // this.saveToLocal();
    e.preventDefault();
    console.log("...Signing out");

    //update user data on server
    let signout = await this.sendAppStateToServer();
    if (signout.success) {
      auth.loggingOut();
      this.setState({ navigate: true });
    } else {
      //handle failure
      console.log("update failed");
    }
  };

  render() {
    return (
      <div className="app-routes">
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) => (
              <Signin
                {...props}
                addToAppState={this.addToAppState}
                // handleSignout={this.handleSignout}
              />
            )}
          />

          <Route
            exact
            path="/read"
            render={(props) => (
              <Read
                {...props}
                lang={this.state.lang}
                token={this.state.token}
                knownWords={this.state.words[this.state.lang].knownWords}
                unknownWords={this.state.words[this.state.lang].unknownWords}
                vocabSize={this.state.words[this.state.lang].vocabSize}
                addKnownWord={this.addKnownWord}
                addUnknownWord={this.addUnknownWord}
                removeWord={this.removeWord}
                handleSignout={this.handleSignout}
                getDefinitions={this.getDefinitions}
                addToAppState={this.addToAppState}
                sanitizeText={this.sanitizeText}
              />
            )}
          />

          <ProtectedRoute
            exact
            path="/"
            component={Home}
            lang={this.state.lang}
            handleSignout={this.handleSignout}
            vocabSize={this.state.words[this.state.lang].vocabSize}
            getDefinitions={this.getDefinitions}
            addKnownWord={this.addKnownWord}
            addUnknownWord={this.addUnknownWord}
            removeWord={this.removeWord}
            unknownWords={this.state.words[this.state.lang].unknownWords}
            addToAppState={this.addToAppState}
            sanitizeText={this.sanitizeText}
          />
          <ProtectedRoute
            exact
            path="/account"
            component={Account}
            lang={this.state.lang}
            handleSignout={this.handleSignout}
            vocabSize={this.state.words[this.state.lang].vocabSize}
            getDefinitions={this.getDefinitions}
            addKnownWord={this.addKnownWord}
            addUnknownWord={this.addUnknownWord}
            removeWord={this.removeWord}
            unknownWords={this.state.words[this.state.lang].unknownWords}
            addToAppState={this.addToAppState}
            sanitizeText={this.sanitizeText}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
