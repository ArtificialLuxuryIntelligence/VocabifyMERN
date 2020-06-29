const auth = {
  loggingIn() {
    localStorage.setItem("vocabify", JSON.stringify({ isLoggedIn: true }));
  },
  loggingOut() {
    //currently removes all
    //send app data back to server here?
    localStorage.setItem("vocabify", JSON.stringify({}));
  },

  isLoggedIn() {
    let obj = JSON.parse(localStorage.getItem("vocabify"));
    if (obj && obj.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  },
};

export default auth;
