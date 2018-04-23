function updateScore() {
    console.log("RUNNIN");
    var text = document.getElementById('reading_level').value
    console.log(text);
    var counts = createCounts(text);
    var reading_level = calculateReadingLevel(counts);
    return reading_level;
  }

// calculate sentences
// Calculate words
// Calculate syllables

function countSentences(text){
    var re = /\w[.?!](\s|$)/g;
    return ((text || '').match(re) || []).length
}

function countWords(text){
    var re = /\S+/g;
    return (( text || '').match(re) || []).length
}

function countSyllables(text){

}

function createCounts(text){
    var sentences = countSentences(text);
    var words = countWords(text);
    var syllables = countSyllables(text);

    return {"word": words,
            "sentence": sentences,
            "syllable": syllables}
    return counts;
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }
  
function calculateReadingLevel(counts){
    var SENTENCE_WEIGHT = 0.39;
    var WORD_WEIGHT = 11.8;
    var ADJUSTMENT = 15.59;
    var score_holder = document.getElementById('flesch_num')
    var score_result = (SENTENCE_WEIGHT * (counts.word / counts.sentence)) +
    (WORD_WEIGHT * (counts.syllable / counts.word)) -
    ADJUSTMENT;
    score_holder.innerHTML = precisionRound(score_result, 2);
}