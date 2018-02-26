


	/**
							TODO 
			(important)


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
//let markerStorage = [];
let marker_arr = [];

let localToken; //token

let isLogged = false;
let username = '';
//maps, used for map and markers
var map;

//google places, used for nearby search(with or w/o text)
let service;			


let markers = [];		//array of markers objects(lat, lng)


//array of objects(name, imgUrl(small&large), id, place_id)
const resultDB = [];	//for search results
const listDB = [];		//for added destinations

let info = []; //array of infowindow

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

//let base_url = 'http://100.33.50.170:8080/';
let base_url = 'http://192.168.2.199:8080/';
//let base_url = 'http://localhost:8080/';
//let localhost_url = 'http://localhost:8080';

/**
	GOOGLE MAP
**/
let user_input = document.getElementById('autocomplete-input');
let autocomplete_form = document.getElementById('autoform');
let autocomplete;

$('.autocomplete-form').on('submit', event=>{
	event.preventDefault();
	console.log(event);
	let auto_string = autocomplete.getPlace();
	console.log(auto_string);
	//keep getting undefined on first submit
	//ASK: async callback
	const place_lat = auto_string.geometry.location.lat();
	const place_lng = auto_string.geometry.location.lng();
	const targetLocation = new google.maps.LatLng(place_lat, place_lng);
	map.panTo(targetLocation);
});

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.727141, lng: -73.907959},
		zoom: 12
	});

	map.set('styles', mapStyles.blue_essense);

	service = new google.maps.places.PlacesService(map);

	
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(autocomplete_form);

	autocomplete = new google.maps.places.Autocomplete(user_input);

}
function clearMarkers(){
	let pop;
	while(markers.length){
		pop = markers.pop();
		pop.setMap(null);
		pop = null;
	}
	return;
}

function callback(results, status) {
	//let marker;
	clearMarkers();
	if (status == google.maps.places.PlacesServiceStatus.OK) {
	    saveToResultDB(results);
	    renderPlaces();

	    const bounds = new google.maps.LatLngBounds();
	    resultDB.forEach(item=>{
	    	bounds.extend(item.mapObj);
	    })
	    map.fitBounds(bounds);
	}
}



		//SEARCH NEARBY

$('#search-nearby').on('click', function(event){
	const query = {
		location: map.getCenter(),
		radius: 500,
		type: checked_options
	}
	service.nearbySearch(query, callback);
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
});
$('.submit-go').on('submit', event=>{
	event.preventDefault();

});


/**
let localToken; //token
let isLogged = false;
let username = '';
**/

$('#save-form').on('submit', event=>{

	event.preventDefault();
	
	if(!localStorage.token) {	
		$('#login-page').modal('show')
		return;
	}
	if(listDB.length<2){
		alert('Need at least 2 places!');
		return;
	}
	
	let item_title = $('#date-title').val();

	
	let post_url = base_url+'api/destination/' + localStorage.username;


	listDB.forEach((item,index)=>{
		if(item.marker!=null){
			item.marker.setMap(null);
			item.marker = null;
			item = null;	
		}		
	});

	const item = {
		"title": item_title,
		"destinations": listDB
	}

	console.log(item);
	$.ajax({
		url: post_url,
		method:"POST",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item),
		success: saveSuccess,
		failure: function(errMsg){
			console.log(errMsg.message);
		},
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	});
});

function saveSuccess(data){
	console.log('success!');
	console.log(data);
	return;
}
/**
let hours_arr = [];
	hours_arr = [
		{
			id: 12323,
			hours: [
					string,
					string,
					string
				]
		},
		{
			id: 12323,
			hours: [
					string,
					string,
					string
				]
		}
	];

function generateHours(arr_){
	hours_arr.forEach((item,index)=>{

	});
}
**/
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
		const place_lat = item.geometry.location.lat();
	    const place_lng = item.geometry.location.lng();

	    let marker = new google.maps.Marker({
		    position: new google.maps.LatLng(place_lat, place_lng),
		    map: map
	    });
	    
	    let request = {
			"placeId": item.place_id
		};

		const element = {
			name: item.name,
			id: item.id,
			place_id: item.place_id,
			location: {
				lat: item.geometry.location.lat(),
				lng: item.geometry.location.lng(),
			},
			hours: []
		}
		//put name, pic, and hours
		let content = '<div>';
		if(item.photos!=undefined) {
			element.photos_large = item.photos[0].getUrl({
				'maxHeight':200, 
				'minWidth':300
			});
			element.photos_small = item.photos[0].getUrl({
				'maxHeight':100, 
				'minWidth':150
			});
			content += `
				<img src='${element.photos_small}'/>
				`;
		}
		service.getDetails(request, function(place,status){
			
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				if(place.opening_hours!=null){
					let arr_hours = place.opening_hours.weekday_text;
					element.hours = arr_hours;
					//let append_hours = renderHours(arr_hours);
					//let append_hours='';
					for(let j=0;j<arr_hours;j++){
						content += arr_hours[j];
					}
				}
			}
		});
		element.mapObj = new google.maps.LatLng(element.location.lat, element.location.lng);

		content += '</div>';
		resultDB[index] = element;

	    let infowindow = new google.maps.InfoWindow();
	    //console.log(content);
	    infowindow.setContent(content);
	    marker.addListener('click', function(){
	    	infowindow.open(map, marker);
	    });
	    info.push(infowindow);
	    markers.push(marker);
	});
	return;
}

