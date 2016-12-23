// The Price model

var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var priceSchema = new Schema({
    id: ObjectId,
    item_name: String,
    added_date: {type: Date, default: Date.now},
    price: Number,
    extra_info: String
});

module.exports = mongoose.model('Price', priceSchema);