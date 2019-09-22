function formatSangen(inputString) {
	inputString = inputString.replace(/S/g, "ʃ");
	inputString = inputString.replace(/T/g, "θ");
	inputString = inputString.replace(/U/g, "ɯ");
	inputString = inputString.replace(/u/g, "ə");

	inputString = inputString.replace(/χ/g, "X"); // one of two IPA -> latin
	inputString = inputString.replace(/ʝ/g, "j");
	
	//inputString.replace("\\.", " \\.");
	
	// punctuation 
	inputString = inputString.replace(/ \./g, "q");
	inputString = inputString.replace(/\./g, "q");
	inputString = inputString.replace(/q/g, " .");
	
	inputString = inputString.replace(/ ,/g, "q");
	inputString = inputString.replace(/,/g, "q");
	inputString = inputString.replace(/q/g, " ,");
	
	inputString = inputString.replace(/\< /g, "<");
	inputString = inputString.replace(/ \>/g, ">");
	
	
	// numbers
	inputString = inputString.replace(/00/g, "0_");
	inputString = inputString.replace(/_0/g, "__");
	
	return inputString;
}

function buildTranscriptionHTML(container, formattedSangen) {
	//container.innerText = formattedSangen;
	//return;

	let words = formattedSangen.split(" ");
	
	words.forEach(function(word) {
		if(word.startsWith("noentry_") || word.startsWith("nodefinition_")) {
			let wordElement = document.createElement("SPAN");
			wordElement.className = "transcribed-sangen-text_failed-translation";
			wordElement.innerText = word.substring(1+word.indexOf("_")) + " ";
			container.appendChild(wordElement);
		} else {
			let lastSpan = document.createElement("SPAN");
			lastSpan.className = "transcribed-sangen-text";
			lastSpan.innerText = lastSpan.innerText + word + " ";
			container.appendChild(lastSpan);
		}
	});
	
	/*
	var wordElement = document.createElement("SPAN");
	if(translatedWord[0].charAt(0) != '.' && translatedWord[0].charAt(0) != ',')
	wordElement.className = "translated-word-single";
	wordElement.innerText = " " + translatedWord[0].replace(/\(.\) /, "") + " ";
	translatedTextElement.appendChild(wordElement);*/
}
