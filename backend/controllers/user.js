const {validationResult, check} = require("express-validator");
const UserSchema = require('../models/userSchema');
const profileSchema = require('../models/userInfoSchema');
const bcrypt = require('bcrypt');

//https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/

const testAccount = [{userName: "testuser", passWord: "testpass"}];

const testProfile = [{id: 1, first: "testfirst", last: "testlast", addr1: "111 test st", addr2:"222 test st" , city:"Houston",state:"TX",zipcode:"77777"}]
const testProfile2 = [{idd:"1", firstn: "proffirst", lastn: "proflast", addrr1: "N/A", addrr2: "N/A", cityy:"N/A", statee:"N/A", zipcodee:"N/A"}]

// function findUser(userArr, user) {
//     if(userArr.find(use=> use.userName === user)) {
//         return true;
//     }
//     return false;
// }

// function findPassword(passArr, passs) {
//     if(passArr.find(pass=>pass.passWord === passs)) {
//         return true;
//     }
//     return false;
// }

exports.validate = (method) => {
    switch(method) {
        case 'createUser': {
            return [
            check(["userName"]).exists(),
            check(["passWord"]).exists()
            ]
        }
        case 'loginUser': {
            return [
            check(["userName"]).exists(),
            check(["passWord"]).exists()
            ]
        }
        case 'fillProfile': {
            return [
            check(["firstn"]).exists(),
            check(["lastn"]).exists()
            ]
        }
    }
}


const gatherAllLogin = (res)=> {
    res.json({acc: testAccount});
};

const getID = async (req, res)=>{
    // const accID = req.params.idd;
    // const temp = testProfile2.findIndex(i => i.idd === accID);
    // if(testProfile2[temp].idd === accID)
    // {
    //     res.json({message: "done"});
    // }
    const acc = req.param.userName;
    let findAcc;
    try {
        findAcc = await UserSchema.findOne({username: acc});
    } catch (err) {
        res.status(500).json({errors:errors.array()});
    }
    if(!findAcc) {
        res.status(404).json({errors:errors.array()});
    }
    res.json({message: "Found"});
    //res.status(404).json({errors:errors.array()});
}

const login = async (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({errors: errors.array() });
        return;
    }

    const {userName, passWord} = req.body;

    //const foundUser = findUser(testAccount, userName);
    //const foundPassword = findPassword(testAccount, passWord);

    // if(!foundUser || !foundPassword) {
    //     res.status(401).json({errors:errors.array()});
    //     return;
    // }

    //testProfile.isLoggedin = true;
    let existing;
    try {
        existing = await UserSchema.findOne({username: userName});
        
        if(!existing) {
            res.status(401).json({errors:errors.array()});
            return;
        }
    } catch (err) {
        res.status(500).json({errors:errors.array()});
        return;
    }
    //const dbPassword = existing.password;
    let isMatch;
    try {
        isMatch = await bcrypt.compare(passWord, existing.password);
    } catch(err) {
        res.status(500).json({errors:errors.array()});
        return;
    }
    if(!isMatch) {
        res.status(401).json({errors:errors.array()});
        return;
    }

    res.json({message: "You've logged in"});
};

const registration = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({errors: errors.array() });
        return;
    }
    
    const {userName, passWord} = req.body;
    if(userName.length < 8) {
        return res.status(400).json({errors: errors.array()});
      } 
    else if(passWord.length < 8) {
        return res.status(400).json({errors:  errors.array()});
      }
    let hashpass;
    try {
        hashpass = await bcrypt.hash(passWord,10);
        const newAcc = new UserSchema({
            username: userName,
            password: hashpass
        });
        newAcc.save();
    } catch (err) {
        response.status(500).json({errors: errors.array()});
    }
    //const createUser = {userName:userName, passWord:passWord};

    //const accInfo = {id:2, first: "", last: "", addr1: "", addr2: "", city:"", state:"", zipcode:""}

    //testAccount.push(createUser);
    //testProfile.push(accInfo);
    res.status(201).json({message:"Created Account"});


};

const fillProfileForm = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({errors: errors.array() });
        return;
    }
    const {userName, firstn, lastn, addrr1, addrr2, cityy, statee, zipcodee} = req.body;
    
    //const index = testProfile2.findIndex(i => i.idd === idd);
    if(firstn.length > 25) {
        res.status(400).json({errors: errors.array() });
        return;
    }
    if(lastn.length > 25) {
        res.status(400).json({errors: errors.array() });
        return;
    }
    if(addrr1.length > 100) {
        res.status(400).json({errors: errors.array() });
        return;
    }
    if(addrr2.length > 100) {
        res.status(400).json({errors: errors.array() });
        return;
    }
    if(cityy.length > 100) {
        res.status(400).json({errors: errors.array() });
        return;
    }
    if(zipcodee.length > 9) {
        res.status(400).json({errors: errors.array() });
        return;
    }
    // testProfile2[index].firstn = firstn;
    // testProfile2[index].lastn = lastn;
    // testProfile2[index].addrr1 = addrr1;
    // testProfile2[index].addrr2 = addrr2;
    // testProfile2[index].cityy = cityy;
    // testProfile2[index].statee = statee;
    // testProfile2[index].zipcodee = zipcodee;
    let findProfile;
    try {
        findProfile = await UserSchema.findOne({username: userName});
    } catch(err) {
        res.status(404).json({errors: errors.array() });
    }

    const makeProfile = new profileSchema ({
        username: userName,
        firstname: firstn,
        lastname: lastn,
        address1: addrr1,
        address2: addrr2,
        city: cityy,
        state: statee,
        zipcode: zipcodee,
    });
    try {
        await makeProfile.save();
    } catch( err) {
        res.status(500).json({errors: errors.array() });
    }
    res.status(200).json({message: "updated"});
    
}


exports.gatherAllLogin = gatherAllLogin;
exports.login = login;
exports.registration = registration;
exports.getID = getID;
exports.fillProfileForm = fillProfileForm;