console.log('hello')
const express = require('express');
const app = express()
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const UserSchema = require('./models/userSchema');
const profileSchema = require('./models/userInfoSchema');
const QuoteSchema = require('./models/quoteSchema');
const {validateToken} = require('./authMiddleware');
const { restart } = require('nodemon');
const {sign} = require('jsonwebtoken');

app.use(express.static(path.join(__dirname, '..','frontend','build')));
app.use(cors());
app.use(express.json());
//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({
    extended: true
}));


app.get('/', function (req, res) {
    res.redirect('index.html')
  }); 


app.post('/data/registration', (req,res)=> {
  //req.accepts('application/json');
  const username = req.body.userRegister;
  const password = req.body.passwordRegister;
  const {userRegister, passwordRegister} = req.body;
  if(userRegister.length < 8) {
    return res.json({error1: "User should be 8 characters minimum"});
  } 
  else if(passwordRegister.length < 8) {
    return res.json({error2: "Password should be 8 characters minimum"});
  }
  let hashpass;
  hashpass = bcrypt.hash(passwordRegister,10).then((hash) => {
    const freshAcc = new UserSchema({
      username: userRegister,
      password: hash
    })
    freshAcc.save()
    .then((result)=> {
      console.log(result);
    })
    .catch((err)=>{
      console.log(err);
    })
  }) 
  res.json({msg: "success"});
})

app.post('/data/login', async (req,res)=> { //very basic, needs more functionality
  const username = req.body.logUser;
  const password = req.body.logPassword;
  const {logUser, logPassword} = req.body;
  //const {username, password} = req.body;
  const existing = await UserSchema.findOne({username: logUser});
  if(!existing) res.json({error:"User doesn't exist"});

  const dbPassword = existing.password;
  bcrypt.compare(logPassword, dbPassword).then((match)=> {
    if(!match) {
      //console.log("wrong stuff");
      res.json({error: "Wrong user and pass combination"});
    }
    const accessToken = sign({username: existing.username}, "importantsecret");
    res.json({token: accessToken, username: existing.username});
    
  });

})

app.get('/data/login/auth', validateToken, (req,res) => {
  res.json(req.user);
})

/*app.get("/data/clientprofile",(req,res)=> {
  
})*/

app.post("/data/clientprofile", validateToken, async (req,res)=> {
  const username = req.user.username;
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const address1 = req.body.address1;
  const address2 = req.body.address2;
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipcode;

  if(firstname.length > 25) {
    res.json({errors: "First name, 25 char or less please" });
  }
  if(lastname.length > 25) {
    res.json({errors: "Last name, 25 char or less please" });
  }
  if(address1.length > 100) {
    res.json({errors: "Address 1, 100 char or less please" });
  }
  if(address2.length > 100) {
    res.json({errors: "Address 2, 100 char or less please" });
  }
  if(city.length > 100) {
    res.json({errors: "City, 100 char or less please" });
  }
  if(zipcode.length > 9) {
    res.json({errors: "Zipcode, keep it 5-9 digits please" });
  }

  const exists = await profileSchema.findOne({username: username});
  if(!exists) {
    const profileForm = new profileSchema({
      username: username,
      firstname: firstname,
      lastname: lastname,
      address1: address1,
      address2: address2,
      city: city,
      state: state,
      zipcode: zipcode,
  
    });
    profileForm.save()
    res.status(200).json({message: "saved"});
  } else {
    res.json({msg: "a profile for this user exists"});
  }

  // .then((result)=> {
  //   console.log(result);
  // })
  // .catch((err)=>{
  //   console.log(err);
  // })
})


app.post('/data/fuelquote', validateToken, async (req,res)=>{
  const username = req.user.username;
  const date = req.body.date;
  const gallons = req.body.gallons;
  const expiration = req.body.expiration;
  //const pricePerGallon = req.body.pricePerGallon;
  //const address = req.body.address;
  const exists = await profileSchema.findOne({username: username});
  if(!exists) res.json({error: "User does not exist"});
  multiplicationFactor = .1
  if(exists.state === "Texas"){
    multiplicationFactor += .02;
  }
  else {
    multiplicationFactor += .04;
  }
  if (gallons > 1000){
    multiplicationFactor += .02;
  }
  else {
    multiplicationFactor += .03;
  }
  const quoteExists = await QuoteSchema.findOne({username: username});
  if(quoteExists/*.countDocuments()!=0*/){
    multiplicationFactor -= .01;
  }
  margin = multiplicationFactor *1.5
  suggestedPriceLol = 1.5 + margin
  totalAmountDue = gallons * suggestedPriceLol

  //const expirationInDay = 7;

  const fuelform = new QuoteSchema({ //username: exists.username address: exists.address1
    username: exists.username,
    date: date, //look up javascript date formating
    gallons: gallons,
    address: exists.address1,
    pricePerGallon: suggestedPriceLol, 
    totalPrice: Math.round(100*totalAmountDue)/100,
    expirationDate: expiration
  });
  console.log(fuelform);
  await fuelform.save()
  res.json({message: "it works?"});
    // .then((result)=> {
    //   console.log(result);
    // })
    // .catch((err)=>{
    //   console.log(err);
    // })
    //res.status(200).send(":D");
})

// app.get('/fuelquote/:username', async(req,res)=>{
//   const quote = await QuoteSchema.find({
//     username: req.params.username
//   })
//   res.send(quote);
// })

app.get('/data/fuelquote', validateToken, async(req,res)=>{ //getting all fuel quotes related
  const username = req.user.username;
  //const gallons = req.body.gallonsRequeseted;
  //const date = req.body.date;
  const quote = await QuoteSchema.find({
    username: username,
    //gallons: gallons,
    //date: date,
  });
  if(!quote) res.json({error: "Cannot retrieve fuel quote"});
  res.send(quote);
})

app.patch("/data/clientprofile", validateToken, async(req,res) => {
  const username = req.user.username;
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const address1 = req.body.address1;
  const address2 = req.body.address2;
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipcode;

  if(firstname.length > 25) {
    res.json({errors: "First name, 25 char or less please" });
  }
  if(lastname.length > 25) {
    res.json({errors: "Last name, 25 char or less please" });
  }
  if(address1.length > 100) {
    res.json({errors: "Address 1, 100 char or less please" });
  }
  if(address2.length > 100) {
    res.json({errors: "Address 2, 100 char or less please" });
  }
  if(city.length > 100) {
    res.json({errors: "City, 100 char or less please" });
  }
  if(zipcode.length > 9) {
    res.json({errors: "Zipcode, keep it 5-9 digits please" });
  }

  const exists = await profileSchema.findOne({username: username});
  if(!exists) {
    res.json({errormsg: "Could not retrieve profile, or create profile first"});
  }

  exists.firstname = firstname;
  exists.lastname = lastname;
  exists.address1 = address1;  
  exists.address2 = address2;
  exists.city = city;
  exists.state = state;
  exists.zipcode = zipcode;

  await exists.save();
  res.status(200).json({message: "updated"});

})
//mongodb+srv://DeadFallen:@cluster0.legd1.mongodb.net/FuelApplication?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://DeadFallen:franklint1234@cluster0.legd1.mongodb.net/FuelApplication?retryWrites=true&w=majority", {useNewUrlParser: true})
  .then(() => {
    app.listen(3000, () => {
      console.log('serving port 3000');
    })
  })
  .catch((err)=> {
    console.log(err);
  });

