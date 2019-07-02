var Media = require('./media.js')

//Превращает КамелКейс в нормальные-слова
function CamelCaseParse(str) {
	//str = camelCase -> camel-case
	return str.replace(/[A-Z]/g, function (a) {
		return "-" + a.toLowerCase();
	})
}

function setTransition(rules) {
	//Отсеиваем пустые rules
	if (!rules.length&&!rules.default) {
		return ""
	}
	//Отсеиваем те, где есть только default
	if (!rules.length&&rules.default) {
		return "transition: " + rules.default + ";"
	}

	var result = "transition: ";
	//Если есть дефолтный, то добавляем его
	if (rules.default) {
		result+= rules.default + ",";
	}

	//Пробегаемся по
	rules.forEach(function (item, index) {
		if (index!==0) result+=",";
		result+=" " + CamelCaseParse(item.name);
		if(item.dur) result+=" " + item.dur + "s";
		if(item.fun) result+=" " + item.fun;
		if(item.del) result+=" " + item.del + "s";
	})
	return result + ";"
}

exports.CamelCaseParse = CamelCaseParse;
exports.setTransition = setTransition;