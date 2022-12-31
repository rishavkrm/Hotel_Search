
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { response } = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let hotels = [];
let posts = []

app.get("/", function(req, res){
  res.render("home", {
    posts: posts
    });
});

app.get("/results", function(req, res){
  res.render("resultHotels", {
    hotels: hotels
    });
});

app.get("/search", function(req, res){
  res.render("search");
});

app.post("/search", function(req, res){
    
  n_guests = req.body.n_guests
  departure_date = req.body.departure_date
  arrival_date =  req.body.arrival_date
  console.log(arrival_date,departure_date)
  for(let i = 0; i < response.length ; i++){

              }
  console.log('apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date='+arrival_date+'&departure_date='+departure_date+'&guest_qty=1&dest_ids=-3712125&room_qty=1&search_type=city&children_qty=2&children_age=5%2C7&search_id=none&price_filter_currencycode=USD&order_by=popularity&languagecode=en-us&travel_purpose=leisure')
  const options = {method: 'GET',headers: {'X-RapidAPI-Key': '1584652a63msh7dd290cb53142f3p181fe3jsna350b1f9281a','X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'}};
  fetch('https://apidojo-booking-v1.p.rapidapi.com/properties/list?offset=0&arrival_date='+arrival_date+'&departure_date='+departure_date+'&guest_qty='+n_guests+'&dest_ids=-3712125&room_qty=1&search_type=city&children_qty=2&children_age=5%2C7&search_id=none&price_filter_currencycode=USD&order_by=popularity&languagecode=en-us&travel_purpose=leisure', options)
  .then(response => response.json())
            .then(response =>   
              { console.log(typeof(response.result))
                response = response.result
                for(let i = 0; i < response.length ; i++){
                  current = response[i]
                  hotelName = current.hotel_name
                  currencyCode = current.currencycode
                  address = current.address_trans
                  hotel_id = current.hotel_id
                  country = current.country_trans
                  const hotel = {
                    hotelName: hotelName,
                    currencyCode: currencyCode,
                    address:address,
                    hotelId:hotel_id,
                    country:country};
                  hotels.push(hotel);}
              res.redirect("/results");}).catch(err => console.error(err));
});


console.log(process.env.XRapidAPIKey)
app.get("/hotels/:hotelId", function(req, res){
  const requestedTitle = (req.params.hotelId);

  hotels.forEach(function(hotel){
    const storedTitle = hotel.hotelId;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.XRapidAPIKey,
        'X-RapidAPI-Host': process.env.XRapidAPIHost
      }
    };
       
    if (storedTitle == requestedTitle) {
      console.log("YES! Found one")
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '1584652a63msh7dd290cb53142f3p181fe3jsna350b1f9281a',
          'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
        }
      };
      
      fetch('https://apidojo-booking-v1.p.rapidapi.com/properties/get-description?hotel_ids='+requestedTitle+'&check_out=2019-03-15&languagecode=en-us&check_in=2019-03-13', options)
        .then(response => response.json())
        .then(response => {
          description = response[0].description
        })
        .catch(err => console.error(err));
      fetch('https://apidojo-booking-v1.p.rapidapi.com/properties/get-hotel-photos?hotel_ids='+requestedTitle+'&languagecode=en-us', options)
      .then(response => response.json())
      .then(response => {
        urlPrefix = response.url_prefix
        photo1 = urlPrefix + response.data[storedTitle][0][4]
        photo2 = urlPrefix + response.data[storedTitle][0][7]
      res.render("hotel", {
        hotelName: hotel.hotelName,
        currencyCode: hotel.currencyCode,
        address:hotel.address,
        hotelId:hotel.hotelId,
        country:hotel.country,
        photo1:photo1,
        photo2:photo2,
        description:description
      });
      })
      .catch(err => console.error(err));
      // photo1 = findPhoto()
      
    }
  });

});

app.get("/compose", function(req, res){
  res.render("compose");
});
app.post("/compose", function(req, res){
  const post = {
    name: req.body.name,
    cpuntry: req.body.country,
    postBody: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});