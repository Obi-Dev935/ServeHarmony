const express = require('express');
require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
app.use(express.static('public')); 

const restaurants = require('./data')
const cafes = require('./dataCafe')

// const Product = require('./model/product');
// const Form = require('./model/register');

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/',(request,response) => {
  response.render('PhonePage')
});
app.get('/ChoicePage',(request,response) => {
  response.render('ChoicePage')
});
app.get('/restaurantPage',(request,response) => {
  response.render('restaurantPage', {restaurants: restaurants})
});

app.get('/cafePage',(request,response) => {
  response.render('cafePage', {cafes:cafes})
});

app.get('/restaurant/menu',(request,response) => {
  response.render('menu')
});

// app.get('/Register/v1/',(request,response) => {
//     response.render('Register', {title: 'Add products', message: '', error: ''})
// });


app.use((request,response) => { 
  response.status(404).send('<h1>Error</h1>')
});

mongoose.connect(process.env.MONGO_URI)
  .then(result => {
    console.log(`Successfully connected to database server..`);
    app.listen(process.env.PORT, () => {
      console.log(`Web server listening on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log(error);
  })
  
  
  
  
// app.post('/Register/v1/', (req, res) => {
//   const name = req.body.name;
//   const Lname = req.body.Lname;
//   const email = req.body.email;
//   const phoneNumber = req.body.phoneNumber;
//   const Country = req.body.Country;
//   const City = req.body.City;
//   const address = req.body.address;
//   const Shipping = req.body.option;
//   let newform = new Form({name: name, Lname: Lname, email: email, phoneNumber: phoneNumber, Country: Country, City: City, address: address, Shipping: Shipping });
//   newform.save()
//     .then((result) => {
//       res.render('Register', {
//         title: 'Add Form', 
//         message: 'Form added successfully',
//         error: ''
//         });
//     })
//     .catch((err) => {
//       console.log(`Error when adding a Form object: ${err}`);
//       res.render('Register', {
//         title: 'Add Form', 
//         message: '',
//         error: `Could not save data to database: ${err}`
//       });
//     });
// });
  
// app.get('/Addproduct/v1/',(request,response) => {
//   response.render('Addproduct', {title: 'Add products', message: '', error: ''})
// });

// app.post('/Addproduct/v1/', (request, response) => {
//   const name = request.body.name;
//   const quantity = request.body.quantity;
//   const price = request.body.price;
//   let newproduct = new Product({name: name, quantity: quantity, price: price});
//   newproduct.save()
//     .then((result) => {
//       response.render('Addproduct', {
//         title: 'Add product', 
//         message: 'product added successfully',
//         error: ''
//       });
//     })
//     .catch((err) => {
//       console.log(`Error when adding a product object: ${err}`);
//       response.render('Addproduct', {
//         title: 'Add product', 
//         message: '',
//         error: `Could not save data to database: ${err}`
//       });
//     });
// });

// app.get('/Search/v1/', (request, response) => {
//   const name = request.query.name;
//   Product.find({"name": {"$regex" : `${name}`, "$options": "i" }})
//     .then(data => {
//       response.render('Search', {name: 'Search Product', products: data, error: ""});
//     })
//     .catch(err => {
//       console.log(`Couldnt search for products ${err}`);
//       response.render('Search', {name: 'Search Product', products: [], error: err});
//     })
// });