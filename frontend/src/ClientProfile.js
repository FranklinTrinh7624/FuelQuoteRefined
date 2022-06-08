import React, { useState } from "react";
import "./ClientProfile.css";
import LoginRegistration, { logUser } from "./LoginRegistration";
import axios from "axios";
function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setStates] = useState("");
  const [zipcode, setZipcode] = useState("");

  const [updateProfile, setUpdateProfile] = useState("");
  const [profileList, setProfileList] = useState([]);

  function submit(e) {
    e.preventDefault();
    //const data = {firstname: firstName, lastname: lastName, address1: address1, address2: address2, city:city, state: state, zipcode: zipcode};
    axios.post("/data/clientprofile", {
      //username: logUser,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zipcode,
      //data,
    },
    {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response)=>{
      if(response.data.error) {
        console.log(response.data.error);
        alert("User not logged on");
      } 
      else if (response.data.errors){
        alert(response.data.errors);
      }
      else if (response.data.msg){
        alert("A profile exists, update instead");
      } else {
        alert("SAVED");
      }
    });
  }

  function updates(e) {
    e.preventDefault();
    axios.patch("/data/clientprofile", {
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zipcode,
    },
    {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response)=>{
      if(response.data.error) {
        console.log(response.data.error);
        alert("User not logged on");
      }
      else if(response.data.errors) {
        alert(response.data.errors);
      } 
      else if(response.data.errormsg) {
        alert(response.data.errormsg);
      } else {
        alert("UPDATED");
      }
    });
  }


  return (
    <div className="clientProfile">
      <div className="form-wrapper">
        <h1>Client Profile Form</h1>
        <form>
          <div className="firstName">
            <label>First Name: </label>
            <input
              type="text"
              id="first-name"
              name="firstname"
              maxLength={25}
              required
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
          </div>

          <div className="lastName">
            <label>Last Name: </label>
            <input
              type="text"
              id="last-name"
              name="lastname"
              maxLength={25}
              required
              onChange={(e) => setLastName(e.target.value)}
            ></input>
          </div>

          <div className="firstAddress">
            <label>Address 1: </label>
            <input
              type="text"
              id="addr-1"
              name="addr1"
              maxLength={100}
              required
              onChange={(e) => setAddress1(e.target.value)}
            ></input>
          </div>
          <div className="secondAddress">
            <label>Address 2: </label>
            <input
              type="text"
              id="addr-2"
              name="addr2"
              maxLength={100}
              onChange={(e) => setAddress2(e.target.value)}
            ></input>
          </div>
          <div className="city">
            <label>City: </label>
            <input
              type="text"
              id="city"
              name="City"
              maxLength={100}
              required
              onChange={(e) => setCity(e.target.value)}
            ></input>
          </div>

          <div className="State">
            <label>State: </label>
            <select
              id="states"
              name="States"
              required
              onChange={(e) => setStates(e.target.value)}
            >
              <option disabled selected value>
                Choose a State
              </option>
              <option value="Alabama"> Alabama(AL)</option>
              <option value="Alaska"> Alaska(AK) </option>
              <option value="Arizona"> Arizona(AZ)</option>
              <option value="Arkansas"> Arkansas(AR)</option>
              <option value="California"> California(CA)</option>
              <option value="Colorado"> Colorado(CO)</option>
              <option value="Connecticut"> Connecticut(CT)</option>
              <option value="Delaware"> Delaware(DE)</option>
              <option value="Florida"> Florida(FL)</option>
              <option value="Georgia"> Georgia(GA)</option>
              <option value="Hawaii"> Hawaii(HI)</option>
              <option value="Idaho"> Idaho(ID)</option>
              <option value="Illinois"> Illinois(IL)</option>
              <option value="Indiana"> Indiana(IN)</option>
              <option value="Iowa"> Iowa(IA)</option>
              <option value="Kansas"> Kansas(KS)</option>
              <option value="Kentuckey"> Kentuckey(KY)</option>
              <option value="Louisiana"> Louisiana(LA)</option>
              <option value="Maine"> Maine(ME)</option>
              <option value="Maryland"> Maryland(MD)</option>
              <option value="Massachusetts"> Massachusetts(MA)</option>
              <option value="Michigan"> Michigan(MI)</option>
              <option value="Minnesota"> Minnesota(MN)</option>
              <option value="Mississippi"> Mississippi(MS)</option>
              <option value="Missouri"> Missouri(MO)</option>
              <option value="Montana"> Montana(MT)</option>
              <option value="Nebraska"> Nebraska(NE)</option>
              <option value="Nevada"> Nevada(NV)</option>
              <option value="New Hampshire"> New Hampshire(NH)</option>
              <option value="New Jersey"> New Jersey(NJ)</option>
              <option value="New Mexico"> New Mexico(NM)</option>
              <option value="New York"> New York(NY)</option>
              <option value="North Carolina"> North Carolina(NC)</option>
              <option value="North Dakota"> North Dakota(ND)</option>
              <option value="Ohio"> Ohio(OH)</option>
              <option value="Oklahoma"> Oklahoma(OK)</option>
              <option value="Oregon"> Oregon(OR)</option>
              <option value="Pennsylvania"> Pennsylvania(PA)</option>
              <option value="Rhode Island"> Rhode Island(RI)</option>
              <option value="South Carolina"> South Carolina(SC)</option>
              <option value="South Dakota"> South Dakota(SD)</option>
              <option value="Tennessee"> Tennessee(TN)</option>
              <option value="Texas"> Texas(TX)</option>
              <option value="Utah"> Utah(UT)</option>
              <option value="Vermont"> Vermont(VT)</option>
              <option value="Virginia"> Virginia(VA)</option>
              <option value="Washington"> Washington(WA)</option>
              <option value="West Virginia"> West Virginia(WV)</option>
              <option value="Wisconsin"> Wisconsin(WI)</option>
              <option value="Wyoming"> Wyoming(WY)</option>
            </select>
          </div>

          <div className="zipcode">
            <label>Zipcode: </label>
            <input
              inputMode="numeric"
              type="text"
              id="zipcode"
              name="Zipcode"
              maxLength={9}
              minLength={5}
              required
              onChange={(e) => setZipcode(e.target.value)}
            ></input>
          </div>
          <button type="submit" id="save" onClick={submit}>
            Create
          </button>
          
          <button type="submit" id="update" onClick={updates}>
            Update Info
          </button>
        </form>
      </div>
    </div>
  );
}
export default Profile;
