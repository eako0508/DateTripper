//user.js
'use strict'

let userData = {
	"saved_list": [
		{
			"id": "1",
			"title": "save1",
			"entries": [
				{
					"name": "ice cream",
					"img": "img url",
					"coord": {"lat": 1, "lng":1}
				},
				{
					"name": "movie theater",
					"img": "img url",
					"coord": {"lat": 1, "lng":2}
				},
				{
					"name": "restaurant",
					"img": "img url",
					"coord": {"lat": 1, "lng":3}
				}
			]
		},
		{
			"id": "2",
			"title": "save2",
			"entries": [
				{
					"name": "skate",
					"img": "img url",
					"coord": {"lat": 2, "lng":1}
				},
				{
					"name": "fish and chips",
					"img": "img url",
					"coord": {"lat": 2, "lng":2}
				},
				{
					"name": "helicopter ride",
					"img": "img url",
					"coord": {"lat": 2, "lng":3}
				}
			]
		}
	]
};

function renderData(data){
	
	const data_list = data.saved_list.map((item, index) => {
		return renderList(item,index);
	});
	
	$('#user-info').html(data_list);
}


function renderList(item, index){
		

	//Render Lists
	let result = `
		<div id='user-saved-lists-${index}' class='card-header'>
	        <button class="btn btn-primary" data-toggle="collapse" 
	        data-target="#saved-list-${index}">${item.title}</button>`;
	
	//render List's places
   	result += `
	    <div id="saved-list-${index}" class="collapse" data-parent="#user-info">
		    <div class="card-body">
		    	<div class='row'>
		    		<div class='col-4'>
		    			<div class='list-group' id='list-group-${index}'>`;
		    			
	let contents = '';

	//list Lists places's coord
	for(let i=0;i<item.entries.length;i++){
		result += `<a class="list-group-item list-group-item-action" 
		data-toggle="list" href="#list-${index}-${i}">${item.entries[i].name}</a>`;
		
		contents += `
			<div class="tab-pane fade" id="list-${index}-${i}" >
				<div class='position'>
					lat: ${item.entries[i].coord.lat}, 
					lng: ${item.entries[i].coord.lng} 
				</div>
			</div>
		`;
		
	}

	result += `
			    			</div>
			    		</div>
			    		<div class='col-8'>
			    			<div class='tab-content tab-content-${index}'>`;
	result += contents;
	result += `
			    			</div>
			    		</div>
			    	</div>
			    </div>
		    </div>
		</div>
	`;
	return result;
}



$(renderData(userData));


