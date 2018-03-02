
/**
		G L O B A L   V A R I A B L E S
**/
//let markerStorage = [];
let marker_arr = [];

let localToken = ''; //token
let local_username = '';

//let isLogged = false;

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

let base_url = 'http://100.33.50.170:8080/';
//let base_url = 'http://192.168.2.199:8080/';
//let base_url = 'http://localhost:8080/';
//let base_url = 'http://192.168.1.100:8080';
//let localhost_url = 'http://localhost:8080';


/**
	GOOGLE MAP
**/
let user_input = document.getElementById('autocomplete-input');
let autocomplete_form = document.getElementById('autoform');
let autocomplete;

$('.autocomplete-form').on('submit', event=>{
	event.preventDefault();
	
	let auto_string = autocomplete.getPlace();
	
	//keep getting undefined on first submit
	//ASK: async callback
	const place_lat = auto_string.geometry.location.lat();
	const place_lng = auto_string.geometry.location.lng();
	const targetLocation = new google.maps.LatLng(place_lat, place_lng);
	map.panTo(targetLocation);
});

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:40.74414900000001, lng: -73.91254900000001},
		zoom: 12, 	
		streetViewControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		}
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

$('#announcement-close').on('click', ()=>{
	$('#announcement').modal('hide');
});

function alertMessage(msg){
	$('#announcement').find('.modal-body').html(msg);
	$('#announcement').modal('show');
}

/*
function runPromises(results, arr){
	return Promise(function (resolve, reject){
		buildDB(results, arr);
		resolve(arr);
	});
}
*/
function callback(results, status) {
	
	if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
		alertMessage('no results');
		return;
	}
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		clearMarkers();	    
	    buildDB(results, resultDB);
	    renderPlaces(resultDB);	//<- this doesn't run...
	    //resultPromise.then(renderPlaces);
	    //runPromises(results, resultDB).then(renderPlaces);

	    /*
	    const bounds = new google.maps.LatLngBounds();
	    resultDB.forEach(item=>{
	    	bounds.extend(item.mapObj);
	    })
	    map.fitBounds(bounds);
	    */
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

