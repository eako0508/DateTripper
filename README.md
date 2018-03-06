# DateTripper

Heroku:
https:whispering-oasis-17118.herokuapp.com/


Date Tripper will look for point of interests, such as cafe, restaurant and shopping malls nearby a specific locations or by keywords to help users to plan the dates ahead of time.
If the user wishes to save the current date routine, they can save them for the future plans or as a memory to look back.


## End points

GET /
res: all user's saved destinations in detail

GET /all/:username
res: all username's saved destinations in short

GET /user/:username
res: brief user's list

GET /:id 
res: get detailed information of the date
(username, title and destinations object)

PUT /
need: 
 - json({title, modifiying destination})
 - username
res: updated data

POST /:username
need: json({username, title, destinations})
res: posted data

DELETE /:id
need: id of the entry to remove
