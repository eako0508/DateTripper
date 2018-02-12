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
			"title": "save2",
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

function renderData(data){
	
	const data_list = data.saved_list.map((item, index) => {
		//return onemorefunction(item, index);
		return renderList(item,index);
		//renderList_group(item, index);
		//renderList_content(item, index);
	});
	
	$('#user-info').html(data_list);
	//console.log(data_list);
}
/*
function renderList_group(item, index){
	return `
		<a class="list-group-item list-group-item-action" 
		data-toggle="list" href="#list-${index}">Ice Cream</a>
	`;
}

function render_content(item, index){
	return `
		<div class="tab-pane fade" id="list-1" >
			<div class='position'>alt: 1, lnt: 1</div>
		</div>
		<div class="tab-pane fade" id="list-2" >
			<div class='position'>alt: 1, lnt: 2</div>
		</div>
		<div class="tab-pane fade" id="list-3" >
			<div class='position'>alt: 1, lnt: 3</div>
		</div>
	`;
}
*/
function renderList(item, index){
		


	let result = `
		<div id='user-saved-lists-${index}' class='card-header'>
	        <button class="btn btn-primary" data-toggle="collapse" 
	        data-target="#saved-list-${index}">${item.title}</button>`;

   	result += `
	    <div id="saved-list-${index}" class="collapse" data-parent="#user-info">
		    <div class="card-body">
		    	<div class='row'>
		    		<div class='col-4'>
		    			<div class='list-group' id='list-group-${index}'>`;
		    			
	let contents = '';

	for(let i=0;i<item.entries.length;i++){
		result += `<a class="list-group-item list-group-item-action" 
		data-toggle="list" href="#list-${index}-${i}">${item.entries[i].name}</a>`;
		
		contents += `
			<div class="tab-pane fade" id="list-${index}-${i}" >
				<div class='position'>
					alt: ${item.entries[i].coord.alt}, 
					lnt: ${item.entries[i].coord.lnt} 
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


