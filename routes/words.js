var express = require("express");
var router = express.Router();
const axios = require("axios");

const User = require("../models/User");

// one data souce for freq words. better lists in next version https://github.com/hermitdave/FrequencyWords/tree/master/content/2018/fr
const freqListEN = require("../data/freqListEN");
const freqListES = require("../data/freqListES");
const freqListFR = require("../data/freqListFR");

var isAuthenticated = require("../middleware/isAuthenticated");

// --- Helper functions

//get correct language frequency list

const getFreqList = lang => {
  switch (lang) {
    case "en":
      return freqListEN;
    case "es":
      return freqListES;
    case "fr":
      return freqListFR;
  }
};

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

const estimateUserVocab = (lang, knownWords, unknownWords) => {
  console.log("estimating vocab size ...");
  console.log(unknownWords);

  let freqList = getFreqList(lang);

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
const filterGivenVocabSize = (lang, vocabSize, unknownWords, queryWords) => {
  //unfortunately this filters out words that are not exact matches of unknown words.
  //i.e. 'articles' filtered out if in the calculated userVocab even if 'article' is 'unknownWord';
  //only solution is to check every word/[no] // have more sophisticated word list with conjugations etc grouped [list not readily available]

  let freqList = getFreqList(lang);
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
    //fancy way of showing what was removed
    "removed (reason: given user words)",
    queryWords
      .filter(x => !filteredWords.includes(x))
      .concat(filteredWords.filter(x => !queryWords.includes(x)))
  );
  return filteredWords;
};

const filterDefinitions = (
  lang,
  knownWords,
  unknownWords,
  vocabSize,
  definitions
) => {
  let freqList = getFreqList(lang);
  let userVocab = freqList.slice(0, vocabSize);

  /// ----- removes duplicate words from nested array: //note: this removes duplicate results even if the object is not exactly identical (e.g. result from spanish search of 'zona' and 'zonas' both return 'zona' definition but in non-identical objects (in one there is a "" in synonyms and the other nothing..!)) therefore cannot use normal method to elimate dupes
  function removeDupes(arr) {
    let noDupes = [];
    let words = [];
    arr.map(function(x) {
      if (!words.includes(x[0].word)) {
        words.push(x[0].word);
        noDupes.push(x);
      }
    });
    return noDupes;
  }
  definitions = removeDupes(definitions);
  /// ----------------------------------------------------

  let definitionWords = definitions.map(x => x[0].word);
  console.log("definitions received: ", definitionWords.length);

  definitionWords.forEach(word => {
    console.log("checking:", word);
    let bool = userVocab.indexOf(word) >= 0 ? true : false;
    let bool2 = knownWords.indexOf(word) >= 0 ? true : false;

    if (bool || bool2) {
      if (unknownWords.indexOf(word) !== -1) {
        return; // don't filter out unknown words
      }
      let i = definitionWords.indexOf(word);
      console.log(
        "***definition removed from results (reason: found in calculated vocabsize or is in knownwords or is duplicate):",
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
  console.log("lang", lang);

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

  let vocabSize = estimateUserVocab(lang, knownWords, unknownWords);
  console.log("Vocab Size:", vocabSize);

  // filters out words that are calculated to be known by user ----
  if (filter === "true") {
    console.log(" ----------------------------filtering...");
    console.log(queryWords);
    queryWords = filterGivenVocabSize(
      lang,
      vocabSize,
      unknownWords,
      queryWords
    );
    // console.log(queryWords);
    queryWords = filterGivenUserWords(knownWords, unknownWords, queryWords);
    // console.log(queryWords);
  }
  // ---------------------------------------------------------------
  console.log("fetching...");
  console.log(queryWords, lang);

  let definitions = await fetchDefinitions(queryWords, lang).catch(err =>
    console.log(err)
  );

  // filter returned defintions for known words
  if (filter === "true") {
    definitions = filterDefinitions(
      lang,
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

// put in user route??

router.post("/updateuser", isAuthenticated, (req, res, next) => {
  // let token = req.body.token;
  let id = req.body.id; //note token is (currently in this version) user id (separate here for clarity)
  // let unknownWords = req.body.unknownWords;
  // let knownWords = req.body.knownWords;
  let words = req.body.words;
  let vocabSize = req.body.vocabSize;
  let lang = req.body.lang;

  User.findOneAndUpdate(
    {
      _id: id
    },
    {
      words,
      vocabSize,
      lang
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
  //this route doesnt estimate vocab size (uses previous calculation)
  let vocabSize = req.body.vocabSize;
  let knownWords = req.body.knownWords;
  let unknownWords = req.body.unknownWords;
  let lang = req.body.lang;
  // console.log("request language", req.body.lang);

  let freqList = getFreqList(lang);
  // console.log("freqList", freqList);

  let range = 500; //make dynamic? could get bigger for higher vocabSizes...
  let min = vocabSize - range < 0 ? 0 : vocabSize - range;
  let max =
    vocabSize + range > freqList.length ? freqList.length : vocabSize + range;

  console.log(min, max);

  let wordRange = freqList.slice(min, max); // set min/max-length
  // console.log(wordRange);

  let response = await getRandomWord(wordRange, lang, 2).catch(err =>
    console.log(err)
  );

  res.send(response);
});

module.exports = router;
