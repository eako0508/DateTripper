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
		//console.log(results);
		renderPlaces(results);
	}
}
let test1;
function renderPlaces(data){
	/*
	test1 = data[0].photos[0];
	console.log(test1);
	*/
	test1 = data[0].place_id;
	const myPlaces = data.map((item,index)=>{
		return renderSinglePlace(item, index);
	});
	//console.log(data[0].photos[0].getUrl({maxHeight:300}));
	$('.results').html(myPlaces);
	//getSingleDetail(test1, detailcallback);
}
//<div class='card-img-top' src='${item.photos[0].html_attributions[0]}'></div>
function getSingleDetail(input, callback){
	let request = {
		"placeId": input
	}
	service.getDetails(request, callback);
}

function detailcallback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //createMarker(place);
    console.log(place);
    console.log(place.photos[1].getUrl({maxHeight:300}));
  }
}





function renderSinglePlace(item, index){
	
	let result = `
		<div class='card border-primary res'>`;
	
	if(item.photos!=undefined) {
		result+= `
		<img class='card-img-top' src='${item.photos[0].getUrl({maxHeight:300})}' alt='card img'>
		`;
	}
	
	result += `	
		<div class='card-body'>

			<h5 class='card-title'>${item.name}</h5>
			<p class='card-text'>
				id: ${item.id},
				place_id: ${item.place_id},
				location: ${item.geometry.location}
			</p>
			<input type='button' class='btn btn-primary' value='ADD'>
		</div>
	</div>
	`;
	return result;
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
