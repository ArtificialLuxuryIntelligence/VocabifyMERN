const auth = {
  loggingIn() {
    localStorage.setItem("vocabify", JSON.stringify({ isLoggedIn: true }));
  },
  loggingOut() {
    localStorage.setItem(
      "vocabify",
      JSON.stringify({
        isLoggedIn: false,
        token: "",
        knownWords: [],
        unknownWords: [],
        vocabSize: "",
        savedDefinitions: []
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
