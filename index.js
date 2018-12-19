const express = require('express');
const app = express();

const { mongoose } = require('./config/db');
const { categoriesController } = require('./app/controllers/categories_controller');
const { productsController } = require('./app/controllers/products_controller');
const { usersController } = require('./app/controllers/users_controller');
//const mongoose = require('./config/db').mongoose;
const port = 3000;

app.use(express.json());

app.get('/', function(req, res) {
    res.send('Welcome to the site');
});

// /categories, categoriesController
app.use('/categories', categoriesController);

// /products, productsController
app.use('/products', productsController);

// /users, usersController
app.use('/users', usersController);

app.listen(port, function() {
    console.log('Listening on port', port);
})