export var errorWordTpl = function( errorWord, errorFix ) {
	return `
	<div class='errors' data-word='${errorWord}'>
		<div class='error_word'>${errorWord}</div>
		<div class='suggest_words'>${errorFix}</div>
	</div>
	`;
}

export var wrapWordTpl = function( selector, word ) {
	return `<span class='${selector}' style='background-color:yellow;'>${word}</span>`;
}