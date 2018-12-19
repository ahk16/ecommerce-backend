const express = require('express');
const router = express.Router();

//npm install --save mongodb
const { ObjectID } = require('mongodb');

const {Category} = require('../models/category');

module.exports = {
    categoriesController: router
}

const validateId = (req, res, next) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.send({
            notice: 'Invalid Object Id'
        })
    } else {
        next();
    }
}

// localhost:3000/categories/
router.get('/', function(req, res) {
    Category.find().then(function(categories) {
        res.send(categories);
    }).catch(function(err) {
        res.send(err);
    })
});

// localhost:3000/categories/id
router.get('/:id', validateId, function(req, res) {
    let id = req.params.id;
    
    // if(!ObjectID.isValid(id)) {
    //     res.send({
    //         notice: 'Invalid object id'
    //     })
    // }
     Category.findById(id).then(function(category) {
        res.send(category);
    }).catch(function(err) {
        res.send(err);
    })
});

//POST localhost:3000/categories
router.post('/', function(req, res) {
    let body = req.body;
    let c = new Category(body);
    c.save().then(function(category) {
        res.send(category);
    }).catch(function(err) {
        res.send(err);
    })
});

//PUT localhost:3000/categories/id
router.put('/:id', validateId, function(req, res) {
    let id = req.params.id;
    let body = req.body;
    Category.findByIdAndUpdate(id, { $set: body}, { new: true}).then(function(category) { //$set is mongodb method
        res.send(category);
    }).catch(function(err) {
        res.send(err);
    })
});

//DELETE localhost:3000/categories/id
router.delete('/:id', validateId, function(req, res) {
    let id = req.params.id; //req is provided by express

    // if(!ObjectID.isValid(id)){
    //     res.send({
    //         notice: 'Invalid Object id'
    //     })
    // }
    Category.findByIdAndDelete(id).then(function(category) {
        res.send( {
            notice: 'Successfully deleted the record'
        })
    }).catch(function(err) {
        res.send(err);
    })
});

