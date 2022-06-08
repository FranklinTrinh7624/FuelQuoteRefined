const express = require("express");
const router = express.Router();
const fuelControl = require("../controllers/fuel");


router.post("/fuelquoteform",fuelControl.validate("checkFuel"), fuelControl.fuelQuote);

module.exports = router;

