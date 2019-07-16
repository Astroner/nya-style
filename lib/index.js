var 
Units = require('./units.js'),//Units API
Tech = require('./tech.js'),//Tech PURE funs
getCssString = require('./getCssString.js'),//parse func
Media = require('./media.js'),//Media API
Alphabet = require('./alphabet.js'),//Alphabet API
Descriptor = require('./descriptor.js');

//Запускает парсер js2css
function startStyle(object, units, alph, uses, mode){ 
	Units.setUnits(units);
	Alphabet.setRules(alph);
	Descriptor.setUse(uses);

	var cssAsObj = [];//Массив со стилями
		result = "";//Результирующая строка

	//Форматируем ввод.
	for (var name in object) {
		if (object.hasOwnProperty(name)) {
			if (name == "media") {
				Media.addGlobalMedia(rules);
				return
			}
			cssAsObj.push({
				selector: name,
				rules: object[name]
			});
		}
	}


	cssAsObj.forEach(function (elem) {//перерабатываем массив стилей
		result += getCssString(elem);//превращает {selector:".test", rules:{ color: white }} в .test{ color: white }
	});

	result += Media.getMedia();

	if (mode) {
		window.open('about:blank', '_blank').document.body.innerText = result;
	}
	return result
}

module.exports = function StyleSheet(def) {
	var units = Units.units,//defUnits
		rules = {},//empty rules obj
		alphabet = {},
		uses = {};
	if (def && def.constructor.name==="Object") {
		rules = def;	
	}
	function startParse(mode) {//starter
		return startStyle(rules, units, alphabet, uses, mode)
	}
	return {
		setRules: function(arg){
			if (!arg||arg.constructor.name!=="Object") {
				return this
			}
			rules = arg;
			return this;
		},
		setUnits: function(newUn, merge){
			if (!merge) {
				units = Object.assign({}, units, newUn);
			}else{
				units = newUn;
			}
			return this;
		},
		parse: startParse,
		setAlph: function(al){
			alphabet = al;
			return this
		},
		use: function (name, cb) {
			uses[name] = cb;
			return this
		}
	}
}