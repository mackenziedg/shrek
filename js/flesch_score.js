function updateScore() {

    var text = document.getElementById('reading_level').value
    text = text + " ";
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
    var re = /\S+/g;
    var out =[];
    var match;
    while ((match = re.exec(text)) != null){
        out.push(match[0])
    }
    syllable_count = 0

    for (var i = 0; i < out.length; i++) {
        syllable_count = syllable_count + count_syllable_for_word(out[i])
    }
    return syllable_count 
}

function count_syllable_for_word(word) {
    word = word.toLowerCase();                                     //word.downcase!
    if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
      word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
      return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
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
    var score_result = (SENTENCE_WEIGHT * (counts.word / counts.sentence)) + (WORD_WEIGHT * (counts.syllable / counts.word)) - ADJUSTMENT;
    if (isFinite(score_result) && !isNaN(score_result)){
        score_holder.innerHTML = precisionRound(score_result, 2);
    }
}