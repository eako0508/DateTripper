# DateTripper

![desktop](https://github.com/eako0508/DateTripper/blob/master/img/Screenshots/desktop/adding_places_desktop.png)
![mobile](https://github.com/eako0508/DateTripper/blob/master/img/Screenshots/mobile/mobile_demo.PNG)

I like going out on a date for places such as concert, movie theater, ice links, and so on but not sure what to do before or after the event.  This application can help users to find out about nearby places and make a whole date planned out to have a good time.

Date Tripper will look for point of interests, such as cafe, restaurant and shopping malls nearby a specific locations or by keywords to help users to plan the dates ahead of time.

If the user wishes to save the current date routine, they can save them for the future plans or as a memory to look back.


## Installation

npm install


## Live Demo

[https://datetripper.herokuapp.com/](https://datetripper.herokuapp.com/)





## End points

**GET /**

res: all user's saved destinations in detail

**GET /all/:username**

res: all username's saved destinations in short

**GET /user/:username**

res: brief user's list


**GET /:id**

res: get detailed information of the date
(username, title and destinations object)


**PUT /**

need: 

 - json({title, modifiying destination})
 - username
 
res: updated data


**POST /:username**

need: json({username, title, destinations})

res: posted data


**DELETE /:id**

need: id of the entry to remove


## Built With
- [Node.js (Express)](https://expressjs.com/)
- [jQuery](https://jquery.com/)
- [Google Maps API & Places library](https://developers.google.com/maps/documentation/javascript/tutorial)
- [Bootstrap](https://getbootstrap.com/)
- [FontAwesome](https://fontawesome.com/)


## Author

Eugene A. Ko
