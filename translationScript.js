function translateToEnglish(conlangText) {
	console.log(dictionary);
	var toEnglishDictionary = JSON.parse(dictionary);

	var words = conlangText.replace(/\./g, "").replace(/\,/g, "").split(" ");
	
	var translation = "";
	for(word in words) {
		var translatedWord = trieGet(toEnglishDictionary, word)[0];
		if(translatedWord == undefined) {
			var prefix = word.substring(0,2);
			word = word.substring(2);
			
			translatedWord = trieGet(toEnglishDictionary, prefix)[0] + trieGet(toEnglishDictionary, word)[0];
		}
		
		translation = translation + translatedWord + " ";
	}
	
	return translation;
}

function trieGet(trie, key) {
	for(var i = 0; i < key.length; i++) {
		if(trie == undefined)
			return undefined;
		trie = trie[key.charAt(i)];
	}
	
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
