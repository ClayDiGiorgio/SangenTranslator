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
	englishText = englishText.toLowerCase();//.replace(/\./g, "").replace(/,/g, ""); // sanitize
	
	// TODO: unconjugate verbs, doing both regular and irregular
	// found here: https://en.wikipedia.org/wiki/List_of_English_irregular_verbs
	// or here: https://www.online-languages.info/english/irregular_verbs.php?l=1
	// or even here: https://www.scientificpsychic.com/verbs1.html
	
	console.log("---------------\n"+englishText);
	
	//
	// make verbs to be infinitive form
	//
	englishText = englishText.replace(/\./g, " .").replace(/,/g, " ,");
	englishTextWords = englishText.split(" ");
	englishText = "";
	englishTextWords.forEach(function(word) {
		let retval = trieGet(irregularEnglishVerbs, word);
		
		console.log("\t\t" + word);
		
		if(retval[0].startsWith("noentry") || retval[0].startsWith("nodefinition")) {
			englishText += word + " ";
		} else {
			englishText += "to " + retval[0] + " ";
		}
	});
	
	console.log(englishText + "\n");
	
	//
	// translate
	//
	
	while(englishText != "") {
		switch(englishText.charAt(0)) {
			case ",": // fallthrough is intentional
			case ".":
			case "<":
			case ">":
				translation.push([englishText.charAt(0)]);
			case " ": // fallthrough is intentional
				englishText = englishText.substring(1);
				continue;
		}
	
		let retrieval = trieGetLongestPrefix(toSangenDictionary, englishText);
		
		// if the retrieval failed to get a single letter, that means that the
		// whole next word isn't in the trie, this allows the translator to
		// recognize and report that
		if(retrieval.data[0].match(/noletter_\w/)) {
			let wordEnd = englishText.indexOf(" ");
			if(!englishText.charAt(wordEnd-1).match(/\w/)) wordEnd--;
			
			retrieval.remaining = englishText.substring(wordEnd);
			retrieval.data = trieGet(toSangenDictionary, englishText.substring(0, wordEnd));
		}
		
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
	
	let space = false;
	
	translation.forEach(function(translatedWord) {
		if(translatedWord == undefined) return;
	
		// if this is a noletter entry, then we don't want a space
		if(space || !translatedWord[0].startsWith('noletter'))
			translatedTextElement.appendChild(makeSpaceElement());
				
		if(translatedWord[0].startsWith('noletter'))
			space = false;
		else 
			space = true;
	
		if(translatedWord.length == 1) {
			var wordElement = document.createElement("SPAN");
			if(translatedWord[0].charAt(0) != '.' && translatedWord[0].charAt(0) != ',')
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

trie: {
	n: {o:{values:["negation"]} values:undefined}
	N: {o:{values:["super negation"]} values:undefined}
	o: {values:["a word"]}
	a: {o:{values:["(n) some meaning", "(n) other meaning"]} values:["(v) another meaning", "(n) second meaning"]}
	value:undefined
}

*/