//date-btn-save
//save the date
$('#save-form').on('submit', event=>{
	event.preventDefault();
	if(listDB.length<2){
		alert('Need at least 2 places!');
		return;
	}
	if(localToken==='') {	
		$('#login-page').modal('show');
		return;
	}
	
	let item_title = $('#date-title').val();
	let post_url = base_url+'api/destination/' + local_username;
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
	$.ajax({
		url: post_url,
		method:"POST",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item),		
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(saveSuccess)
	.fail(alertFail);
});

function saveSuccess(xhr_sent, status, resFromServer){
	const newEntry = renderSaved_card(xhr_sent);
	alertMessage('save success');
	$('#users_saved_list_modal').append(newEntry);
	//Save success!
	return;
}

function setBound(arr){
	const bounds = new google.maps.LatLngBounds();
    arr.forEach(item=>{
    	bounds.extend(item.mapObj);
    });    
}

function buildDB(data, arr){
	while(arr.length) arr.pop();
	for(let i=0;i<data.length;i++){
		getPlaceDetail(data[i], i, arr);
	}
	return arr;
}

function makeContent(element){
	let content = '';
	content += `<div class='info-div d-flex flex-column'>`;
	content += `<div class='div-info-title'>${element.name}</div>`;
	content += `<div class='div-info-vicinity'>${element.vicinity}</div>`;				
	content += `<img src='${element.photos_small}'/>`;
	content += element.hours;
	content += element.vicinity;
	content += element.website;
	content += '</div>';
	return content;
}


function makeMapInfo(element, map_arr){
	const mapinfo_item = {};
	let marker = new google.maps.Marker({
	    position: element.mapObj,
	    map: map
    });
	
    let content = makeContent(element);
    let infowindow = new google.maps.InfoWindow();
    infowindow.setContent(content);

    marker.addListener('click', function(){
    	clearAllInfoWindow();
    	infowindow.open(map, marker);
    });
    mapinfo_item.id = element.id;
    mapinfo_item.marker = marker;
    mapinfo_item.infowindow = infowindow;
    mapinfo_item.mapObj = element.mapObj;
    map_arr.push(mapinfo_item);	
}

const mapinfo_results = [];
const mapinfo_lists = [];

function getPlaceDetail(item, index, database){	
	let request = {
		"placeId": item.place_id
	};
	service.getDetails(request, function(place,status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			
			if(place.opening_hours && item.photos){
				
				//console.log(place);
				const place_lat = item.geometry.location.lat();
		    	const place_lng = item.geometry.location.lng();

				const element = {
					name: place.name,
					id: place.id,
					place_id: place.place_id,
					location: {
						lat: place_lat,
						lng: place_lng,
					},
					photos_large: '',
					photos_small: '',
					hours: renderHours(place.opening_hours.weekday_text),
					website: '',
					vicinity: '',
					mapObj: new google.maps.LatLng(
							place_lat, place_lng
						)
				};
				//console.log(element.mapObj);
				element.photos_large = item.photos[0].getUrl({
					'maxHeight':200, 
					'minWidth':350
				});
				element.photos_small = item.photos[0].getUrl({
					'maxHeight':100, 
					'minWidth':150
				});
				element.website = `<a href='${place.website}'>Website</a>`;
				element.vicinity = `<div>${place.vicinity}</div>`;

				makeMapInfo(element, mapinfo_results);
				
			    database[index] = element;
			}
		}
	});	
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
function renderPlaces(arr){
	//display array to places
	const myPlaces = arr.map((item,index)=>{
		return renderSinglePlace(item, index);
	});
	
	$('.results').html(myPlaces);
	return;	
}

function renderSinglePlace(item, index){	
	let result = `
		<div class='card res col-12 col-lg-4 justify-content-start no-paddings' item-ID='${item.id}'>`;
	if(item.photos_large) {
		result+= `
		<img class='card-img-top img-thumbnail img-responsive mh-25 d-flex align-self-center result-img' src='${item.photos_large}' alt='card img'>
		`;
	}		
	result += `	
		<div class='card-body'>
			<h5 class='card-title'>${item.name}</h5>
			${item.hours}
			${item.web}
			${item.vicinity}
		</div>
		<div class='card-footer'>
			<button class='col-12 btn btn-primary btn-add' targetID='${item.id}' result-index='${index}'><i class="fas fa-plus-square"></i> ADD</button>
		</div>
	</div>`;
	return result;
}
function renderHours(arr){
	let string = `<div class='div-info-hours'>`;
	arr.forEach(item=>{
		string += `<div class='div-info-hours-element'>${item}</div>`;
	});
	string += `</div>`;
	return string;
}
function clearAllInfoWindow(){
	clearInfoWindow(mapinfo_results);
	clearInfoWindow(mapinfo_lists);
}
function clearInfoWindow(arr){
	for(let i=0;i<arr.length;i++){
		arr[i].infowindow.close();
	}
}
$('.results').on('click', `.card > .card-body, .card > img`, event=>{
	let targetID = $(event.currentTarget).parents('.card').attr('item-ID');		
	for(let i=0;i<mapinfo_results.length;i++){		
		if(mapinfo_results[i].id == targetID){			
			let targetObj = mapinfo_results[i];
			clearAllInfoWindow();
			targetObj.infowindow.open(map, targetObj.marker);
			map.panTo(targetObj.mapObj);
			map.setZoom(15);
		}
	}
	
	/* this feature zooms in too much...
		Nearby button already bounds nearby area before anyway.

	const bounds = new google.maps.LatLngBounds();
	bounds.extend(target_map_obj);
	map.fitBounds(bounds);
	*/
	$('html, body').animate({ scrollTop: 0});
});

function makeMarkerAndSaveDB(element){	
    makeMapInfo(element, mapinfo_lists);
    listDB.push(element);
    renderItem(element);
    showList();    
}
function showList(){
	if($('#map-container').hasClass('col-lg-10')){
		$('#map-container').removeClass('col-lg-10');
		$('#map-container').addClass('col-lg-7');
		$('#list-container').removeClass('d-none');
		$('.save-btn-container').removeClass('d-none');
	}
}

$('.results').on('click', '.btn-add', event=>{	
	showList();
	/*
	const index = $(event.currentTarget).attr('result-index');
	const targetID = $(event.currentTarget).attr('targetID');
	const item = resultDB[index];
	*/
	const targetID = $(event.currentTarget).parents('card').attr('item-id');
	for(let i=0;i<resultDB.length;i++){
		if(resultDB[i].id === targetID){
			makeMarkerAndSaveDB(resultDB[i]);
		}
	}

	//makeMarkerAndSaveDB(item);
    
	//replace add button to check icon button
	const theButton = `<button class='col-12 btn btn-success btn-add' result-index='${index}' disabled>
	<i class="fas fa-check"></i> ADDED</button>`
	$(event.currentTarget).replaceWith(theButton);
	//renderItem(item);
});


$('#clear-search').on('click', function(){
	clearMarkers();
	clearResultDB();	
	$('.results').html('');
});
function clearArray(arr){
	while(arr.length) arr.pop();
	return;
}

function clearResultDB(){
	//while(resultDB.length) resultDB.pop();
	clearArray(resultDB);

	clearArray(mapinfo_results);
	//clearArray(info);
	//clearArray(markers);
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
			<div class='btn-group-vertical bg-light' id="updown">				
				<button type='button' class='btn btn-outline-primary align-self-center btn-up' id='up-${item.id}'>
					<i class="fas fa-angle-up"></i>
				</button>
				<button type='button' class='btn btn-outline-primary align-self-center btn-dn' id='dn-${item.id}'>
					<i class="fas fa-angle-down" id='up-${item.id}'></i>
				</button>
			</div>
			<div class='list-name col-8 text-truncate'>
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

function hideList(){
	$('#map-container').removeClass('col-lg-7');
	$('#map-container').addClass('col-lg-10');
	$('#list-container').addClass('d-none');
}
function clearDate(){
	clearListDB();	
	hideList();

}
function clearListDB(){	
	let pop;
	while(marker_arr.length){
		pop = marker_arr.pop();
		pop.marker.setMap(null);
		pop.marker = null;
	}
	while(listDB.length>0) listDB.pop();
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


function alertFail(xhr, textStatus, errThrown){
	console.log(xhr);
	alert(`${textStatus}: ${xhr.status} ${xhr.responseText}`);
}

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
		data: JSON.stringify(item)		
	})
	.done((data)=>{
		local_username = item.username;
		logmein(data);
	})
	.fail(alertFail);
}

