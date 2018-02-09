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



function firstLoad(){
	resizeWindow();
	//$('#body')[0].style.paddingRight = $('#body')[0].offsetWidth - $('#body')[0].clientWidth + "px";
	
}

function resizeWindow(){
	let window_height = $(window).height();
	let window_width = $(window).width();
	$('#map').height(window_height*.6);
	$('.trip-list').height(window_height*.6);
}

function requestList(id){
	//send request to user endpoint '/get:id'
	//receive respond
	let res = userData;

}










$(firstLoad);

let userData = {
	"saved_list": [
		{
			"id": "1",
			"entries": [
				{
					"name": "ice cream",
					"img": "img url",
					"coord": {"alt": 1, "lnt":1}
				},
				{
					"name": "movie theater",
					"img": "img url",
					"coord": {"alt": 1, "lnt":2}
				},
				{
					"name": "restaurant",
					"img": "img url",
					"coord": {"alt": 1, "lnt":3}
				}
			]
		},
		{
			"id": "2",
			"entries": [
				{
					"name": "skate",
					"img": "img url",
					"coord": {"alt": 2, "lnt":1}
				},
				{
					"name": "fish and chips",
					"img": "img url",
					"coord": {"alt": 2, "lnt":2}
				},
				{
					"name": "helicopter ride",
					"img": "img url",
					"coord": {"alt": 2, "lnt":3}
				}
			]
		}
	]
};

