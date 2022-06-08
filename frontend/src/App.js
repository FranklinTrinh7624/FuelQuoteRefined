import React, {useState, useEffect} from "react";
import "./App.css";
import { Text } from "react-native";

import { AuthContext } from "./authContext";
//import { AuthContext2 } from "./authContext2";
import Navigation from "./Navigation";
import ClientProfile from "./ClientProfile";
import FuelQuote from "./FuelQuote";
import LoginRegistration from "./LoginRegistration";
import FuelQuoteHistory from "./FuelQuoteHistory";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

export default function App() {
  const [authState, setAuthState] = useState({
    username: "",
    status: false,
  });

  const [user, setUser] = useState("");


  useEffect(() => {
    axios.get('/data/login/auth', {headers: {
      accessToken: localStorage.getItem("accessToken"),},
    }).then((response) => {
      if(response.data.error) {
        setAuthState({...authState, status: false});
      } else {
        setAuthState({
          username: response.data.username,
          status: true,
        });
      }
    });
    // if(localStorage.getItem('accessToken')) {
    //   setAuthState(true);
    // }
    
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({username:"", status: false});
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
          <BrowserRouter>
            {/* <Navigation /> */}
            <nav>
              <div className="nav-links">
                  <Link to="/">
                    <li>Home</li>
                  </Link>
                  <Link to="/clientprofile">
                    <li>Client Profile</li>
                  </Link>
                  <Link to="/fuelquote">
                    <li>Fuel Quote</li>
                  </Link>
                  <Link to="/fuelquotehistory">
                    <li>Fuel Quote History</li>
                  </Link>
                  {!authState.status ? (
                    <>
                      <Link to="/loginregistration">
                        <li>Login/Registration</li>
                      </Link>
                    </>
                  ) : (
                    <button onClick={logout}>Logout</button>
                  )}
                  <h1>{authState.username}</h1>
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/clientprofile" element={<ClientProfile />} />
              <Route path="/fuelquote" element={<FuelQuote />} />
              <Route path="/loginregistration" element={<LoginRegistration />} />
              <Route path="/fuelquotehistory" element={<FuelQuoteHistory />} />
            </Routes>
          </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

const Home = () => (
  <div>
    <h1>Home Page </h1>
    <h4>Hello welcome to our website.</h4>
    <h4>
      Please login or register first and then select whatever option you need at
      the top of the page.
    </h4>
  </div>
);
