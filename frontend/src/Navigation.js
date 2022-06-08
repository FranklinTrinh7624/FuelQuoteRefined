import React, {useState} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./authContext";

function Navigation() {
  const [authState, setAuthState] = useState(false);
  return (
    <nav>
      <ul className="nav-links">
        <AuthContext.Provider value={{authState, setAuthState}}>
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
          {!authState && (
            <>
              <Link to="/loginregistration">
                <li>Login/Registration</li>
              </Link>
            </>
          )}
        </AuthContext.Provider>
      </ul>
    </nav>
  );
}

export default Navigation;
