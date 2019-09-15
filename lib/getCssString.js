var Units = require('./units.js');//Units API
var Tech = require('./tech.js');//Tech PURE funs
var Media = require('./media.js');//Media API
var Descriptor = require("./descriptor.js")//Descriptor for structures
var Alphabet = require('./alphabet.js')//Alphabet API
var Patterns = require('./patterns.js')//Patterns for classes

//превращает {selector:".test", rules:{ color: white }} в .test{ color: white }
function getCssString(item, namespace) {
	/*
	item = {
		selector: ".test",
		rules:{
			color: white
		}
	}
	namespace = ".namespace"
	*/
	if (item.selector == "media") {//Прверка на медиа запрос
		Media.addMedia(namespace, item.rules);//Если да, то добавляем его в массив запросов через функцию
		return "";
	}
	//Проверка на функцию в руте
	if (item.rules.constructor.name=="Function") {
		return item.rules(Descriptor)("ROOT", item.selector)
	}

	var result = "",//результирущая строка
		prefix = "",//префикс для реализации вложений
		childrens = "",//строка для вложенных стилей
		transitions = [],
		aditions = "",
		fullName = "";
	if (namespace) {//если обрабатываеммый item вложен, то добавляем к нему namespace
		if (item.selector[0] !== ":" && item.selector[0] !== "_") {
			prefix = namespace + " ";
		} else {
			prefix = namespace;
		}
	}

	var indexOfDots = item.selector.indexOf("::");
	if (indexOfDots!==-1 && indexOfDots!==0) {
		var chilPat = item.selector.split("::");
		item.selector = chilPat[0];
		var pattern = Patterns.getPattern(chilPat[1]);
		if (pattern) {
			item.rules = Object.assign({}, pattern, item.rules);
		}else{
			console.error("There is no such pattern named '" + chilPat[1] + "'")
		}
	}

	fullName = prefix + item.selector;
	result += fullName + " {";

	//Прогоняем каждое правило в rules
	for (var key in item.rules) {
		if (item.rules.hasOwnProperty(key)) {			
			if (!item.rules[key] && item.rules[key]!==0) {
				console.error('Empty key-value pair.', { key: key, selector: fullName });
				throw new Error('Empty key-value pair.')
			}

			if (key[0]==="$") {
				if (key==="$CSS") {
					result += item.rules[key] + ";";
					continue
				}else{
					result += Alphabet.getString(key.slice(1), item.rules[key]);
					continue
				}
			}

			var parsedKey = Tech.CamelCaseParse(key),
				Type = item.rules[key].constructor.name;

			switch(Type) {
				case "String":
				case "Number":
					if (key == "transition") {
						transitions.default = Units.measured(parsedKey, item.rules[key]);
					} else {
						//Возвращаем пару ключ: значение, где значение прогоняется через валидатор, добавляющий ед. измерения.
						result += parsedKey + ": " + Units.measured(parsedKey, item.rules[key]) + ";";
					}
					break;
				case "Array":
					transitions.push({
						name: key,
						dur: item.rules[key][1],
						fun: item.rules[key][2],
						del: item.rules[key][3],
					});
					result += parsedKey + ": " + Units.measured(parsedKey, item.rules[key][0]) + ";";
					break;
				case "Object":
					//Если тип свойстав - объект, значит это вложенность, а значит отправляем его в в getCssString c префиксом в параметрах. Такая рекурсия
					childrens += getCssString({ selector: key, rules: item.rules[key] }, fullName)
					break;
				case "Function":
					aditions+=item.rules[key](Descriptor.getUse())(fullName, key);
					break;
			}
		}
	}
	//Добавляем в result transition
	result += Tech.setTransition(transitions);
	//Закрываем стил. Добавляем к нему потомков
	return result + "} " + childrens + aditions;
}



module.exports = getCssString;