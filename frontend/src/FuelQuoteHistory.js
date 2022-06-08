import React, { useState, useMemo } from "react";
import "./FuelQuoteHistory.css";
import axios from "axios";

function FuelQuoteHistory() {
  const [history, setHistory] = useState([]);
  
  useMemo(()=>{
    axios.get('/data/fuelquote', {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response)=>{
      if(response.data.error) {
        alert("error here history");
      } else {
        setHistory(response.data)
        console.log(response)
      }
    })
  },[])
  //change to schema stuff
  return (
    <div className="FuelQuoteHisotry">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Gallons Requested</th>
            <th>Delivery Address</th>
            
            <th>Suggested Price</th>
            <th>Total Amount Due</th>
          </tr>
        </thead>
        <tbody>
          {history.map((historySet) => (
            <tr>
              <td>{historySet.date}</td> 
              <td>{historySet.gallons}</td>
              <td>{historySet.address}</td>
              
              <td>{historySet.pricePerGallon}</td>
              <td>{historySet.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FuelQuoteHistory;
