var express = require("express");
var router = express.Router();
const axios = require("axios");

const User = require("../models/User");
const freqList = require("../data/freqList");

var isAuthenticated = require("../middleware/isAuthenticated");

// --- Helper functions
// API requests

// generates array of fetch requests (one per word)
const fetchArray = (wordArray, lang) => {
  return wordArray.map(word =>
    axios.get(
      "https://mydictionaryapi.appspot.com/?define=" +
        word.trim() +
        "&lang=" +
        lang
    )
  );
};
// API fetch request
async function fetchDefinitions(wordArray, lang) {
  //   console.log(wordArray);
  let responses;
  try {
    responses = await Promise.allSettled(fetchArray(wordArray, lang));
    // console.log(responses);
  } catch (err) {
    console.log(err);
  }
  let obj = responses
    .map(res => (res.status === "fulfilled" ? res.value.data : null))
    .filter(def => def !== null);
  // console.log(obj);
  return obj;
}

// Internal freqList calculations

// estimates users vocab size

const estimateUserVocab = (knownWords, unknownWords) => {
  console.log("estimating vocab size ...");
  console.log(unknownWords);

  if (unknownWords.length < 3) {
    return 200;
  } else {
    let indexArray = [];

    unknownWords.forEach(word => {
      indexArray.push(freqList.indexOf(word));
      console.log(word, freqList.indexOf(word));

      indexArray = indexArray.filter(index => index > 0); // only uses words that are in the freqList
      vocabSize = indexArray.reduce((a, b) => a + b, 0) / indexArray.length;

      //CALLIBRATION - brings down estimate by 10% (catches more words)
      callibratedVocabSize = Math.floor(vocabSize - vocabSize / 10);

      // userVocab = freqList.slice(0, user.myVocabSize);
    });
    console.log("Callibrated vocab size:", callibratedVocabSize);
    return callibratedVocabSize;
  }
};

//filter word array based on vocab size // duplicates etc handled client side

// ------FILTERS
const filterGivenVocabSize = (vocabSize, unknownWords, queryWords) => {
  //unfortunately this filters out words that are not exact matches of unknown words.
  //i.e. 'articles' filtered out if in the calculated userVocab even if 'article' is 'unknownWord';
  //only solution is to check every word/[no] // have more sophisticated word list with conjugations etc grouped [list not readily available]
  let userVocab = freqList.slice(0, vocabSize);
  let filteredWords = queryWords.filter(
    word => userVocab.indexOf(word) === -1 || unknownWords.indexOf(word) !== -1
  );
  console.log(
    " removed (reason: given calculated vocab size)",
    queryWords
      .filter(x => !filteredWords.includes(x))
      .concat(filteredWords.filter(x => !queryWords.includes(x)))
  );

  return filteredWords;
};

const filterGivenUserWords = (knownWords, unknownWords, queryWords) => {
  let filteredWords = queryWords.filter(
    word => knownWords.indexOf(word) === -1 || unknownWords.indexOf(word) !== -1
  );
  console.log(
    "removed (reason: given user words)",
    queryWords
      .filter(x => !filteredWords.includes(x))
      .concat(filteredWords.filter(x => !queryWords.includes(x)))
  );
  return filteredWords;
};

const filterDefinitions = (
  knownWords,
  unknownWords,
  vocabSize,
  definitions
) => {
  let userVocab = freqList.slice(0, vocabSize);

  let definitionWords = definitions.map(x => x[0].word);
  console.log("definitions received: ", definitionWords.length);
  console.log("definitions:", definitions.length);

  definitionWords.forEach(word => {
    console.log("checking", word);
    let bool = userVocab.indexOf(word) >= 0 ? true : false;
    let bool2 = knownWords.indexOf(word) >= 0 ? true : false;

    if (bool || bool2) {
      if (unknownWords.indexOf(word) !== -1) {
        return; // don't filter out unknown words
      }
      let i = definitionWords.indexOf(word);
      console.log(
        "***definition removed from results (reason: found in calculated vocabsize or is in knownwords):",
        // definitions[i],
        definitionWords[i],
        "at index:",
        i
      );

      definitionWords = definitionWords.filter((def, index) => index != i);
      definitions = definitions.filter((def, index) => index != i);
    }
  });
  console.log("returning definitions of", definitionWords);

  return definitions;
};

