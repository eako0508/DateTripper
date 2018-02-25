var options = (function(){

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

	function filerListManager(event){
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
	   	//$(event.currentTarget).blur();
	   	return false;
	}
	function renderOptions(){

		const items = arr_options.map((item, index)=>{
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

	return {
		checked_options: checked_options,
		renderOptions: renderOptions,
		filerListManager: filerListManager
	}
})();