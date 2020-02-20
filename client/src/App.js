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
      knownWords: [],
      unknownWords: [],
      vocabSize: ""
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
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    if (obj) {
      let { knownWords, unknownWords, vocabSize } = obj;
      this.setState({ knownWords, unknownWords, vocabSize });
      // hydrate state from local (all data, including definitions)
    }

    console.log("did mount");
  }

  // util functions -------------------------------------------

  // save state to local storage
  saveToLocal() {
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    obj.unknownWords = this.state.unknownWords;
    obj.knownWords = this.state.knownWords;
    obj.vocabSize = this.state.vocabSize;
    localStorage.setItem("vocabify", JSON.stringify(obj));
  }

  // will unmount? / window will close// closing window?
  // componentWillUnmount() {
  //   // unload definitions onto localStorage on logout
  // }

  //set global App state
  addToAppState(key, value) {
    this.setState({ [key]: value });
    // console.log(this.state);
    this.saveToLocal();
  }

  sendAppStateToServer = async () => {
    let obj = {
      id: JSON.parse(localStorage.getItem("vocabify")).token,
      token: JSON.parse(localStorage.getItem("vocabify")).token,
      unknownWords: this.state.unknownWords,
      knownWords: this.state.knownWords,
      vocabSize: this.state.vocabSize
    };
    console.log(obj);

    //trycatch
    let res = await axios.post("/words/updateuser", obj);
    console.log(res);
  };

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

  // -----------------------------------------------------------------

  getDefinitions = async (wordArray, filter) => {
    let token = JSON.parse(localStorage.getItem("vocabify")).token;
    let obj = {
      token: token,
      lang: "en",
      knownWords: this.state.knownWords,
      unknownWords: this.state.unknownWords,
      // vocabSize: this.state.vocabSize,
      words: wordArray,
      filter: filter
    };
    console.log(obj);
    //try catch
    let json = await axios.post("/words/definitions", obj);
    console.log("vocabSize", json.data.vocabSize);
    console.log(json.data);

    this.setState({ vocabSize: json.data.vocabSize });

    return json.data.definitions;
  };
  addKnownWord(word) {
    let { knownWords, unknownWords } = this.state;
    if (unknownWords.indexOf(word) < 0 && knownWords.indexOf(word) < 0) {
      knownWords.push(word);
    }
    this.setState({ knownWords, unknownWords });
    this.saveToLocal();
    // console.log(this.state);
  }

  addUnknownWord(word) {
    let { knownWords, unknownWords } = this.state;
    // if (unknownWords.indexOf(word) !== -1) {   //shouldn't be needed
    //   return;
    // }
    unknownWords.push(word);
    if (knownWords.indexOf(word) > 0) {
      knownWords.splice(knownWords.indexOf(word), 1);
    }
    this.setState({ knownWords, unknownWords });
    this.saveToLocal();
  }

  removeWord(word) {
    let { knownWords, unknownWords } = this.state;
    let i = unknownWords.indexOf(word);
    if (i >= 0) {
      unknownWords.splice(i, 1);
    }
    knownWords.push(word);
    this.setState({ knownWords, unknownWords });
    this.saveToLocal();
  }

  handleSignout = async e => {
    this.saveToLocal();
    // clear (most) local storage data
    auth.loggingOut();

    e.preventDefault();
    console.log("...Signing out");

    //update user data on server
    let response = await this.sendAppStateToServer();
    console.log(response);

    ///end session
    let token = JSON.parse(localStorage.getItem("vocabify")).token;
    //trycatch
    await axios.get("/users/signout?token=" + token);
    // console.log(res);

    // needed still?
    this.setState({ navigate: true });
  };

  render() {
    // let wordData = {
    //   token: this.state.token,
    //   knownWords: this.state.knownWords,
    //   unknownWords: this.state.unknownWords,
    //   vocabSize: this.state.vocabSize
    // };
    return (
      <div className="app-routes">
        <Switch>
          <Route
            exact
            path="/login"
            render={props => (
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
            render={props => (
              <Read
                {...props}
                token={this.state.token}
                knownWords={this.state.knownWords}
                unknownWords={this.state.unknownWords}
                vocabSize={this.state.vocabSize}
                addKnownWord={this.addKnownWord}
                addUnknownWord={this.addUnknownWord}
                removeWord={this.removeWord}
                handleSignout={this.handleSignout}
                getDefinitions={this.getDefinitions}
                sanitizeText={this.sanitizeText}
              />
            )}
          />

          <ProtectedRoute
            exact
            path="/"
            component={Home}
            handleSignout={this.handleSignout}
            vocabSize={this.state.vocabSize}
            getDefinitions={this.getDefinitions}
            addKnownWord={this.addKnownWord}
            addUnknownWord={this.addUnknownWord}
            removeWord={this.removeWord}
            unknownWords={this.state.unknownWords}
            addToAppState={this.addToAppState}
            sanitizeText={this.sanitizeText}
          />
          <ProtectedRoute
            exact
            path="/account"
            component={Account}
            handleSignout={this.handleSignout}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