function renderHours(arr){
	//let temp = '<div>'
	let temp = ''
	for(let i=0;i<arr.length;i++){
		//temp += `<div>${arr[i]}</div>`;
		temp += arr[i];
	}
	temp += '';
	//temp += '</div>';
	return temp;
}

/**
	RENDERING
**/



/**
	FILTER OPTIONS
**/
$('.dropdown-menu').on('click', '.options-item, li', event=>{
   	let target = $(event.currentTarget);
   	let val = target.attr('option-num');
    
    let idx;

    target.toggleClass('bg-success');
    target.children('i').toggleClass('invisible');
    target.children('a').toggleClass('text-light');
    
   	if((idx = checked_options.indexOf(val))> -1){
		checked_options.splice(idx, 1);
   	}else {
		checked_options.push(val);
   	}
   	$(event.target).blur();     
   	return false;
});

function renderOptions(arr){
	const items = arr.map((item, index)=>{
		return `
		<li class='dropdown-item' option-num=${item.id}>
			<i class="fas fa-check invisible text-light"></i>
			<a href="#" option-num=${item.id} tabIndex="-1" class='options-item btn'>
				${item.name}
			</a>
		</li>`;
	});
	$('#display-options').html(items);
}






/**
	RESULTS
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

function renderHours(arr){
	let string = '';
	arr.forEach(item=>{
		string += `<span>${item}</span>`;
	});
	return string;
}


function renderSinglePlace(item, index){	
	let result = `
		<div class='card res col-12 col-lg-4 d-flex justify-content-start' db-index='${index}'>`;
	if(item.photos_large!=undefined) {
		result+= `
		<img class='card-img-top img-thumbnail img-responsive mh-25 d-flex align-self-center' src='${item.photos_large}' alt='card img'>
		`;
	}	
	/*
	id: ${item.id},
	place_id: ${item.place_id},
	location: ${item.location}
	*/

	//question: unable to access object array
	console.log(item);	//object
	let place_hours = '';
	let arr_hour = item.hours;	//object.hours array
	console.log('arr_hour:');
	console.log(arr_hour);
	
	//hhhhhhhhhhhhhhhh
	if(arr_hour.length>0){
		place_hours = renderHours(item.hours);
		console.log(place_hours);
	}
	
	result += `	
		<div class='card-body'>
			<h5 class='card-title'>${item.name}</h5>
			${place_hours}
		</div>
		<div class='card-footer'>
			<button class='col-12 btn btn-primary btn-add' targetID='${item.id}' result-index='${index}'>ADD</button>
		</div>
	</div>`;
	return result;
}
$('.results').on('click', `.card > .card-body, .card > img`, event=>{
	let idx = $(event.currentTarget).parents('.card').attr('db-index');
	let target_map_obj = resultDB[idx].mapObj;
	map.panTo(target_map_obj);
	const bounds = new google.maps.LatLngBounds();
	bounds.extend(target_map_obj);
	map.fitBounds(bounds);
});
$('.results').on('click', '.btn-add', event=>{
	if($('#map-container').hasClass('col-lg-10')){
		$('#map-container').removeClass('col-lg-10');
		$('#map-container').addClass('col-lg-7');
		$('#list-container').removeClass('d-none');
		$('.save-btn-container').removeClass('d-none');
	}
		
	const index = $(event.currentTarget).attr('result-index');
	const targetID = $(event.currentTarget).attr('targetID');
	const item = resultDB[index];
	
	let marker = new google.maps.Marker({
	    position: item.mapObj,
	    map: map
    });
    //get targetID!!
	let item_marker = {
		marker: marker,
		id: targetID
	}

	marker_arr.push(item_marker);
	//markerStorage.push(marker);
    //item.marker = marker;


    listDB.push(item);
    
	//replace add button to check icon button
	const theButton = `<button class='col-12 btn btn-success btn-add' result-index='${index}'>
	<i class="fas fa-check"></i> ADDED
	</button>`
	$(event.currentTarget).replaceWith(theButton);
	renderItem(item);
});
$('#clear-search').on('click', function(){
	clearMarkers();
	clearResultDB();
	$('.results').html('');
});
function clearResultDB(){
	while(resultDB.length) resultDB.pop();
	return;
}















