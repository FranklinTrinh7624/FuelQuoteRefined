import React, { useState, useContext } from "react";
import "./LoginRegistration.css";
import {useNavigate} from "react-router-dom";
import { AuthContext } from "./authContext"; 
import axios from "axios";

function LoginRegistration() {
  const [userRegister, setUserRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [logUser, setLogUser] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const {setAuthState} = useContext(AuthContext);

  let history = useNavigate();

  function submitRegistration(e){
    e.preventDefault();
    axios.post('/data/registration',{
      userRegister, passwordRegister,})
      .then((response)=>{
        console.log(response);
        if(response.data.error1){
          alert(response.data.error1);
        } else if (response.data.error2){
          alert(response.data.error2);
        } else {
          alert("registration successful");
        }
      });

    }

  function submitLogin(e){
    e.preventDefault();
    //const data = {username: logUser, password: logPassword};
    axios.post('/data/login',{logUser, logPassword})
      .then((response)=>{
        if(response.data.error){
          alert(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({username: response.data.username, status: true});
          history("/");
        }
      });
    }
  return (
    <div>
      <h1>Login/Registration</h1>
      <div className="LoginRegiApp">
        <form className="login">
          <label>Login</label>
          <div className="logUsername">
            <input type="text" placeholder="Username here" onChange={(e)=>{setLogUser(e.target.value)}}/>
          </div>

          <div className="logPassword">
            <input type="password" placeholder="Password here" onChange={(e)=>{setLogPassword(e.target.value)}}/>
          </div>
          <button className="submit" type="submit" onClick={submitLogin}> Login </button>
        </form>

        <form className="register">
          <label> Registration </label>
          <div className="regiUser">
            <input type="text" id="user" name="userReg"placeholder="Create Username" minLength={8} pattern = ".{8,}" required title="8 characters minimum"
            onChange={(e)=> {setUserRegister(e.target.value)}} />
          </div>

          <div className="regiPass">
            <input type="password" id="pw" name="passReg"placeholder="Create Password" minLength={8} pattern = ".{8,}" required title="8 characters minimum"
            onChange={(e)=> {setPasswordRegister(e.target.value)}} />
          </div>
          <button className="submit" type="submit" onClick={submitRegistration}> Register </button>
        </form>
      </div>
    </div>
  );
}

export default LoginRegistration;