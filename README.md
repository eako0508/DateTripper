# DateTripper

Heroku:
https:whispering-oasis-17118.herokuapp.com/


## End points

GET /
res: all user's saved destinations in detail

GET /all/:username
res: all username's saved destinations in detail

GET /user/:username
res: brief user's list

GET /title 
need: json({title})
res: list of destinations

PUT /
need: json({title})
res: updated data

POST /addDate:username
need: json({username, title, destinations})
res: posted data

DELETE /
need: json({title})


## TODO
- add saved list pop-up 
	- saved destinations to load
	

## misc.
- add location's website & phone number
- display opening hours.
- click item from results and display detailed info in lightbox.
- click item from results to show place on the map.
- From cards, move card-contents to the bottom.

