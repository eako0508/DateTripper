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
	GOOGLE PLACE
**/

//let service = new google.maps.places.PlacesService(map);
//service.nearbySearch(request, callback);
function callback(results, status){
	if(status === google.maps.places.PlacesServiceStatus.OK){
		console.log(results);
	}
}

//event handler
$('#custom_query_submit').on('click', function(event){
	event.preventDefault();
	service.nearbySearch({
		location: {lat:40.727141, lng: -73.907959},
		radius: 500,
		type: ['store']
	}, callback);
});
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
