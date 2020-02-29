const auth = {
  loggingIn() {
    localStorage.setItem("vocabify", JSON.stringify({ isLoggedIn: true }));
  },
  loggingOut() {
    //currently removes all
    localStorage.setItem(
      "vocabify",
      JSON.stringify({
        isLoggedIn: false,
        token: "",
        // knownWords: [], //to be removed
        // unknownWords: [], //to be removed
        vocabSize: "",
        savedDefinitions: [],
        words: {},
        lang: ""
      })
    );
  },

  isLoggedIn() {
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    if (obj && obj.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  }
};

export default auth;
