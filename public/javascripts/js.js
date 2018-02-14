/**
	GOOGLE MAP
**/
var map;
let service;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.727141, lng: -73.907959},
		zoom: 12
	});
	service = new google.maps.places.PlacesService(map);

}
$('#search-nearby').on('click', function(event){
	event.preventDefault();
	service.nearbySearch({
		location: map.getCenter(),
		radius: 500,
		type: ['store']
	}, callback);
});
$('#custom_query_submit').on('click', event=>{
	event.preventDefault();
	const query = $('#custom_query').val();
	$('#custom_query').val('');
	//hhhhhhhhhh
});
/**
	GOOGLE PLACE - START
**/

//let service = new google.maps.places.PlacesService(map);
//service.nearbySearch(request, callback);
function callback(results, status){
	if(status === google.maps.places.PlacesServiceStatus.OK){
		renderPlaces(results);
	}
}
const resultDB = [];
const listDB = [];
function renderPlaces(data){
	while(resultDB.length) resultDB.pop();
	const myPlaces = data.map((item,index)=>{
		return renderSinglePlace(item, index);
	});
	$('.results').html(myPlaces);
}
function renderSinglePlace(item, index){	
	const element = {
		name: item.name,
		id: item.id,
		place_id: item.place_id,
		location: item.geometry.location
	}
	let result = `
		<div class='card border-primary res'>`;
	if(item.photos!=undefined) {
		const imgUrl = item.photos[0].getUrl({maxHeight:300});
		result+= `
		<img class='card-img-top' src='${imgUrl}' alt='card img'>
		`;
		element.photos = imgUrl;
	}
	result += `	
		<div class='card-body'>
			<h5 class='card-title'>${item.name}</h5>
			<p class='card-text'>
				id: ${item.id},
				place_id: ${item.place_id},
				location: ${item.geometry.location}
			</p>
			<input type='button' class='btn btn-primary btn-add' result-index='${index}' value='ADD'>
		</div>
	</div>
	`;
	//console.log(element);
	resultDB[index] = element;
	return result;
}
/**
	GOOGLE PLACE - END
**/



/**
	Single place Detail - START
**/
function getSingleDetail(input, callback){
	let request = {
		"placeId": input
	}
	service.getDetails(request, callback);
}
function detailcallback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    /*
    console.log(place);
    console.log(place.photos[1].getUrl({maxHeight:300}));
	*/
  }
}
/**
	Single place Detail - END
**/





//event handler

//add result item to place list
$('.results').on('click', '.btn-add', event=>{
	event.preventDefault();
	const index = $(event.currentTarget).attr('result-index');
	const item = resultDB[index];
	//console.log(item);
	addItem(item);
});
function addItem(item){
	const place = `
	<div class='list row align-items-center'>
		<div class='list-name col'>
			<div>${item.name}</div>
			<div>Time</div>
		</div>
		<div class='list-btn col'>
			<input type='button' class='btn btn-delete' 
			place-list-id='${item.id}' value='delete'>
		</div>
	</div>
	`;
	$('#place-list-list').append(place);

}
$('#place-list-list').on('click', '.btn-delete', event=>{
	$(event.currentTarget).closest('.list').remove();
});


//add result item to place list
$('#show_user_list').on('click', event=>{
	event.preventDefault();

});
$(window).on('resize', function(){
	resizeWindow();
});



//login
let localToken;
//$('js-form-login').on('submit', event=>{
$('.login-submit').on('click', event=>{
	event.preventDefault();
	const item = {
		username: $('#user_id').val(),
		password: $('#user_pw').val()
	}
	ajaxlogin(item);
});

function ajaxlogin(item){
	$.ajax({
		url: 'http://192.168.2.199:8080/api/auth/login',
		method: "POST",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item),
		success: logmein,
		failure: function(errMsg){
			console.log(errMsg);
		}
	});
}

function logmein(data){
	localToken = data.authToken;
	console.log(localToken);
	$('#login-btn').hide();
	$('#savedlist-btn').show();
	$('#logout-btn').show();
	//display 'saved places' btn for user page
}
//register
//$('.js-register-form').on('submit', event=>{
$('#register-submit').on('click', event=>{
	event.preventDefault();
	const item = {
		username: $('#reg-userid').val(),
		password: $('#reg-userpw').val(),
		firstName: $('#reg-userFirstname').val(),
		lastName: $('#reg-userLastname').val()
	}
	const loginItem = {
		username: item.username,
		password: item.password
	}
	$.ajax({
		url: 'http://localhost:8080/api/users',
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item),
		success: function(data){
			ajaxlogin(loginItem);
		},
		failure: function(errMsg){
			console.log(errMsg);
		}
	});
});



$('#register-btn').on('click', ()=>{
	$('#login-page').modal('hide');
});
$('#logout-btn').on('click', ()=>{
	localToken = '';
	$('#logout-btn').hide();
	$('#savedlist-btn').hide();
	$('#login-btn').show();
});

$('.js-form-go').on('submit', event=>{
	event.preventDefault();
});




function firstLoad(){
	resizeWindow();
	$('#logout-btn').hide();
	$('#savedlist-btn').hide();
}

function resizeWindow(){
	let window_height = $(window).height();
	let window_width = $(window).width();
	$('#map').height(window_height*.6);
	$('.place-list').height(window_height*.6);
}

function requestList(id){
	//
}

$('#place-list-list').on('sortable', '')

$(firstLoad);
