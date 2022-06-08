const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema ({
    username: {type: String, required: true, trim: true, minlength: 8},
    firstname: {type: String, required: true, trim: true, maxlength: 25},
    lastname: {type: String, required: true, trim: true, maxlength: 25},
    address1:{type: String, required: true, trim: true, maxlength: 100},
    address2: {type: String, required: false, trim: true, maxlength: 100},
    city: {type: String, required: true, trim: true, maxlength: 100},
    state: {type: String, required: true, trim: true, minlength: 2},
    zipcode: {type: String, required: true, trim: true, minlength:5, maxlength: 9},
});

const userInformation = mongoose.model("userInfo", userInfoSchema);
module.exports = userInformation;