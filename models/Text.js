const mongoose = require("mongoose");
const TextSchema = new mongoose.Schema({
  textString: {
    type: String,
    default: "",
  },
  level: {
    type: Object,
    //text will be KEY if your vocab level is VALUE words
    //maybe do with ranges?
    //numbers derived from thresholds at 85% 70& 50%?
    default: { easy: 500, medium: 250, hard: 50 },
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
  lang: {
    type: String,
    default: "en",
  },
});

module.exports = mongoose.model("Text", TextSchema);