async function getRandomWord(wordRange, lang, attempts) {
  let randomWord = wordRange[Math.floor(Math.random() * wordRange.length)];
  attempts--;
  try {
    let definition = await fetchDefinitions([randomWord], lang);
    console.log(randomWord, definition.length);
    if (definition.length === 1) {
      //definition returned
      return { success: true, definition };
    } else if (attempts > 0) {
      console.log("no def, getting new word");
      return await getRandomWord(wordRange, lang, attempts);
    } else {
      throw err;
    }
  } catch (err) {
    console.log("unsuccessful attempt");
    return { success: false };
  }
}

// -------------------------------

// ---------- ROUTES ----------

//these should be get requests with token in header.. right?

//Get word definitions

router.post("/definitions", isAuthenticated, async (req, res, next) => {
  console.log("getting definitions");

  let queryWords = req.body.words;
  let lang = req.body.lang;
  let filter = req.body.filter;
  let knownWords = req.body.knownWords;
  let unknownWords = req.body.unknownWords;

  let vocabSize = estimateUserVocab(knownWords, unknownWords);
  console.log("Vocab Size:", vocabSize);

  // filters out words that are calculated to be known by user ----
  if (filter === "true") {
    console.log(" ----------------------------filtering...");
    console.log(queryWords);
    queryWords = filterGivenVocabSize(vocabSize, unknownWords, queryWords);
    // console.log(queryWords);
    queryWords = filterGivenUserWords(knownWords, unknownWords, queryWords);
    // console.log(queryWords);
  }
  // ---------------------------------------------------------------
  console.log("fetching...");
  console.log(queryWords, lang);

  let definitions = await fetchDefinitions(queryWords, lang).catch(err => err);

  // filter returned defintions for known words
  if (filter === "true") {
    definitions = filterDefinitions(
      knownWords,
      unknownWords,
      vocabSize,
      definitions
    );
  }

  let response = { definitions, vocabSize };
  // console.log(response);

  res.send(response);
});

// ---------- Update user word info // vocab size/known words array/unknown words array----------

//---PROTECTED

router.post("/updateuser", isAuthenticated, (req, res, next) => {
  let token = req.body.token;
  let id = req.body.id; //note token is (currently in this version) user id (separate here for clarity)
  let unknownWords = req.body.unknownWords;
  let knownWords = req.body.knownWords;
  let vocabSize = req.body.vocabSize;

  User.findOneAndUpdate(
    {
      _id: id
    },
    {
      unknownWords,
      knownWords,
      vocabSize
    },
    { upsert: true },
    (err, user) => {
      if (err) {
        res.send({
          message: err
        });
      } else {
        res.send({ message: "user updated", user });
      }
    }
  );
});

router.post("/random", isAuthenticated, async (req, res, next) => {
  let vocabSize = req.body.vocabSize;
  let knownWords = req.body.knownWords;
  let unknownWords = req.body.unknownWords;
  let lang = req.body.lang;
  // console.log(req.body);

  let range = 500; //make dynamic? could get bigger for higher vocabSizes...
  let min = vocabSize - range < 0 ? 0 : vocabSize - range;
  let max =
    vocabSize + range > freqList.length ? freqList.length : vocabSize + range;

  console.log(min, max);

  let wordRange = freqList.slice(min, max); // set min/max-length
  console.log(wordRange);

  let response = await getRandomWord(wordRange, lang, 3).catch("err");

  res.send(response);
});

module.exports = router;