/**
	PLACE LIST
**/
$('#place-list').on('click', '.list-name', event=>{
	let idx = $(event.currentTarget).parent('div').children('button').attr('place-list-id');
	const aPlace = listDB.find(item=>{
		return item.id === idx;
	});
	

	map.panTo(aPlace.mapObj);
});
function renderItem(item){	
	let place = `
	<div class='list' id='rank-${rank}'>
		<div class='row no-gutters align-items-center justify-content-between bg-light'>
			<div class='btn-group-vertical' id="updown">				
				<button type='button' class='btn btn-outline-primary align-self-center btn-up' id='up-${item.id}'>
					<i class="fas fa-angle-up"></i>
				</button>
				<button type='button' class='btn btn-outline-primary align-self-center btn-dn' id='dn-${item.id}'>
					<i class="fas fa-angle-down" id='up-${item.id}'></i>
				</button>
			</div>
			<div class='list-name col-8 tex-truncate'>
				${item.name}
					
				
			</div>
			<button type='button' class='btn btn-danger btn-delete' place-list-id='${item.id}'>
				<i class="fas fa-times"></i>
			</button>
		</div>
	</div>`;
	$('#place-list').append(place);
}

$('#place-list').on('click', '.btn-up', event=>{
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

$('#place-list').on('click', '.btn-dn', event=>{
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

$('#date-btn-clear').on('click', event=>{
	clearDate();
});
function clearDate(){
	clearListDB();
	$('#map-container').removeClass('col-lg-7');
	$('#map-container').addClass('col-lg-10');
	$('#list-container').addClass('d-none');
}
function clearListDB(){	
	let pop;
	while(marker_arr.length){
		pop = marker_arr.pop();
		pop.marker.setMap(null);
		pop.marker = null;
	}
	$('#place-list').html('');
}
function renderDestination(){
	$('#place-list').html('');	
	for(let i=0;i<listDB.length;i++){
		renderItem(listDB[i]);
	}
}
$('#place-list').on('click', '.btn-delete', event=>{
	let targetID = $(event.currentTarget).attr('place-list-id');	
	listDB.forEach((item,index)=>{
		if(targetID === item.id){
			listDB.splice(index, 1);
		}
	});	
	marker_arr.forEach((item,index)=>{
		if(targetID === item.id){
			item.marker.setMap(null);
			item.marker = null;
			marker_arr.splice(index, 1);
		}
	})
	$(event.currentTarget).closest('.list').remove();
	if(listDB.length<1) clearDate();		
});






$(window).on('resize', function(){
	resizeWindow();
});






//login


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
		url: base_url+'api/auth/login',
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
	localStorage.setItem('token', data.authToken);
	username = $('#user_id').val();
	localStorage.setItem('username', username);
	isLogged = true;
	//console.log(localToken);
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
	console.log(JSON.stringify(item));
	const loginItem = {
		username: item.username,
		password: item.password
	}
	$.ajax({
		url: base_url+'api/users',
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
	localStorage.clear();
});
/*
$('#savedlist-btn').on('click', function(){
	window.location.href = 
		base_url+'api/users/saved_list/'+localStorage.username;
});
*/
/*	redirect to user's saved dates
$('#savedlist-btn').on('click', function(){
	let saved_url = 'http://localhost:8080/users/saved_list/' + localStorage.username;
	$.ajax({
		url: saved_url,
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item),
		success: function(data){
			console.log(data);
			//work on redirecting
		},
		failure: function(errMsg){
			console.error(errMsg);
		}
	});
});
*/
let init_height;
let init_width;

//INITIALIZATION
function firstLoad(){
	localStorage.clear();
	resizeWindow();

	//$('body:before').css({width: `${init_width}px `});
	//console.log($('body').css("background-size"));
	renderOptions(arr_options);
	$('#logout-btn').hide();
	$('#savedlist-btn').hide();

	if(localStorage.token){
		$('#login-btn').hide();
		$('#savedlist-btn').show();
		$('#logout-btn').show();
	}
}

function resizeWindow(){
	let window_height = $(window).height();
	let window_width = $(window).width();
	init_width = window_width;
	init_height = window_height;

	$('#map').height(window_height*.6);
	if(window_width>=991){
		$('#place-list').height(window_height*.6);
	}

}

$(firstLoad);