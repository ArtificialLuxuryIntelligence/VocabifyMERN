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
        token: null,
        vocabSize: null,
        savedDefinitions: null,
        words: null,
        lang: null
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
