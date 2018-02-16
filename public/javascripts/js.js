
	/**
							TODO 
			(important)
		- Find out the way to re-order the destinations from the list.
			= every items are displayed in the order the items are added
			= make up and down arrow for each items
			= swap items from the array (let temp = a , a = b, b = temp)
			= swap from the list without loading the whole list(just like above with the content)
			= ...or re-render the whole array to destinations...


			(misc.)
		- add location's website & phone number
		- display opening hours.
		- click item from results and display detailed info in lightbox.
		- click item from results to show place on the map.
		- From cards, move card-contents to the bottom.
		
	**/


		/** 
			PROCESS: RENDERING SEARCH RESULTS
			global: 
				resultDB[]
				listDB[]
				markers[]

		$('search-nearby').click->callback
		$('custom_query_submit').click->callback

		callback(saveToResults)
		-> renderPlaces
		-> renderSinglePlace
		-> $('.results').html

		**/


		/**
			PROCESS: RENDERING ADDED LIST ON DESTINATIONS
			global: listDB[]
		

		$('.results').click 
		-> renderItem(render)

		**/

/**
		G L O B A L   V A R I A B L E S
**/

//maps, used for map and markers
var map;

//google places, used for nearby search(with or w/o text)
let service;			


let markers = [];		//array of markers objects(lat, lng)

//array of objects(name, imgUrl(small&large), id, place_id)
const resultDB = [];	//for search results
const listDB = [];		//for added destinations


let rank = 0;
//remove rank

//list of options to append for 'search nearby query'
const checked_options = [];

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
let info = [];
function callback(results, status) {
	//let marker;
	clearMarkers();
	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    saveToResultDB(results);
	    renderPlaces();
	}
}

/*
		    marker.addListener('click', function(){
		    	infowindow.open(map, marker);
		    });
		    
		    let content = 'hi';
		    google.maps.event.addListener(marker, 'click', function(content){
		      return function(){
		        infowindow.setContent(content);
		      }
		    }(content));
		    
		    google.maps.event.addListener(marker, 'click', function(content){
		    	return function(){
		    		infowindow.setContent(content);
		    	}
		    }(content));
		    */



		//SEARCH NEARBY

