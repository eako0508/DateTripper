//user.js


function renderData(data){
	const data_list = data.saved_list.map((item, index) => {
		renderList(item,index);
		renderList_group(item, index);
		renderList_content(item, index);
	});
	$('#user-info').html(data_list);
}

function renderList_group(item, index){
	//
}

function renderList(item, index){
	return `
		<div id='user-saved-lists-${index}' class='card-header'>
	        <button class="btn btn-primary" data-toggle="collapse" 
	        data-target="#saved-list-${index}">${item.title}</button>
		    <div id="saved-list-${index}" class="collapse" data-parent="#user-info">
			    <div class="card-body">
			    	<div class='row'>
			    		<div class='col-4'>
			    			<div class='list-group list-group-${index}'>
//needs looping
			    				<a class="list-group-item list-group-item-action" data-toggle="list" href="#list-1">Ice Cream</a>
			    				<a class="list-group-item list-group-item-action" data-toggle="list" href="#list-2">Movie Theater</a>
			    				<a class="list-group-item list-group-item-action" data-toggle="list" href="#list-3">Restaurant</a>

			    			</div>
			    		</div>
			    		<div class='col-8'>
			    			<div class='tab-content tab-content-${index}'>
//needs looping
			    				<div class="tab-pane fade" id="list-1" >
			    					<div class='position'>alt: 1, lnt: 1</div>
			    				</div>
			    				<div class="tab-pane fade" id="list-2" >
			    					<div class='position'>alt: 1, lnt: 2</div>
			    				</div>
			    				<div class="tab-pane fade" id="list-3" >
			    					<div class='position'>alt: 1, lnt: 3</div>
			    				</div>

			    			</div>
			    		</div>
			    	</div>
			    </div>
		    </div>
		</div>
	`;
}


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

