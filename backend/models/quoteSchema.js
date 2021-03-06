const mongoose = require('mongoose');

fuelQuoteSchema = new mongoose.Schema ({
    username:{type: String, required: true, trim: true, minlength: 8},
    //quoteID: {type: Number, required: true},
    date: {type:Date, required:true},
    gallons: {type:Number, required: true},
    address: {type: String, required:true},
    pricePerGallon: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    expirationDate: {type: Date, required: true},
});

const quoteSchema = mongoose.model("FuelQuote", fuelQuoteSchema);
module.exports = quoteSchema;