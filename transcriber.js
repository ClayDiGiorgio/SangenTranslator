const userInput = document.getElementById('conlang input');
const output = document.getElementById('transcribed text');

userInput.oninput = function() {
	var inputString = userInput.value + "";
	inputString = inputString.replace(/sh/g, "ʃ");
	inputString = inputString.replace(/th/g, "θ");
	inputString = inputString.replace(/uu/g, "ɯ");

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
	
	//inputString = inputString.replace("_0", "__");
	/*
	inputString = inputString.replace("_", "q");
	inputString = inputString.replace("0", "_");
	inputString = inputString.replace("q", "0");
	*/
	console.log(inputString);

	//inputString.replace("sX", "x"); // potential future glyph 

	output.innerText = inputString;
};
