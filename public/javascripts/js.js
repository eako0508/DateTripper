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
$('#custom_query_submit').on('click', function(event){
	event.preventDefault();
	service.nearbySearch({
		location: {lat:40.727141, lng: -73.907959},
		radius: 500,
		type: ['store']
	}, callback);
});

$('.results').on('click', '.btn-add', event=>{
	event.preventDefault();
	const index = $(event.currentTarget).attr('result-index');
	const item = resultDB[index];
	console.log(item);
});


function renderAddedList(data){
	//
}
/*
	<div class='list row align-items-center'>
		<div class='list-name col'>
			<div>Name</div>
			<div>Time</div>
		</div>
		<div class='list-btn col'>
			<input type='button' id='list-1-btn' class='btn' value='delete'>
		</div>
	</div>
*/



$('#show_user_list').on('click', event=>{
	event.preventDefault();
});
$(window).on('resize', function(){
	resizeWindow();
});
$('.login-submit').on('click', event=>{
	event.preventDefault();
	//authenticate
	//go to user.html
});

function firstLoad(){
	resizeWindow();
}

function resizeWindow(){
	let window_height = $(window).height();
	let window_width = $(window).width();
	$('#map').height(window_height*.6);
	$('.trip-list').height(window_height*.6);
}

function requestList(id){
	//
}










$(firstLoad);
