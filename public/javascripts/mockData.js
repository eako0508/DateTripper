var MockData = (function(){

    const userInfo = {
        "_id": {
            "$oid": "5a9c9e2ea171c91c54403ecf"
        },
        "firstName": "admin",
        "lastName": "",
        "savedLists": [
            {
                "id": {
                    "$oid": "5a9c9e8ea171c91c54403ed0"
                },
                "username": "admin",
                "title": "Bryant Night"
            },
            {
                "id": {
                    "$oid": "5a9c9f18a171c91c54403ed1"
                },
                "username": "admin",
                "title": "Hoboken with Jessica"
            },
            {
                "id": {
                    "$oid": "5a9c9f56a171c91c54403ed2"
                },
                "username": "admin",
                "title": "SOHO FUN"
            }
        ],
        "username": "admin",
        "password": "$2a$10$rC2Hpvii5faAWs9wU9l1XOBoDEwBXGYqufX7LTnPkyWi6MD93wLMq",
        "__v": 0
    };

    const date1 = {
        "_id": {
            "$oid": "5a9c9e8ea171c91c54403ed0"
        },
        "destinations": [
            {
                "name": "Astro Gallery of Gems, Fine Minerals, Fossils and Meteorites",
                "id": "fa1ea53e9cfdba577c302bb3374eed3777217269",
                "place_id": "ChIJacKkfgdZwokR3aO46wfUMSk",
                "location": {
                    "lat": 40.75053399999999,
                    "lng": -73.98264599999999
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipO-lMJqbeb5Ll1x5I3fwIRLxe-0h09XjodSNbw1=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipO-lMJqbeb5Ll1x5I3fwIRLxe-0h09XjodSNbw1=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 10:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Tuesday: 10:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Wednesday: 10:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Thursday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Friday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Saturday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Sunday: 11:00 AM \u2013 7:00 PM<\/div><\/div>",
                "website": "http://www.astrogallery.com/",
                "vicinity": "417 5th Avenue, New York",
                "mapObj": {
                    "lat": 40.75053399999999,
                    "lng": -73.98264599999999
                }
            },
            {
                "name": "Ai Fiori",
                "id": "c6299510ebec746f83179aaecc314d108abd40c3",
                "place_id": "ChIJMYIE-KlZwokRZuFHn8jkNuo",
                "location": {
                    "lat": 40.7501556,
                    "lng": -73.98388119999998
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipPDIVf31gaXV5EzJZZLRqMjrmpnBlSBJCxxp_pG=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipPDIVf31gaXV5EzJZZLRqMjrmpnBlSBJCxxp_pG=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 7:00 AM \u2013 11:30 PM<\/div><div class='div-info-hours-element'>Tuesday: 7:00 AM \u2013 11:30 PM<\/div><div class='div-info-hours-element'>Wednesday: 7:00 AM \u2013 11:30 PM<\/div><div class='div-info-hours-element'>Thursday: 7:00 AM \u2013 11:30 PM<\/div><div class='div-info-hours-element'>Friday: 7:00 AM \u2013 11:30 PM<\/div><div class='div-info-hours-element'>Saturday: 7:00 AM \u2013 11:30 PM<\/div><div class='div-info-hours-element'>Sunday: 7:00 AM \u2013 10:30 PM<\/div><\/div>",
                "website": "http://www.aifiorinyc.com/",
                "vicinity": "400 5th Avenue #2, New York",
                "mapObj": {
                    "lat": 40.7501556,
                    "lng": -73.98388119999998
                }
            },
            {
                "name": "Pershing Square",
                "id": "4394bb8203cbc3312b1c04087fdbe5b2cf90678c",
                "place_id": "ChIJBRoSgwFZwokRUSh30OTrJ6A",
                "location": {
                    "lat": 40.75192370000001,
                    "lng": -73.97760389999996
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipMzQP7gOXUqX8IiK5B0BTgLZeQBBZN4n-66qG9y=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipMzQP7gOXUqX8IiK5B0BTgLZeQBBZN4n-66qG9y=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 7:00 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Tuesday: 7:00 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Wednesday: 7:00 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Thursday: 7:00 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Friday: 7:00 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Saturday: 8:00 AM \u2013 10:00 PM<\/div><div class='div-info-hours-element'>Sunday: 8:00 AM \u2013 10:00 PM<\/div><\/div>",
                "website": "http://www.pershingsquare.com/",
                "vicinity": "90 East 42nd Street, New York",
                "mapObj": {
                    "lat": 40.75192370000001,
                    "lng": -73.97760389999996
                }
            }
        ],
        "username": "admin",
        "title": "Bryant Night",
        "__v": 0
    };

    const date2 = {
        "_id": {
            "$oid": "5a9c9f18a171c91c54403ed1"
        },
        "destinations": [
            {
                "name": "Sawadee",
                "id": "b3364fafd4afd8e23f3f8ae2afa8cde3c3afc803",
                "place_id": "ChIJWUzjOLJQwokR_78ObF79Lfg",
                "location": {
                    "lat": 40.720151,
                    "lng": -74.04387400000002
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipP8kV12EC-51niGF_B7Tx1_l41W1ee58foc6apK=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipP8kV12EC-51niGF_B7Tx1_l41W1ee58foc6apK=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 11:30 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Tuesday: 11:30 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Wednesday: 11:30 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Thursday: 11:30 AM \u2013 10:30 PM<\/div><div class='div-info-hours-element'>Friday: 11:30 AM \u2013 11:00 PM<\/div><div class='div-info-hours-element'>Saturday: 1:00 \u2013 11:00 PM<\/div><div class='div-info-hours-element'>Sunday: 12:00 \u2013 10:00 PM<\/div><\/div>",
                "website": "http://www.sawadeejc.com/",
                "vicinity": "137 Newark Ave, Jersey City",
                "mapObj": {
                    "lat": 40.720151,
                    "lng": -74.04387400000002
                }
            },
            {
                "name": "THE WAREHOUSE CAFE",
                "id": "ea6e660e33a5c5aaacbf6662b97267523934b1ea",
                "place_id": "ChIJxy8MrK1QwokRHqDrFa-fiKY",
                "location": {
                    "lat": 40.7208368,
                    "lng": -74.03910719999999
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipNS0SnghEVp--ezc7NTWCtPE1IXJkHEHNQStc1_=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipNS0SnghEVp--ezc7NTWCtPE1IXJkHEHNQStc1_=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 7:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Tuesday: 7:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Wednesday: 7:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Thursday: 7:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Friday: 7:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Saturday: 7:00 AM \u2013 8:00 PM<\/div><div class='div-info-hours-element'>Sunday: 7:00 AM \u2013 8:00 PM<\/div><\/div>",
                "website": "http://thewarehousejc.com/",
                "vicinity": "140 Bay Street, Jersey City",
                "mapObj": {
                    "lat": 40.7208368,
                    "lng": -74.03910719999999
                }
            },
            {
                "name": "Barcade",
                "id": "87a4323267694e780abb305a3c9ab52f499b9e3d",
                "place_id": "ChIJJSZTkZ1TwokRwY0-pcTcvME",
                "location": {
                    "lat": 40.7207915,
                    "lng": -74.0450083
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipPztyxCQNLvd159NQGa8-reBXV3nDXRmWAbNZ2T=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipPztyxCQNLvd159NQGa8-reBXV3nDXRmWAbNZ2T=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 12:00 PM \u2013 2:00 AM<\/div><div class='div-info-hours-element'>Tuesday: 12:00 PM \u2013 2:00 AM<\/div><div class='div-info-hours-element'>Wednesday: 12:00 PM \u2013 2:00 AM<\/div><div class='div-info-hours-element'>Thursday: 12:00 PM \u2013 2:00 AM<\/div><div class='div-info-hours-element'>Friday: 12:00 PM \u2013 3:00 AM<\/div><div class='div-info-hours-element'>Saturday: 12:00 PM \u2013 3:00 AM<\/div><div class='div-info-hours-element'>Sunday: 12:00 PM \u2013 2:00 AM<\/div><\/div>",
                "website": "http://barcadejerseycity.com/",
                "vicinity": "163 Newark Avenue, Jersey City",
                "mapObj": {
                    "lat": 40.7207915,
                    "lng": -74.0450083
                }
            }
        ],
        "username": "admin",
        "title": "Hoboken with Jessica",
        "__v": 0
    };

    const date3 =  {
        "_id": {
            "$oid": "5a9c9f56a171c91c54403ed2"
        },
        "destinations": [
            {
                "name": "Housing Works Bookstore Cafe",
                "id": "157022f7378cdcf87ff7155004832bf49ad74dcd",
                "place_id": "ChIJSaRjC49ZwokR402Rpxj6i9Q",
                "location": {
                    "lat": 40.724569,
                    "lng": -73.996485
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipP-b5sa-owIzTsg65aMoICG3MJjMqTEidaW7duh=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipP-b5sa-owIzTsg65aMoICG3MJjMqTEidaW7duh=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Tuesday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Wednesday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Thursday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Friday: 10:00 AM \u2013 9:00 PM<\/div><div class='div-info-hours-element'>Saturday: 10:00 AM \u2013 5:00 PM<\/div><div class='div-info-hours-element'>Sunday: 10:00 AM \u2013 5:00 PM<\/div><\/div>",
                "website": "https://www.housingworks.org/locations/bookstore-cafe",
                "vicinity": "126 Crosby Street, New York",
                "mapObj": {
                    "lat": 40.724569,
                    "lng": -73.996485
                }
            },
            {
                "name": "Cipriani Downtown",
                "id": "652bcaaaccd5d784feb8de30552102d105f9708b",
                "place_id": "ChIJ71HLcIxZwokRXymDgawloWI",
                "location": {
                    "lat": 40.7235659,
                    "lng": -74.00300190000002
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipNsOLPaj50o7FVBtfwXWIvAUV9Wu-BU2BO-sjNv=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipNsOLPaj50o7FVBtfwXWIvAUV9Wu-BU2BO-sjNv=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: 12:00 \u2013 11:45 PM<\/div><div class='div-info-hours-element'>Tuesday: 12:00 \u2013 11:45 PM<\/div><div class='div-info-hours-element'>Wednesday: 12:00 \u2013 11:45 PM<\/div><div class='div-info-hours-element'>Thursday: 12:00 \u2013 11:45 PM<\/div><div class='div-info-hours-element'>Friday: 12:00 \u2013 11:45 PM<\/div><div class='div-info-hours-element'>Saturday: 12:00 \u2013 11:45 PM<\/div><div class='div-info-hours-element'>Sunday: 12:00 \u2013 11:45 PM<\/div><\/div>",
                "website": "http://www.cipriani.com/restaurant/?loc=ny-downtown",
                "vicinity": "376 West Broadway, New York",
                "mapObj": {
                    "lat": 40.7235659,
                    "lng": -74.00300190000002
                }
            },
            {
                "name": "The James New York \u2013 SoHo",
                "id": "4b96cded178ae214006ee9aa424fdcc6d564ecb8",
                "place_id": "ChIJq9ZiaYtZwokRK60-dYxlsLo",
                "location": {
                    "lat": 40.722739,
                    "lng": -74.00469079999999
                },
                "photos_large": "https://lh3.googleusercontent.com/p/AF1QipMVMetLkv_l8pxJ3cn9kzml2-hu4UqhDatLRHHc=h200-k",
                "photos_small": "https://lh3.googleusercontent.com/p/AF1QipMVMetLkv_l8pxJ3cn9kzml2-hu4UqhDatLRHHc=h100-k",
                "hours": "<div><div class='div-info-hours-element'>Monday: Open 24 hours<\/div><div class='div-info-hours-element'>Tuesday: Open 24 hours<\/div><div class='div-info-hours-element'>Wednesday: Open 24 hours<\/div><div class='div-info-hours-element'>Thursday: Open 24 hours<\/div><div class='div-info-hours-element'>Friday: Open 24 hours<\/div><div class='div-info-hours-element'>Saturday: Open 24 hours<\/div><div class='div-info-hours-element'>Sunday: Open 24 hours<\/div><\/div>",
                "website": "http://www.jameshotels.com/new-york/soho",
                "vicinity": "27 Grand Street, New York",
                "mapObj": {
                    "lat": 40.722739,
                    "lng": -74.00469079999999
                }
            }
        ],
        "username": "admin",
        "title": "SOHO FUN",
        "__v": 0
    };

    const date_array = [date1, date2, date3];

    return {
        userInfo: userInfo,
        date_array: date_array
    }    
})();