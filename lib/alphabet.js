var Units = require('./units.js'),
	rootRools = {
	a: {
		name: "align-item",
		value: {
			c: "center"
		}
	},
	b: {
		name: "border",
		value:{
			n: "none"
		},
		t:{
			name: "top",
			value: {
				a: 'auto'
			}
		},
		r:{
			name: "right",
			value: {
				a: 'auto'
			}
		},
		b:{
			name: "bottom",
			value: {
				a: 'auto'
			}
		},
		l:{
			name: "left",
			value: {
				a: 'auto'
			}
		}
	},
	c: {
		name: "color"
	},
	d: {
		name: "display",
		value: {
			f: 'flex',
			b: 'block'
		}
	},
	f: {
		name: "flex",
		d: {
			name: "direction",
			value: {
				c: "column",
				r: "row"
			}
		}
	},
	g: {
		name: "background"
	},
	h: {
		name: "height"
	},
	j: {
		name: "justify-content",
		value:{
			c: 'center',
			a: 'space-around',
			b: 'space-between'
		}
	},
	m: {
		name: "margin",
		value: {
			a: 'auto'
		},
		t:{
			name: "top",
			value: {
				a: 'auto'
			}
		},
		r:{
			name: "right",
			value: {
				a: 'auto'
			}
		},
		b:{
			name: "bottom",
			value: {
				a: 'auto'
			}
		},
		l:{
			name: "left",
			value: {
				a: 'auto'
			}
		}
	},
	o: {
		name: "opacity"
	},
	p: {
		name: "padding",
		value:{
			a: 'auto'
		},
		t:{
			name: "top",
			value: {
				a: 'auto'
			}
		},
		r:{
			name: "right",
			value: {
				a: 'auto'
			}
		},
		b:{
			name: "bottom",
			value: {
				a: 'auto'
			}
		},
		l:{
			name: "left",
			value: {
				a: 'auto'
			}
		}
	},
	r: {
		name: "border-radius"
	},
	s: {
		name: "font-size"
	},
	t: {
		name: "text-align",
		value:{
			c: 'center'
		}
	},
	u: {
		name: "cursor",
		value:{
			p: "pointer",
			d: "default"
		}
	},
	v: {
		name: "visibility",
		value: {
			v: 'visible',
			h: 'hidden'
		}
	},
	w: {
		name: "width"
	},
	x: {
		name: "left"
	},
	y: {
		name: "top"
	},
	z: {
		name: "z-index"
	},
},
	rules = {};
exports.setRules = function setRules(alph) {
	if (!alph||alph.constructor.name!=="Object") {
		console.error("alph() argument should be an Object...")
		return
	}
	rules = Object.assign({}, rootRools, alph);
}
//Получение набора пар key: value из строки типа "$hwf/d-c":"400px, 400px"
exports.getString = function getString(name, propers) {
	var result = "",//результат
		props = propers.split(","),//разбитая строка значений
		stack = 0;//Номер текщего значения
	//Перебираем каждую букву в name
	for (var i = 0; i < name.length; i++) {
		var cur = name[i];//Текущая буква
		//Если следующий символ - слеш, то это сложный (с кучей тире) ключ.
		if (name[i+1]=="/") {
			var obj = makeHard(name.slice(i), props[stack]);//Получаем распаршенную строк, сколько надо отступить и надо ли отступить в стаке
			if (obj[2]) {//Проверка на необходимость отступа в стаке
				stack++;
			}
			i+=obj[1];//отступ во всей строке
			result+=obj[0];//добавление к общему результату
			continue
		}
		if (name[i+1]=="-") {//Если следующий символ - тире, то это быстрое пресет значение.
			//Просто в общем массиве данных находим необходимое значение по ключу name[i+2] и складываем строку
			result+= rules[cur].name + ": " + rules[cur].value[name[i+2]] + ";";
			i+=2;// делаем отступ
			continue
		}
		result += rules[cur].name + ":" + Units.measured(rules[cur].name ,props[stack]) + ";";//Если нет слеша или тире, то просто добавляем имя по ключу и добавляем значение из стека.
		stack++;
	}
	return result
}

//str = "d/a/f-effnsldv...", value = "example value"
function makeHard(str, value) {
	var result = "",//Конечный результат
		usage = false,//Использовался ли value
		end = str.search(/\w\w/),//Конец подстроки со слешами(вложенностей)
		space = "",//Сама по себе строка("d/a/f-e", если брать из примера выше)
		preset = true,//Используется ли значение по тире
		ctx = {};//Контекст поиска
	if (end===-1) {//Если нет необходимой строки, то значит нет пары \w\w, а значит логичный конец - конец всей строки
		end = str.length-1;
	}
	space = str.substring(0, end+1);//Выделяем подстроку
	
	var chanks = space.split("-"),//Разделяем на имена и значение
		body = chanks[0],//имена
		val = chanks[1];//значение
	if (!val) {//Если пресет-значения нет
		val = value;//то присваиваем ему значение value
		usage = true;//Говорим, что используем value(Надо сдвинуть маркер стека)
		preset = false;//Говорим, что это не пресет
	}
	chanks = body.split("/");//Сплитим тело по слешам

	if (!rules[chanks[0]]) {//Проверка на наличие первого контекста
		console.error("error: Unknown identifier '"+chanks[0]+"';");
		return "error: Unknown identifier '"+chanks[0]+"';";
	}
	ctx = rules[chanks[0]];//Присваиваем первый контекст
	for (var i = 1; i < chanks.length; i++) {//Перебираем все буквы
		if (!ctx[chanks[i]]) {//Если контекст не находится, то останавливаем for
			break
		}
		result+=ctx.name+"-";
		ctx = ctx[chanks[i]]
	}
	result+=ctx.name + ":";
	if (preset) {//Если используется пресет value
		if (ctx.value) {//То проверяем на наличие пресетов в конечном контексте
			if (ctx.value[val]) {//Проверяем на наличие конкретного контекста
				result+=" "+ ctx.value[val] + ";"
			}else{
				console.error("UnknownPresetValue;");
				result+=" " + "UnknownPresetValue;"
			}
		}else{
			result+="error!!!!;";
		}
	}else{
		result+=val+";";
	}
	//[Резульатат, отступ, стек]
	return [result, space.length-1, usage]
}