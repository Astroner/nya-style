var Tech = require('./tech.js'),//Tech PURE funs
	Units = require('./units.js'),//Units API
	Uss = {
		anim: anim
	}

function anim(rules) {
	var payload = "{";
	Object.keys(rules).forEach(function (key){
		var opt = rules[key];
		payload+= key + "{";
		Object.keys(opt).forEach(function (prop){
			parsedProp = Tech.CamelCaseParse(prop);
			payload+= parsedProp + ": " + Units.measured(parsedProp, opt[prop]) + ";"
		})
		payload+= "}";
	})
	payload+= "}";
	return function(name, key){
		return "@keyframes " + key + payload
	}
}

exports.getUse = function getUse() {
	return Uss	
}
exports.setUse = function setUse(arg) {
	Uss = Object.assign({}, Uss, arg)
}