$('#search-nearby').on('click', function(event){
	const query = {
		location: map.getCenter(),
		radius: 500,
		type: checked_options
	}
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

$('#date-btn-save').on('click', event=>{
	let temp = JSON.stringify(listDB);
	console.log(temp);
	//send it to logged-in user's database
});



/**
	GOOGLE PLACE - START
**/

//let service = new google.maps.places.PlacesService(map);
//service.nearbySearch(request, callback);

function saveToResultDB(data){
	//clear DB
	while(resultDB.length) resultDB.pop();
	//console.log(data[0]);
	data.forEach((item,index)=>{
		//console.log(item);
		const element = {
			name: item.name,
			id: item.id,
			place_id: item.place_id,
			location: item.geometry.location
		}
		if(item.photos!=undefined) {
			element.photos_large = item.photos[0].getUrl({
				'maxHeight':200, 
				'minWidth':300
			});
			element.photos_small = item.photos[0].getUrl({
				'maxHeight':100, 
				'minWidth':150
			});
		}
		resultDB[index] = element;
		

		const place_lat = item.geometry.location.lat();
	    const place_lng = item.geometry.location.lng();

	    let marker = new google.maps.Marker({
		    position: new google.maps.LatLng(place_lat, place_lng),
		    map: map
	    });
	    
	    let request = {
			"placeId": item.place_id
		};
		
		service.getDetails(request, function(place,status){
			//if (status == google.maps.places.PlacesServiceStatus.OK) {
				//console.log(place);
				//console.log(place.opening_hours==null);
				if(place=!null) {
					if(place.opening_hours!=null){
						let arr_hours = place.opening_hours.weekday_text;
						element.hours = arr_hours;
						console.log(arr_hours);
						console.log(element.hours);
					}
				
				//console.log(place);
				}
				
			//}
		});
		

	    let infowindow = new google.maps.InfoWindow();
	    infowindow.setContent('hi');
	    marker.addListener('click', function(){
	    	infowindow.open(map, marker);
	    });
	    info.push(infowindow);
	    markers.push(marker);
	});
	return;
}


/**
	RENDERING
**/

//renderPlaces->renderSinglePlace->$('.results').html
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
	if(item.photos_large!=undefined) {
		result+= `
		<img class='card-img-top' src='${item.photos_large}' alt='card img'>
		`;
	}	
	/*
	id: ${item.id},
	place_id: ${item.place_id},
	location: ${item.location}
	*/
	result += `	
		<div class='card-body'>
			<h5 class='card-title'>${item.name}</h5>
			<p class='card-text'>
				
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
    
    console.log(place);
    /*
    console.log(place.photos[1].getUrl({maxHeight:300}));
	*/
  }
}
/**
	Single place Detail - END
**/

//event handler
/*backup
function renderItem(item){
	listDB.push(item);
	
	let place = `
	<div class='list row align-items-center'>`;

	if(item.photos_small) {
		place += `
		<img class='list-img' src='${item.photos_small}'/>`;
	}
	place +=`
		<div class='list-name col'>
			<div>${item.name}</div>
			<div>Time</div>
		</div>
		<div class='col list-btn'>
			<div class='row justify-content-end' id='updown'>
				<button id='up-${item.id}' class='btn btn-primary'>up</button>
				<button id='down-${item.id}' class='btn btn-secondary'>dn</button>	
			</div>
		
			<input type="button" class="btn btn-delete btn-danger" place-list-id='${item.id}' value="delete">
		</div>
	</div>`;
	//change id for every items?? what happens when the order changes?
	//
	$('#place-list-list').append(place);
}
*/
//add result item to place list
$('.results').on('click', '.btn-add', event=>{
	event.preventDefault();
	const index = $(event.currentTarget).attr('result-index');
	const item = resultDB[index];
	listDB.push(item);
	renderItem(item);
});


function renderItem(item){
	
	let place = `
	<div class='list' id='rank-${rank}'>
		<div class='rank-container row align-items-center'>`;
	rank++;
	if(item.photos_small) {
		place += `
			<img class='list-img' src='${item.photos_small}'/>`;
	}
	place +=`
			<div class='list-name col'>
				<div>${item.name}</div>
				<div>Time</div>
			</div>
			<div class='col list-btn'>
				<div class='row justify-content-end' id='updown'>
					<button id='up-${item.id}' class='btn-up btn btn-primary'>up</button>
					<button id='dn-${item.id}' class='btn-dn btn btn-secondary'>dn</button>	
				</div>
			
				<input type="button" class="btn btn-delete btn-danger" place-list-id='${item.id}' value="delete">
			</div>
		</div>
	</div>`;
	//change id for every items?? what happens when the order changes?
	//
	$('#place-list-list').append(place);
}
let tests = '123456';
$('#place-list-list').on('click', '.btn-up', event=>{
	let targetID = $(event.currentTarget).attr('id');
	targetID = targetID.substring(3,targetID.length);
	let temp;
	if(listDB.length<2){
		return;
	}
	for(let i=1;i<listDB.length;i++){
		if(targetID === listDB[i].id){
			temp = listDB.splice(i,1);
			listDB.splice(i-1,0,temp[0]);
			break;
		}
	}
	renderDestination();
});

$('#place-list-list').on('click', '.btn-dn', event=>{
	let targetID = $(event.currentTarget).attr('id');
	targetID = targetID.substring(3,targetID.length);
	let temp;
	if(listDB.length<2){
		return;
	}
	for(let i=0;i<listDB.length-1;i++){
		if(targetID === listDB[i].id){
			temp = listDB.splice(i,1);
			listDB.splice(i+1,0,temp[0]);
			break;
		}
	}
	renderDestination();
});

function clearListDB(){
	while(listDB.length) listDB.pop();
	$('#place-list-list').html('');
}

$('#date-btn-clear').on('click', event=>{
	clearListDB();
});

function renderDestination(){
	$('#place-list-list').html('');	
	for(let i=0;i<listDB.length;i++){
		renderItem(listDB[i]);
	}
}


$('#place-list-list').on('click', '.btn-delete', event=>{
	let targetID = $(event.currentTarget).attr('place-list-id');
	for(let i=0;i<listDB.length;i++){
		if(targetID === listDB[i].id){
			listDB.splice(i, 1);
		}
	}
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


//INITIALIZATION
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

/*	experiments
function requestList(id){
	//
}
$('#place-list-list').on('sortable', '')
*/
$(firstLoad);
