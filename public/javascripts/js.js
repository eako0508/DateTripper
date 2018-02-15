




/**
		G L O B A L   V A R I A B L E S
**/

var map;				//maps
let service;			//google places
let markers = [];		//array of markers
const resultDB = [];	//list of search results below
const listDB = [];		//list of added items to the right

//array of options for search nearby
const arr_options = [
	{ id: "amusement_park", name: "Amusement Park" },
	{ id: "aquarium", name: "Aquarium" },
	{ id: "cafe", name: "Cafe" },
	{ id: "department_store", name: "Department Store" },
	{ id: "lodging", name: "Lodging" },
	{ id: "movie_theater", name: "Movie Theater" },
	{ id: "museum", name: "Museum" },
	{ id: "night_club", name: "Night Club" },
	{ id: "restaurant", name: "Restaurant" },
	{ id: "shopping_mall", name: "Shopping Mall" },
	{ id: "zoo", name: "Zoo" }
];
/**
	GOOGLE MAP
**/





function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.727141, lng: -73.907959},
		zoom: 12
	});

	const myStyle = [
		{
			"featureType": "administrative",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "landscape",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi.government",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi.place_of_worship",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi.school",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "poi.medical",
			"elementType": "all",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		}
	];
	map.set('styles', myStyle);

	service = new google.maps.places.PlacesService(map);
}
function clearMarkers(){
	let pop;
	while(markers.length){
		pop = markers.pop();
		pop.setMap(null);
	}
	return;
}
function callback(results, status) {
	//console.log(status);
	let marker;
	clearMarkers();
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //save entries with attributes and add to 
    //renderPlaces(results);
    saveToResultDB(results);
    renderPlaces();
    for (var i = 0; i < results.length; i++) {
      const place = results[i];
      
      const place_lat = place.geometry.location.lat();
      const place_lng = place.geometry.location.lng();
      
      marker = new google.maps.Marker({
      	position: new google.maps.LatLng(place_lat, place_lng),
      	map: map
      });
      markers.push(marker);
    }
  }
}


		//SEARCH NEARBY
const checked_options = [];
$('#search-nearby').on('click', function(event){
	event.preventDefault();
	
	const query = {
		location: map.getCenter(),
		radius: 500,
		type: checked_options
	}
	//console.log(query);
	service.nearbySearch(query, callback);
});

$('#search-options').on('click', 'input', event=>{
	const checked_id = $(event.currentTarget).attr('id');
	const temp = checked_options.find(item=>{
		return item===checked_id;
	});
	if($(event.currentTarget).is(':checked')){
		if(!temp) checked_options.push(checked_id);
	} else{
		if(temp) checked_options.pop(checked_id);
	}
});

		//SEARCH KEYWORD
$('#custom_query_submit').on('click', event=>{	
	event.preventDefault();
	const keyword = $('#custom_query').val();
	$('#custom_query').val('');

	const search_query = {
		location: map.getCenter(),
		radius: 500,
		query: keyword
	}
	service.textSearch(search_query, callback);

	//let example = new google.maps.LatLng(40.727141, -73.907959);
	//map.panTo(example);
});
$('.submit-go').on('submit', event=>{
	event.preventDefault();

});





/**
	GOOGLE PLACE - START
**/

//let service = new google.maps.places.PlacesService(map);
//service.nearbySearch(request, callback);

function saveToResultDB(data){
	//clear DB
	while(resultDB.length) resultDB.pop();

	data.forEach((item,index)=>{
		const element = {
			name: item.name,
			id: item.id,
			place_id: item.place_id,
			location: item.geometry.location
		}
		if(item.photos!=undefined) {
			element.photos = item.photos[0].getUrl({
				'maxHeight':200, 
				'minWidth':300
			});
		}
		resultDB[index] = element;
	});
	return;
}


/**
	RENDERING
**/


function renderPlaces(){
	//display array to places
	const myPlaces = resultDB.map((item,index)=>{
		return renderSinglePlace(item, index);
	});
	
	$('.results').html(myPlaces);
	return;	
}

function renderSinglePlace(item, index){	
	
	let result = `
		<div class='card border-primary res'>`;
	if(item.photos!=undefined) {
		result+= `
		<img class='card-img-top' src='${item.photos}' alt='card img'>
		`;
	}	
	result += `	
		<div class='card-body'>
			<h5 class='card-title'>${item.name}</h5>
			<p class='card-text'>
				id: ${item.id},
				place_id: ${item.place_id},
				location: ${item.location}
			</p>
			<input type='button' class='btn btn-primary btn-add' result-index='${index}' value='ADD'>
		</div>
	</div>`;
	return result;
}

function renderOptions(arr){

	const items = arr.map((item, index)=>{
		return `
			<div class='form-check-inline'>
				<input class='form-check-input' type='checkbox' value='' id=${item.id}>
				<label class='form-check-label' for='${item.id}'>
					${item.name}
				</label>
			</div>
		`;
	});
	$('#search-options').html(items);
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
	addItem(item);
});
function addItem(item){
	listDB.push(item);
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

$(window).on('resize', function(){
	resizeWindow();
});



//login
let localToken; //token



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
		url: 'http://localhost:8080/api/auth/login',
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
}

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


function firstLoad(){
	resizeWindow();
	renderOptions(arr_options);
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
