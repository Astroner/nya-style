var units = {
	width: "vw",
	height: "vh",
	margin: "px",
	padding: "px",
	"max-width": "vw",
	"min-width": "vw",
	"max-height": "vh",
	"min-height": "vh",
	transition: "s",
	border: "px",
	"border-left": "px",
	"border-right": "px",
	"border-top": "px",
	"border-bottom": "px",
	outline: "px",
	"font-size": "px",
	"border-radius": "px",
	"box-shadow": "px"
};

//Добавляет единицы измерения к свойствам
function measured(name, value) {
	//name = "padding", value = "10px"/"10"/"10px auto"/"10 auto"
	//Проверяем на наличие дефолтных единиц измерения в units{}
	if (!units[name]) {
		return value
	}
	//Если есть, то разбиваем строку на слова, работаем с ними и join'им в строку
	return (value + "").split(" ").map(function ( item, index ) {
		//Если item - число, то добавляем единицы измерения, т.е. в item'е нет px/vh e.t.c. 
		if (Number(item)) {
			//Потому что если они есть, то Number вернёт NaN(false)
			return item + units[name]
		}
		return item;
	}).join(" ");
}

//Устанавливает default'ные удиницы измерения для величин
function setUnits(uns) {
	units = uns;
}

module.exports = {
	units: units,
	measured: measured,
	setUnits: setUnits
}