function translateFromSangen(conlangText, toEnglishDictionary, translatedTextElement) {
	//var toEnglishDictionary = dictionary;//JSON.parse(dictionary);

	console.log(conlangText);
	
	// remove all punctuation from text, split text into individual words, remove all empty strings from that list of words
	//var words = conlangText.replace(/\./g, "").replace(/,/g, "").split(" ").filter(word => word.length > 0);
	
	// change latin into regular ipa 
	conlangText = formatSangen(conlangText);
	let words = conlangText.replace(/\./g, "").replace(/,/g, "").split(" ").filter(word => word.length > 0); // split into array of words, remove empty strings
	
	
	//translatedTextElement.appendChild(makeSpaceElement());
	let translation = [];
	
	
	//var translation = "";
	for(var i = 0; i < words.length; i++) {
		word = words[i];
	
		var translatedWord = "";
		
		// remove the part of speech modifier from every entry in this word's meanings
		translatedWord = trieGet(toEnglishDictionary, word);//[0].replace(/\(.\) /, "");
	
		if(translatedWord[0].startsWith("noentry") || translatedWord[0].startsWith("nodefinition")) {
			// no definition found so this may be a conjugated verb, try to remove a two vowel prefix
			// and then try again
			var prefix = word.substring(0,2);
			word = word.substring(2);
		
			prefix = trieGet(toEnglishDictionary, prefix);//[0].replace(/\(.\) /, "");
			word   = trieGet(toEnglishDictionary, word);  //[0].replace(/\(.\) /, "");
						
			if(prefix[0].startsWith("noentry") || prefix[0].startsWith("nodefinition") ||
			   word[0].  startsWith("noentry") || word[0].  startsWith("nodefinition")) {
				// I didn't feel like DeMorgan's-ing the above condition. This body left blank
				// so I can use the else statement
			} else {
				//translatedWord = prefix+ ": " + word;	
				
				// prefixes only have one meaning: the tense of the attatched verb
				translation.push(prefix);
				
				// update the actual meaning of the word to the meaning of the root verb
				translatedWord = word;
			}
		}
		
		translation.push(translatedWord);
		
	}
	
	console.log(translation);
	return translation;
}

function translateToSangen(englishText, toSangenDictionary, translatedTextElement) {
	let translation = [];
	englishText = englishText.toLowerCase().replace(/\./g, "").replace(/,/g, ""); // sanitize
	console.log("---------------\n"+englishText);
	
	while(englishText != "") {
		if(englishText.charAt(0) == " ") {
			englishText = englishText.substring(1);
			continue;
		}
	
		let retrieval = trieGetLongestPrefix(toSangenDictionary, englishText);
		englishText = retrieval.remaining;
		translation.push(retrieval.data);
		
		console.log(englishText);
	}
	
	console.log(translation);
	
	return translation;
}

/**
 * takes a translation array and makes a UI representation of it in HTML
 *
 */
function translationToHTML(translation, translatedTextElement) {
	translatedTextElement.appendChild(makeSpaceElement());
	
	translation.forEach(function(translatedWord) {
		if(translatedWord == undefined) return;
	
		if(translatedWord.length == 1) {
			var wordElement = document.createElement("SPAN");
			wordElement.className = "translated-word-single";
			wordElement.innerText = " " + translatedWord[0].replace(/\(.\) /, "") + " ";
			translatedTextElement.appendChild(wordElement);
		} else {
			var dropdownParent = document.createElement("SPAN");
			dropdownParent.className = "translated-word-dropdown-parent";
			
			var dropdown = document.createElement("SELECT");
			dropdown.className = "translated-word-dropdown";
			dropdown.options.add(new Option(""));
			dropdownParent.appendChild(dropdown);
			
			for(var j = 0; j < translatedWord.length; j++) {
				dropdown.options.add(new Option(translatedWord[j]));//.replace(/\(.\) /, "")));
			}
			
			translatedTextElement.appendChild(dropdownParent);
		}
		
		translatedTextElement.appendChild(makeSpaceElement());
	});
}

function makeSpaceElement() {
	let spaceElement = document.createElement("SPAN");
	spaceElement.className = "translated-word-space";
	spaceElement.innerText = "----";
	return spaceElement;
}

function trieGet(trie, key) {
	for(let i = 0; i < key.length; i++) {
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

// returns the data associated with longest prefix of key that is an entry in the trie,
// along with the rest of the key
function trieGetLongestPrefix(trie, key) {
	console.log("searching for *" + key + "* length: " + key.length);
	let lastDataNode = trie;
	let lastDataI = -1;
	
	for(var i = 0; i < key.length; i++) {
		if(trie[key.charAt(i)] == undefined) // just keep going until you can't
			break;
		
		trie = trie[key.charAt(i)];
		if(trie.values != undefined) {
			lastDataNode = trie;
			lastDataI = i+1;
		}
		
		console.log("\tfound letter " + i + ": " + key.charAt(i));
	}
	
	let data = [];
	if(trie == undefined)
		data = ["noentry_"+key];
	if(trie.values == undefined)
		data = ["nodefinition_"+key];
	
	data = lastDataNode.values;
	
	// if the first letter isn't even in the trie at all
	if(lastDataI == -1) {
		data = ["noletter_"+key.charAt(0)];
		lastDataI = 1;
	}
	
	console.log("\tdata: " + data);
	
	let remain = key.substring(lastDataI);
	console.log("\tremain: *" + remain);
	return {"data":data, "remaining":remain };
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
