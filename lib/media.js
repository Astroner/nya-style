var getCssString = require('./getCssString.js');

var media = [];//массив с media queries

//Добавляет форматированный объект в объект media
function addMedia(target, rules) {
	//target = ".test"
	/*rules = {
		"(max-width: 100px)":{
			color: black
		}
	}*/
	//Проходимся по всем rules
	for (var prop in rules) {
		if (rules.hasOwnProperty(prop)) {
			//Если такого ключа в объекте media не существует, то добавляем его
			if (!media[prop]) {
				media[prop] = [];
			}
			//добавляем по ключу селектор и rules
			media[prop].push({ selector: target, rules: rules[prop] });
		}
	}
}


//Обработчик для добавления глобальных media
function addGlobalMedia(rules) {
	for (var key in rules) {
		if (rules.hasOwnProperty(key)) {
			if (!media[key]) {
				media[key] = [];
			}
			for (var selector in rules[key]) {
				if (rules[key].hasOwnProperty(selector)) {
					media[key].push({ selector: selector, rules: rules[key][selector] });
				}
			}
		}
	}
}

function getMedia() {
	var result = "";
	//Добавляем в конце все media запросы, полученные в процессе выше
	for (var prop in media) {
		if (media.hasOwnProperty(prop)) {
			result += "@media screen and " + prop + "{";

			media[prop].forEach(function (elem) {
				result += getCssString(elem)
			})

			result += "}";
		}
	}
	return result;
}
exports.addMedia = addMedia
exports.addGlobalMedia = addGlobalMedia
exports.getMedia = getMedia