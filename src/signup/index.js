var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');

page('/signup', function(ctx, next){
	//main.innerHTML = 'Signup <a href="/">Home  rterte</a>'; //diga singup
	title('Platzigram - Signup');
	var main = document.getElementById('main-container');
	empty(main).appendChild(template);
})