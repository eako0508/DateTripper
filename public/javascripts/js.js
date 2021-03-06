/**
		G L O B A L   V A R I A B L E S
**/

	//Authentication variables
let localToken = '';
let local_username = '';


	//Google Services
var map;
let service;
//auto-complete feature
let user_input = document.getElementById('autocomplete-input');
let autocomplete_form = document.getElementById('autoform');
let autocomplete;


	//Databases
//markers and infowindow
const mapinfo_results = [];
const mapinfo_lists = [];

//detailed place informations
const resultDB = [];
const listDB = [];

//currently loaded user's saved date lists.
let loaded_saved_list;


	//Filter
//array of options for search nearby
const checked_options = [];
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

	//Map

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
function bounds(arr){
	if(arr.length<1) return;
	const bounds = new google.maps.LatLngBounds();
    arr.forEach(item=>{
    	bounds.extend(item.mapObj);
    });
    map.fitBounds(bounds);
}
function setBound(arr){
	const bounds = new google.maps.LatLngBounds();
    arr.forEach(item=>{
    	bounds.extend(item.mapObj);
    });    
}


/**
	AJAX Requests
**/

function ajaxlogin(item){
	$.ajax({
		url: 'api/auth/login',
		method: "POST",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item)		
	})
	.done((data)=>{
		local_username = item.username;
		logmein(data);
	})
	.fail(()=>{		
		alertMessage('Invalid username or password');
	});
}
function logmein(data){	
	localToken = data.authToken;	
	alertMessage(`Welcome ${local_username}!`);
	isLogged = true;
	$('#nav-menu-btn').collapse('hide');
	$('#login-btn').hide();
	$('#savedlist-btn').show();
	$('#logout-btn').show();
	getSavedLists();
}
//POST
function saveTheDate(date_title){	
	let post_url = 'api/destination/' + local_username;
	listDB.forEach((item,index)=>{
		if(item.marker!=null){
			item.marker.setMap(null);
			item.marker = null;
			item = null;	
		}		
	});
	const item = {
		"title": date_title,
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
	.fail(()=>{
		alertMessage('Saved to save. Please try again.');
	});
}
function saveSuccess(xhr_sent, status, resFromServer){
	const newEntry = renderSaved_card(xhr_sent);
	alertMessage('save success');
	$('#users_saved_list_modal').append(newEntry);
	$('#date-btn-save').html('<i class="fas fa-save"></i> UPDATE');
	getSavedLists();	
	return;
}

//PUT
function updateTheDate(targetID, item_title){	
	let post_url = 'api/destination/';
	listDB.forEach((item,index)=>{
		if(item.marker!=null){
			item.marker.setMap(null);
			item.marker = null;
			item = null;	
		}		
	});
	const item = {
		"title": item_title,
		"username": local_username,
		"destinations": listDB
	}	
	$.ajax({
		url: post_url,
		method:"PUT",
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item),		
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(updateSuccess)
	.fail(()=>{
		alertMessage('Update Fail');
	});
}
function updateSuccess(xhr_sent, status, resFromServer){	
	$('#date-btn-save').html('<i class="fas fa-save"></i> UPDATE');	
	getSavedLists();
	alertMessage('update success');
	
	return;
}

//GET
function getDetailedSavedList(loadID){
	$.ajax({
		url: 'api/destination/'+loadID,
		method: 'GET',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(loadDestination);
}
function getSavedLists(){		
	$.ajax({
		url: 'api/destination/user/'+local_username,
		method: 'GET',
		contentType: 'application/json',
		dataType: 'json',	
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(loadSavedLists);	
}

function placeServiceProcessor(results, status) {
	
	if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
		alertMessage('no results');
		return;
	}
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		clearMarkers(mapinfo_results);	

	    buildDB(results, resultDB);	    
	    setTimeout(showResults,500);	    
	}
}


/**
	RENDERING
**/

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
function renderPlaces(arr){	
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
		<img class='card-img-top img-thumbnail img-responsive mh-25 d-flex align-self-center result-img' src='${item.photos_large}' alt='card img' idx=${index}>
		`;
	}		
	result += `	
		<div class='card-body text-center'>
			<div class='card-container-result d-inline'>
				<h5 class='card-title text-center'>${item.name}</h5>`;

	if($(window).width()>992){
		result += `<div class='collapse show' id='result-collapse-${index}'>`;
	} else {
		result += `<div class='collapse' id='result-collapse-${index}'>`;
	}
				
	result +=	`<div class='text-center'>${item.hours}</div>
					<br>
					<div>${item.vicinity}</div>
					<a href='#' url='${item.website}' class='d-block text-center btn btn-link font-weight-bold newtab'><i class="fas fa-globe"></i> Webiste</a>
					<button class='btn btn-info showonmap d-blo col-8'>Show from map</button>
				</div>
			</div>
		</div>
		<div class='card-footer'>
			<button class='col-12 btn btn-primary btn-add' targetID='${item.id}' result-index='${index}'><i class="fas fa-plus-square"></i> ADD</button>
		</div>
	</div>`;
	return result;
}
function renderHours(arr){
	let string = `<div>`;
	arr.forEach(item=>{
		string += `<div class='div-info-hours-element'>${item}</div>`;
	});
	string += `</div>`;
	return string;
}
function renderList(item){	
	let place = `
	<div class='list' list-id='${item.id}'>
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
	$('.place-list').append(place);
}
function renderDestination(){
	$('.place-list').html('');	
	for(let i=0;i<listDB.length;i++){
		renderList(listDB[i]);
	}
}
function makeContent(element){
	let content = '';
	content += `<div class='info-div d-flex flex-column text-center' item-id='${element.id}'>`;
	content += `<div class='div-info-title font-weight-bold text-center'>${element.name}</div>`;
	content += `<img class='d-none d-lg-block' src='${element.photos_small}'/>`;	
	content += `<div>${element.vicinity}</div>`;	
	//content += `<a class='badge badge-primary col-12' href='${element.website}'>Website</a>`;
	content += '</div>';
	return content;
}
function renderSaved_card(item){
	
	let thething = `
	<div class='card col-12 col-sm-6 col-md-4 no-paddings text-center' savedLists-id=${item.id}>
		<div class='card-body cormorant font-weight-bold'>${item.title}</div>
		<div class='card-footer'>
			<button type='button' class='btn btn-primary save-load-btn'><i class="fas fa-folder-open"></i></button>
			<button type='button' class='btn btn-danger delete-load-btn'><i class="fas fa-trash-alt"></i></button>
		</div>
	</div>`;
	
	return thething;
}
function loadSavedLists(data){	
	loaded_saved_list = data[0].savedLists;
	const completeCards = 
		data[0].savedLists.map(item=>{
			return renderSaved_card(item);			
		});	
	$('#users_saved_list_modal').html(completeCards);
}

	//making DB

function buildDB(data, database){
	clearArray(database);
	for(let i=0;i<data.length;i++){
		getPlaceDetail(data[i], database);
	}
	return database;
}
function getPlaceDetail(item, database){
	let request = {
		"placeId": item.place_id
	};
	service.getDetails(request, function(place,status){
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			
			if(place.opening_hours && item.photos){
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
				
				element.photos_large = place.photos[0].getUrl({
					'maxHeight':200, 
					'minWidth':350
				});
				element.photos_small = place.photos[0].getUrl({
					'maxHeight':100, 
					'minWidth':150
				});
				element.website = place.website;
				element.vicinity = place.vicinity;
				let iconUrl = '/images/icon/green1.png';
				makeMapInfo(element, mapinfo_results, iconUrl);
				
			    database.push(element);
			}
		}
	})
}
function makeMapInfo(element, map_arr, iconUrl){
	const mapinfo_item = {};
	let icon_ = {
		url: iconUrl,
		scaledSize: new google.maps.Size(50,50)		
	};
	let marker = new google.maps.Marker({
	    position: element.mapObj,
	    icon: icon_,
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
function makeMarkerAndSaveDB(element, database){
	let iconUrl = '/images/icon/red1.png';
    makeMapInfo(element, database, iconUrl);
    listDB.push(element);
    renderList(element);
    showList();
}
function addFromResults(targetID){
	for(let i=0;i<resultDB.length;i++){
		if(resultDB[i].id == targetID){
			removeSingleInfo(targetID, mapinfo_results);
			makeMarkerAndSaveDB(resultDB[i], mapinfo_lists);
			break;
		}
	}
}
function loadDestination(data){
	//hide menu
	$('#nav-menu-btn').collapse('hide');
	//clear lists on the right
	clearDate();
	//build new DB for the list
	data[0].destinations.forEach((item)=>{
		makeMarkerAndSaveDB(item, mapinfo_lists);
	});
	//render places based on listDB
	renderPlaces(listDB);
    
    //clear search results to display loaded items on the result section
    clearArray(resultDB);
    clearMarkers(mapinfo_results);

    //sync DBs
    transferArray(listDB, resultDB);
    transferArray(mapinfo_lists, mapinfo_results);
    
    //wait for the transfer to finish...
    setTimeout(function(){
    	bounds(listDB);
    }, 1000);
    
    //display title on title section in case the user wants to update
    $('#date-title').val(data[0].title);
    $('#date-btn-save').html('<i class="fas fa-save"></i> UPDATE');
	$('#users_saved_list').modal('hide');
}


	//Clearing / Removing

function clearDate(){
	clearMarkers(mapinfo_lists);	
	clearArray(listDB);	
	$('.place-list').html('');
	hideList();
	$('#date-btn-save').html('<i class="fas fa-save"></i> SAVE');
}
function clearArray(arr){
	while(arr.length) arr.pop();
	return;
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
function removeSingleInfo(targetID, mapinfo_arr){
	for(let i=0;i<mapinfo_arr.length;i++){
		if(mapinfo_arr[i].id === targetID){
			let temp = mapinfo_arr.splice(i,1);			
			temp[0].marker.setMap(null);
			delete temp.map;
			delete temp.mapObj;
			delete temp.infowindow;
			break;
		}
	}
	return;
}
function clearMarkers(mapinfo_arr){
	let pop;
	while(mapinfo_arr.length){
		pop = mapinfo_arr.pop();		
		pop.marker.setMap(null);
		pop = null;
	}
	return;
}
function deleteSavedListItem(loadID){	
	$.ajax({
		url: 'api/destination/'+loadID,
		method: 'DELETE',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer ' + localToken); 
		}
	})
	.done(removeSavedList);
}
function removeSavedList(res){
	//remove item from the savedList
	let targetID = res.id;
	$('#users_saved_list_modal')
		.find(`[savedlists-id='${targetID}']`).remove();
	alertMessage(`Successfully removed ${res.title}.`);
}
function transferArray(transmitter, receiver){	
	//copy one array to other array
	//pre-condition: receiver is empty
	for(let i=0;i<transmitter.length;i++){
		receiver[i] = transmitter[i];
	}
	return;
}



	//displaying functions

function showList(){
	if($('#map-container').hasClass('col-lg-10')){
		$('#map-container').removeClass('col-lg-10');
		$('#map-container').addClass('col-lg-7');
		$('#list-container').removeClass('d-none');
		$('.save-btn-container').removeClass('d-none');
	}
}
function showResults(){
	renderPlaces(resultDB);
    bounds(resultDB);
}
function hideList(){
	$('#map-container').removeClass('col-lg-7');
	$('#map-container').addClass('col-lg-10');
	$('#list-container').addClass('d-none');
}




	//Alert / announcement
function alertMessage(msg){
	$('#announcement').find('.modal-body').html(msg);
	$('#announcement').modal('show');
}

	//new tab
function openNewTab(url){
	let tab = window.open(url, '_blank');
	tab.focus();
}



	/**
		Event Listeners
	**/



		//Date Lists section

//click item from list on right to pan to the location with info window
$('.place-list').on('click', '.list-name', event=>{
	let targetID = $(event.currentTarget).parents('.list').attr('list-id');

	for(let i=0;i<mapinfo_lists.length;i++){		
		if(mapinfo_lists[i].id == targetID){			
			let targetObj = mapinfo_lists[i];
			clearAllInfoWindow();
			targetObj.infowindow.open(map, targetObj.marker);
			map.panTo(targetObj.mapObj);
			if(map.getZoom()<=15) map.setZoom(15);
			$('html, body').animate({ scrollTop: 0});
		}
	}
});
//change the order of the item up
$('.place-list').on('click', '.btn-up', event=>{
	let targetID = $(event.currentTarget).parents('.list').attr('list-id');	
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
//change the order of the item down
$('.place-list').on('click', '.btn-dn', event=>{	
	let targetID = $(event.currentTarget).parents('.list').attr('list-id');	
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
//remove an item on the list
$('.place-list').on('click', '.btn-delete', event=>{
	let targetID = $(event.currentTarget).parents('.list').attr('list-id');	
	listDB.forEach((item,index)=>{
		if(targetID === item.id){
			listDB.splice(index, 1);
		}
	});	
	removeSingleInfo(targetID, mapinfo_lists);	
	$(event.currentTarget).closest('.list').remove();
	if(listDB.length<1) clearDate();		
});
//Remove all save list(s) on right side
$('#date-btn-clear').on('click', event=>{	
	$('#confirmation').find('#confirm-confirm').addClass('clearConfirm');
	$('#confirmation').modal('show');
});

$('#save-form').on('click', '#date-btn-save', event=>{
	event.preventDefault();
	if(listDB.length<2){		
		alertMessage('Need at least 2 places to save');
		return;
	}
	if(localToken==='') {	
		$('#login-page').modal('show');
		return;
	}
	
	let item_title = $('#date-title').val();

	for(let i=0;i<loaded_saved_list.length;i++){
		if(loaded_saved_list[i].title === item_title){			
			updateTheDate(loaded_saved_list[i].id, item_title);
			return;
		}
	}
	saveTheDate(item_title);	
});

$('#users_saved_list_close').on('click', ()=>{
	$('#users_saved_list').modal('hide');
});

		//Result Section

//add item from result to list on right side.
$('.results').on('click', '.btn-add', event=>{	
	//add item from results and save to list db and render list.
	showList();	
	const targetID = $(event.currentTarget).parents('.card').attr('item-id');
	addFromResults(targetID);	
	//replace add button to check icon button
	const theButton = `<button class='col-12 btn btn-success btn-add' result-index='' disabled>
	<i class="fas fa-check"></i> ADDED</button>`
	$(event.currentTarget).replaceWith(theButton);	
});

//clear search results displayed as well as markers on map along with infowindow
$('#clear-search').on('click', function(){
	clearMarkers(mapinfo_results);
	clearArray(resultDB);	
	$('.results').html('');
});

$('.results').on('click', '.showonmap', event=>{
	let targetID = $(event.currentTarget).parents('.card').attr('item-ID');
	for(let i=0;i<mapinfo_results.length;i++){		
		if(mapinfo_results[i].id == targetID){			
			let targetObj = mapinfo_results[i];
			clearAllInfoWindow();
			targetObj.infowindow.open(map, targetObj.marker);
			map.panTo(targetObj.mapObj);			
			if(map.getZoom()<=15) map.setZoom(15);
		}
	}	
	$('html, body').animate({ scrollTop: 0});
});
$('.results').on('click', 'a', event=>{
	event.preventDefault();
});

$('.results').on('click', `.card > img`, event=>{
	let targetIndex = $(event.currentTarget).attr('idx');	
	$(`#result-collapse-${targetIndex}`).collapse('toggle');
});

		//Filter

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




		//SEARCH NEARBY

$('#search-nearby').on('click', function(event){	
	const query = {
		location: map.getCenter(),
		radius: 500,
		type: checked_options[0]		
	}
	service.nearbySearch(query, placeServiceProcessor);
});
		//SEARCH KEYWORD
$('#custom-form').on('submit', event=>{
	event.preventDefault();
	const keyword = $('#custom_query').val();	

	const search_query = {
		location: map.getCenter(),
		radius: 500,
		query: keyword
	}
	service.textSearch(search_query, placeServiceProcessor);
});


		//Confirmation

$('#confirmation').on('click', '#confirm-close', event=>{
	$('#confirmation').modal('hide');
});
$('#confirmation').on('click', '.clearConfirm', function(event){
	$(event.currentTarget).removeClass('clearConfirm');
	clearDate();	
	$('#confirmation').modal('hide');
});
$('#confirmation').on('click', '.removeSavedListConfirm', event=>{
	$(event.currentTarget).removeClass('removeSavedListConfirm');
	let loadID = $(event.currentTarget).attr('rm-id');
	$(event.currentTarget).attr('rm-id', '');
	deleteSavedListItem(loadID);
	$('#confirmation').modal('hide');
	$('#date-btn-save').html('<i class="fas fa-save"></i> SAVE');
});

$('#users_saved_list_modal').on('click', '.delete-load-btn', event=>{
	let loadID = $(event.currentTarget).parents('.card').attr('savedLists-id');
	$('#confirmation').find('#confirm-confirm').addClass('removeSavedListConfirm');
	$('#confirmation').find('#confirm-confirm').attr('rm-id', loadID);
	$('#confirmation').modal('show');
});

$('#users_saved_list_modal').on('click', '.save-load-btn', event=>{
	let loadID = $(event.currentTarget).parents('.card').attr('savedLists-id');
	getDetailedSavedList(loadID);
});

$('#announcement-close').on('click', ()=>{
	$('#announcement').modal('hide');
});





//login

$('.demo-submit').on('click', event=>{
	const item = {
		username: 'admin',
		password: 'adminadmin'
	};
	ajaxlogin(item);
});

$('.login-submit').on('click', event=>{
	event.preventDefault();
	const item = {
		username: $('#user_id').val(),
		password: $('#user_pw').val()
	}

	ajaxlogin(item);
});

$('#reg-userpw-confirm').on('blur', function(){
	let pw = $('#reg-userpw').val();
	let pwc = $('#reg-userpw-confirm').val();	
	if($('#reg-userpw-confirm').val() != $('#reg-userpw').val()){
		alertMessage('Password and confirm password doesn\'t match!');
	}
});
$('.js-register-form').on('submit', event=>{
	event.preventDefault();	

	if($('#reg-userpw-confirm').val() != $('#reg-userpw').val()){
		alertMessage('Password is not matching!');
		return;
	}

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
		url: 'api/users',
		method: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(item)
	})
	.done((res_)=>{
		$('#register-page').modal('hide');
		alertMessage(`A user ${item.username} is successfully created.`);
		ajaxlogin(loginItem);
	})
	.fail(()=>{
		alertMessage('Failed to register');
	});
});

$('#register-btn, #login-cancel').on('click', ()=>{
	$('#login-page').modal('hide');
});
$('#logout-btn').on('click', ()=>{
	clearDate();
	localToken = '';
	local_username = '';
	$('#logout-btn').hide();
	$('#savedlist-btn').hide();
	$('#login-btn').show();
	$('#nav-menu-btn').collapse('hide');
	alertMessage('Successfully logged out');
});


//First Page
$('#btn-starttrippin').on('click', function(){
	$('.curtain').animate({		
		opacity: '0'
	}, 1000, function(){
		$('.curtain').remove();
		$('#help').modal('show');
	});	
});
//auto complete
$('.autocomplete-form').on('submit', event=>{
	event.preventDefault();	
	let auto_string = autocomplete.getPlace();	
	if(!auto_string.place_id){
		alertMessage('No results - Try using one of the Autocomplete results.');
		return;
	}
	const place_lat = auto_string.geometry.location.lat();
	const place_lng = auto_string.geometry.location.lng();
	const targetLocation = new google.maps.LatLng(place_lat, place_lng);
	map.panTo(targetLocation);
	map.setZoom(14);
});


		//new tab for websites link
$('.results').on('click','.newtab', (event)=>{
	let url = $(event.currentTarget).attr('url');
	openNewTab(url);
});

$('.newtab').on('click', (event)=>{
	let url = $(event.currentTarget).attr('url');
	openNewTab(url);
});

//INITIALIZATION
function firstLoad(){
	resizeWindow();	
	renderOptions(arr_options);

	$('#logout-btn').hide();
	$('#savedlist-btn').hide();	
	$.ajaxSetup({cache:false});
	$('input[rel="tooltip"]').tooltip({
		/*
		When a function is used to determine the placement, 
		it is called with the tooltip DOM node as its first argument 
		and the triggering element DOM node as its second. 
		The this context is set to the tooltip instance.
		*/
		placement: function(message, target){
			let window_width = $(window).width();
			if(window_width < 992){
				return "top";
			}
			return "left";
		}		
	});
}

$(window).on('resize', function(){
	resizeWindow();
});

function resizeWindow(){
	let window_height = $(window).height();
	let window_width = $(window).width();		
	$('.curtain').height(window_height);
	let resized_height = (window_height*.6);

	$('#map').height(resized_height);
	
	if(window_width>=991){
		$('.place-list').css("maxHeight", resized_height+"px");	
		$('.collapse').collapse('show');
	} else {
		$('.collapse').collapse('hide');
	}

}

$(firstLoad);