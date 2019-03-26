function translateFromSangen(conlangText, toEnglishDictionary) {
	//var toEnglishDictionary = dictionary;//JSON.parse(dictionary);

	console.log(conlangText);
	
	// remove all punctuation from text, split text into individual words, remove all empty strings from that list of words
	var words = conlangText.replace(/\./g, "").replace(/,/g, "").split(" ").filter(word => word.length > 0);
	
	console.log(words);
	
	var translation = "";
	for(var i = 0; i < words.length; i++) {
		word = words[i];
	
		// remove the part of speech modifier
		var translatedWord = trieGet(toEnglishDictionary, word)[0].replace(/\(.\) /, "");
		
		if(translatedWord.startsWith("noentry") || translatedWord.startsWith("nodefinition")) {
			// no definition found so this may be a conjugated verb, try to remove a two vowel prefix
			// and then try again
			var prefix = word.substring(0,2);
			word = word.substring(2);
			
			translatedWord = trieGet(toEnglishDictionary, prefix)[0].replace(/\(.\) /, "") + trieGet(toEnglishDictionary, word)[0].replace(/\(.\) /, "");
		}
		
		translation = translation + "[" + translatedWord + "] ";
	}
	
	return translation;
}

function trieGet(trie, key) {
	for(var i = 0; i < key.length; i++) {
		if(trie == undefined)
			break;
		trie = trie[key.charAt(i)];
	}
	
	if(trie == undefined)
		return ["noentry_"+key];
	if(trie.values == undefined)
		return ["nodefinition_"+key];
	
	return trie.values;
}

/*
function startRead() {
  // obtain input element through DOM

  var file = document.getElementById('dictionary_toEnglish');
  if(file){
    return getAsText(file);
  }
}

function getAsText(readFile) {

  var reader = new FileReader();

  // Read file into memory as UTF-16
  reader.readAsText(readFile, "UTF-16");

  // Handle progress, success, and errors
  reader.onprogress = updateProgress;
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

function updateProgress(evt) {
  if (evt.lengthComputable) {
    // evt.loaded and evt.total are ProgressEvent properties
    var loaded = (evt.loaded / evt.total);
    if (loaded < 1) {
      // Increase the prog bar length
      // style.width = (loaded * 200) + "px";
    }
  }
}

function loaded(evt) {
  // Obtain the read file data
  var fileString = evt.target.result;
  // Handle UTF-16 file dump
  if(utils.regexp.isChinese(fileString)) {
    //Chinese Characters + Name validation
  }
  else {
    // run other charset test
  }
  // xhr.send(fileString)
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
    // The file could not be read
  }
}
*/

/*

trie: {
	n: {o:{values:["negation"]} values:undefined}
	N: {o:{values:["super negation"]} values:undefined}
	o: {values:["a word"]}
	a: {o:{values:["(n) some meaning", "(n) other meaning"]} values:["(v) another meaning", "(n) second meaning"]}
	value:undefined
}

*/
