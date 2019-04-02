const userInput = document.getElementById('conlang input');
const output = document.getElementById('transcribed text');

userInput.oninput = function() {
	var inputString = userInput.value + "";
	
	inputString = formatSangen(inputString);
	
	console.log(inputString);

	//inputString.replace("sX", "x"); // potential future glyph 

	output.innerText = inputString;
}; 

function formatSangen(inputString) {
	inputString = inputString.replace(/S/g, "ʃ");
	inputString = inputString.replace(/T/g, "θ");
	inputString = inputString.replace(/U/g, "ɯ");
	inputString = inputString.replace(/u/g, "ə");

	inputString = inputString.replace(/χ/g, "X"); // one of two IPA -> latin
	inputString = inputString.replace(/ʝ/g, "j");
	
	//inputString.replace("\\.", " \\.");
	
	inputString = inputString.replace(/ \./g, "q");
	inputString = inputString.replace(/\./g, "q");
	inputString = inputString.replace(/q/g, " .");
	
	inputString = inputString.replace(/ ,/g, "q");
	inputString = inputString.replace(/,/g, "q");
	inputString = inputString.replace(/q/g, " ,");
	
	inputString = inputString.replace(/00/g, "0_");
	inputString = inputString.replace(/_0/g, "__");
	
	return inputString;
}
