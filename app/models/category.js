const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//deciding the fields required for our documents
//category - name
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 64
    }
});

//model names - should be singular and should be in pascal casw
const Category = mongoose.model('Category', categorySchema);

module.exports = {
    Category
}

