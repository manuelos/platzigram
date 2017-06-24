var page = require('page');
var empty = require('empty-element');
var template = require('./template');
var title = require('title');
var request = require('superagent');
var header = require('../header');
var axios = require('axios');
var loader = require('./loader');
var Webcam = require('webcamjs');
var picture = require('../picture-card');

page('/', header, asyncLoad, function(ctx, next){
	//main.innerHTML = 'Signup <a href="/">Home  rterte</a>'; //diga singup
	title('Platzigram');
	var main = document.getElementById('main-container');

	empty(main).appendChild(template(ctx.pictures));

	const picturePreview = $('#picture-preview');
	const camaraInput = $('#camara-input');
	const cancelPicture = $('#cancelPicture');
	const shootButton = $('#shoot');
	const uploadButton = $('#uploadButton');

	function reset(){
		picturePreview.addClass('hide');
		cancelPicture.addClass('hide');
		uploadButton.addClass('hide');
		shootButton.removeClass('hide');
		camaraInput.removeClass('hide');
	}

	cancelPicture.click(reset);

	$('.modal-trigger').leanModal({
		ready: function(){
			Webcam.attach('#camara-input');
			shootButton.click((ev)=>{
				Webcam.snap((data_uri) => {
					picturePreview.html(`<img src="${data_uri}"/>`);
					picturePreview.removeClass('hide');
					cancelPicture.removeClass('hide');
					uploadButton.removeClass('hide');
					shootButton.addClass('hide');
					camaraInput.addClass('hide');
					uploadButton.off('click').click(()=>{
						const pic = {
							url: data_uri,
							likes: 0,
							liked: false,
							createdAt: +new Date(),
							user:{
								username: 'slifszyc',
								avatar:'https://pbs.twimg.com/profile_images/744781470946852864/nz8sp439.jpg'
							}
						}

						$('#picture-cards').prepend(picture(pic));
						reset();
						$('#modalCamara').closeModal();
					})
				});
			});
		},
		complete: function(){
			Webcam.reset();
			reset();
		}
	})
})

function loadPictures(ctx, next){
	request
		.get('/api/pictures')
		.end(function(err, res){
			if(err) return console.log(err);

			ctx.pictures = res.body;
			next();
		})
}

function loadPicturesAxios(ctx, next){
	axios
		.get('/api/pictures')
		.then(function(res){
			ctx.pictures = res.data;
			next();
		})
		.catch(function(err){
			console.log(err);
		})
}

function loadPicturesFetch(ctx, next){
	fetch('/api/pictures')
		.then(function(res){
			return res.json();
			next();
		})
		.then(function(pictures){
			ctx.pictures = pictures;
			next();
		})
		.catch(function(err){
			console.log(err);
		})
}

async function asyncLoad(ctx, next){
	try{
		console.log("asyncLoad");
		var main = document.getElementById('main-container');

		empty(main).appendChild(loader());
		ctx.pictures = await fetch('/api/pictures').then(res => res.json())
		next();
	}catch (err){
		return console.log(err);
	}
}