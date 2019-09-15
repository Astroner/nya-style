var patterns = {};

function setPatterns(ptrs) {
	patterns = ptrs;
}

function getPattern(name) {
	return patterns[name];
}

module.exports = {
	setPatterns: setPatterns,
	getPattern: getPattern
}