function removeSavedList(res){
	//remove item from the savedList
	let targetID = res.id;
	$('#users_saved_list_modal')
		.find(`[savedlists-id='${targetID}']`).remove();
	alertMessage(`Successfully removed ${res.title}.`);
}

function deleteSavedListItem(loadID){
	
	$.ajax({
		url: base_url+'api/destination/'+loadID,
		method: 'DELETE',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(removeSavedList)
	.fail(alertFail);

	
}

$('#users_saved_list_modal').on('click', '.delete-load-btn', event=>{
	let loadID = $(event.currentTarget).parents('.card').attr('savedLists-id');
	deleteSavedListItem(loadID);
});

function loadDestination(data){
	clearDate();
	data[0].destinations.forEach((item)=>{
		makeMarkerAndSaveDB(item);
	});
	renderPlaces(listDB);
    clearResultDB();
    listDB.forEach((item,index)=>{
    	resultDB[index] = item;
    });
	$('#users_saved_list').modal('hide');
}

function getDetailedSavedList(loadID){
	$.ajax({
		url: base_url+'api/destination/'+loadID,
		method: 'GET',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(loadDestination)
	.fail(alertFail);
}

$('#users_saved_list_modal').on('click', '.save-load-btn', event=>{
	let loadID = $(event.currentTarget).parents('.card').attr('savedLists-id');
	getDetailedSavedList(loadID);
});



$('#users_saved_list_close').on('click', ()=>{
	$('#users_saved_list').modal('hide');
});

function renderSaved_card(item){
	
	let thething = `
	<div class='card col-12 col-lg-5 no-paddings' item-ID=${item.id}>
		<div class='card-body'>${item.title}</div>
		<div class='card-footer justify-content-around'>
			<button type='button' class='btn btn-primary save-load-btn'><i class="fas fa-folder-open"></i> LOAD</button>
			<button type='button' class='btn btn-danger delete-load-btn'><i class="fas fa-trash-alt"></i></button>
		</div>
	</div>`;
	
	return thething;
}

function loadSavedLists(data){	
	const completeCards = 
		data[0].savedLists.map(item=>{
			return renderSaved_card(item);			
		});	
	$('#users_saved_list_modal').html(completeCards);
}

function getSavedLists(){	
	$.ajax({
		url: base_url+'api/destination/user/'+local_username,
		method: 'GET',
		contentType: 'application/json',
		dataType: 'json',	
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(loadSavedLists)
	.fail(alertFail);		
}

function logmein(data){	
	localToken = data.authToken;	
	//local_username = $('#user_id').val();
	
	isLogged = true;
	
	$('#login-btn').hide();
	$('#savedlist-btn').show();
	$('#logout-btn').show();
	getSavedLists();
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
		url: base_url+'api/users',
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item)
	})
	.done((res_)=>{
		alertMessage(`A user ${item.username} is successfully created.`);
		ajaxlogin(loginItem);
	})
	.fail(alertFail);
});



$('#register-btn, #login-cancel').on('click', ()=>{
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

	$.ajaxSetup({cache:false});
}

$(window).on('resize', function(){
	resizeWindow();
});

function resizeWindow(){
	let window_height = $(window).height();
	let window_width = $(window).width();

	let resized_height = (window_height*.6);

	$('#map').height(resized_height);
	
	if(window_width>=991){		
		$('#place-list').css("maxHeight", resized_height+"px");
	}	
}

$(firstLoad);