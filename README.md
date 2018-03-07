# DateTripper

![desktop](https://github.com/eako0508/DateTripper/blob/feature/mvp-client-with-mock-data/img/Screenshots/desktop/adding_places_desktop.png)
![mobile](https://github.com/eako0508/DateTripper/blob/feature/mvp-client-with-mock-data/img/Screenshots/mobile/Main_mobile.PNG)

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


## Author

Eugene A. Ko
