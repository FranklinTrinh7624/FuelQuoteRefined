const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const userRoute = require("./routes/userRoutes");
const fuelRoute = require("./routes/fuelRoute");
const mongoose = require('mongoose');
//const jsonparser = bodyparser.json();
//import data from "./QuoteHistoryBackend.json"
//FOR UNIT TESTING PURPOSES

app.use(express.static(path.join(__dirname, '..','frontend','build')));
app.use(express.json()); //should be similar to app.use(bodyParser.json())
app.use(express.urlencoded({
    extended: true
}));


app.get('/', function (req, res) {
    //   res.sendFile(path.join(__dirname, 'build', 'index.js'));
       res.redirect('index.html')
});



app.use("/data/login", userRoute);
app.use("/data/fuelquote", fuelRoute);

// app.post('/data/clientprofile',(req,res)=>{
//     req.accepts('application/json');
//     console.log('post /data/clientprofile');
//     console.log(req.body);
//     res.sendStatus(200);
// })

// app.post('/data/registration',(req,res)=>{
//   req.accepts('application/json');
//   console.log('post /data/registration');
//   console.log(req.body);
//   res.sendStatus(200);
// })

// app.post('/data/login',(req,res)=>{
//   req.accepts('application/json');
//   console.log('post /data/login');
//   console.log(req.body);
//   res.sendStatus(200);
// })

// app.post('/data/fuelquote',(req,res)=>{
//   req.accepts('application/json');
//   console.log('post /data/fuelquote');
//   console.log(req.body);
//   res.sendStatus(200);
// })

// app.get('/data/FuelQuoteHistory', (req,res)=>{
//     res.send([
//       {
//         "id": 1,
//         "Date": "12/13/16",
//         "GallonsRequested": "50",
//         "DeliveryAddress": "1464 Flemming Dr",
//         "DeliveryDate": "12/15/16",
//         "SuggestedPrice": "60",
//         "TotalAmountDue": "61"
//       },
    
//       {
//         "id": 2,
//         "Date": "1/16/20",
//         "GallonsRequested": "22",
//         "DeliveryAddress": "1513 River Dr",
//         "DeliveryDate": "1/20/20",
//         "SuggestedPrice": "88",
//         "TotalAmountDue": "91"
//       }
//     ]);
// })

  
// app.listen(3000,()=>{
//   console.log('serving port 3000');
// });
mongoose.connect("mongodb+srv://DeadFallen:@cluster0.legd1.mongodb.net/FuelApplication?retryWrites=true&w=majority")
.then(()=> {
    let server = app.listen(3001);
    module.exports = server;
}) .catch ((err)=>{
    console.log(err);
});

module.exports = app;