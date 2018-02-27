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

GET /:id 
res: list of destinations

PUT /
need: json({title, modifiying destination})
res: updated data

POST /addDate:username
need: json({username, title, destinations})
res: posted data

DELETE /
need: json({title})


## TODO
- add saved list pop-up 
	- saved destinations to load
- update saved list table upon new save	/ delete
- place-list overflow(scroll for desktop, no scroll for mobile)
- add background image(or color) on place-list(div)
- google maps: move zoom control higher position

## misc.
- add location's website & phone number
- display opening hours.
- click item from results and display detailed info in lightbox.
- click item from results to show place on the map.
- From cards, move card-contents to the bottom.

## Thoughts
- add saved destination to current build?
- have 'save the date' add new item or combine with updated list?


## issues
- background for mobile app is chainging when more items are generated below
- unable to login with mobile(iphone)
- not getting error message on invalid username/password
