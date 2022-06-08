const {validationResult, check} = require("express-validator");
const QuoteSchema = require('../models/quoteSchema');
const profileSchema = require('../models/userInfoSchema')

//https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/

let testFuelQuote = [{id: 1, gallon:"5", delvAddress: "1111 test st", date: "2022-03-19T02:07:48.000Z", pricePerGallon: "8", totalPrice: "60"}]

exports.validate = (method) => {
    switch(method) {
        case 'checkFuel': {
            return [
            check(["id"]).exists()
            ]
        }
    }
}


const fuelQuote = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({errors: errors.array() });
        return;
    }

    const {userName, galloN, delvAddresS, datE, pricePerGalloN, totalPricE} = req.body;
    let multiplicationFactor, margin, suggestedPriceLol, totalAmountDue;

    const exists = await profileSchema.findOne({username: userName});
    multiplicationFactor = .1
    if(exists.state === "Texas"){
    multiplicationFactor += .02;
    }
    else {
    multiplicationFactor += .04;
    }
    if (galloN > 1000){
    multiplicationFactor += .02;
    }
    else {
    multiplicationFactor += .03;
    }
    const quoteExists = await QuoteSchema.findOne({username: userName});
    if(quoteExists/*.countDocuments()!=0*/){
    multiplicationFactor -= .01;
    }
    margin = multiplicationFactor *1.5
    suggestedPriceLol = 1.5 + margin
    totalAmountDue = galloN * suggestedPriceLol
    try {
        const newFuelQuote = new QuoteSchema({
            username: userName,
            date: datE,
            gallons: galloN,
            address: delvAddresS,
            pricePerGallon: suggestedPriceLol,
            totalPrice: Math.round(100*totalAmountDue)/100
        });
        await newFuelQuote.save();
    } catch(err) {
        res.status(500).json({errors: errors.array() });
        return;
    }
    //const checkFuel = {iD, galloN, delvAddresS, datE, pricePerGalloN, totalPricE};

    //const fuelFormInfo = {id:2, gallon: galloN, delvAddress: delvAddresS, date: datE, pricePerGallon: pricePerGalloN, totalPrice:totalPricE}

    //testFuelQuote.push(fuelFormInfo);
    res.status(201).json({message:"All inputs filled"});
};

exports.fuelQuote = fuelQuote;