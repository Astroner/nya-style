Nya-style is a library for css-in-js coding. 

It consists of many functions for quick development out of the box, but if you want to set up this library, I made it as simple as possible so that you create more and spend less time setting up.

### Main features
-  auto add units
-  simple **transitions**
-  selectors encapsulation

------------

### Links:
- [documentation](http://nya-style.euginelab.ru/docs/)
- [official site](http://nya-style.euginelab.ru/)

------------


### Simple Usage
```javascript 
var Style = require('nya-style'),
	style = Style();
	
	style.setRules({
		body:{
			margin: 0,
			padding: 0
		},
		".main":{
			margin: "5px auto",
			padding: "5px 0"
		}
	})
	var str = style.parse();
	console.log(str)
```
##### Result:
```css
body{
	margin: 0;
	padding: 0;
}
.main{
	margin: 5px auto;
	padding: 5px 0;
}
```

---
### Advanced usage
```javascript
var Style = require('nya-style'),
var str = Style({
	body:{
		"$pmd-ff/d-c": "0, 0",
	},
	header:{
		$wp: "100%, 5",
		opacity: [.5, .5],
		":hover":{
			opacity: 1
		},
		a:{
			$rpsg:"5, 5, 2, red"
		}
	}
}).addUnits({
	"font-size": "rem"
}).parse();
console.log(str)
```
##### Result
```css
body {
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
}

header {
	width: 100%;
	padding: 5px;
	opacity: 0.5;
	transition: opacity 0.5s;
}

header:hover {
	opacity: 1;
}

header a {
	border-radius: 5px;
	padding: 5px;
	font-size: 2rem;
	background: red;
}
```

So if you want to learn how to write this **fast CSS code**, go to the [docs](http://nya-style.euginelab.ru/docs/) and learn ALL features.


#### Official site
[http://nya-style.euginelab.ru/](http://nya-style.euginelab.ru/)
