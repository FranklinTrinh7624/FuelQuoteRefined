import "./FuelQuote.css";
import { StyleSheet, Text, View, TextInput } from "react-native";
import React, {
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from "react";
import DatePicker from "react-datepicker";
import { AuthContext } from "./authContext";
//import { AuthContext2 } from "./authContext2";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

export default function App() {
  const [date, setDate] = useState(new Date());
  const [expiration, setExpiration] = useState(date);
  const [gallonsRequeseted, setGallonsRequested] = useState("");
  const [getStuff, setGetStuff] = useState([]);
  const [address1, setAddress1] = useState("");
  const [gallon, setGallon] = useState("");
  const [ppg, setPpg] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  function submit(e) {
    e.preventDefault();
    //setExpiration(calculateExpirationDate());
    axios
      .post(
        "/data/fuelquote",
        {
          gallons: gallonsRequeseted,
          date: date,
          expiration: calculateExpirationDate(),
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          //console.log("error here");
        } else {
          alert("SAVED QUOTE");
        }
      });
  }

  // useEffect(()=>{
  //   axios.get('/data/fuelquote',{gallonsRequeseted, date},
  //   {
  //     headers: {
  //       accessToken: localStorage.getItem("accessToken"),
  //     },
  //   }).then((response)=>{ //create username variable and append to the end of fuelquote
  //     if(response.data.error) {
  //       alert("error here 2");
  //     } else {
  //       setGetStuff(response.data);
  //       setAddress1(response.data.address1);
  //       setGallon(response.data.gallons);
  //       setPpg(response.data.pricePerGallon);
  //       setTotalPrice(response.data.totalPrice);
  //       console.log(response.data);
  //     }
  //   })
  // },[])//look at the date to see which is greater for most accurate results
  let filtering;

  function getquote(e) {
    e.preventDefault();
    axios
      .get("/data/fuelquote", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          alert("error here 2");
        } else {
          setGetStuff(response.data);
          setAddress1(response.data.address1);
          setGallon(response.data.gallons);
          setPpg(response.data.pricePerGallon);
          setTotalPrice(response.data.totalPrice);
          console.log(response.data);
          // filtering = getStuff.filter(getStuffSet =>
          //   getStuffSet.gallons === gallonsRequeseted && getStuffSet.date === date);
        }
      });
  }

  // const filtering = getStuff.filter(getStuffSet =>
  //   getStuffSet.gallons === gallonsRequeseted && getStuffSet.date === date);

  function calculateExpirationDate() {
      let exp = new Date();
      exp.setDate(exp.getDate() + 7);
      //console.log("exp", exp);
      return exp;

      //console.log("expiration", expiration);
  }

  return (
    <div className="fuelQuote">
      <div className="form-wrapper">
        <h1>Fuel Quote Form</h1>

        <div className="gallonsRequested">
          <label>Gallons Requseted: </label>
          <input
            type="number"
            id="gallons-requested"
            name="gallonsrequested"
            maxLength={100}
            required
            onChange={(e) => setGallonsRequested(e.target.value)}
          ></input>
        </div>

        <Text>
          {"\n"}
          {"\n"}
          {"\n"}
        </Text>

        <div className="deliveryAddress">
          {" "}
          {/*need from profile */}
          <label>Delivery Address: </label>
          {/* {filtering.map((getSomething) => (
            <text>{getSomething.address}</text>
          ))} */}
          {getStuff
            .filter((getStuffSet) => getStuffSet.gallons == gallonsRequeseted)
            .map((getStuffFiltered) => (
              <text>{getStuffFiltered.address}</text>
            ))}
          {/* {getStuff.map((getStuffSet)=>(
            <text>{getStuffSet.address}</text>
          ))} */}
        </div>

        <Text>
          {"\n"}
          {"\n"}
          {"\n"}
        </Text>

        <DatePicker
          selected={date}
          onChange={(date) => {
            console.log("select date", date);
            setDate(date);
            //calculateExpirationDate();
            // let exp = new Date();

            // exp.setDate(exp.getDate() + 7);
            // console.log("exp", exp);
            //console.log("expiration", expiration);
          }}
        />

        {/* <div style={{
            margin: 'auto',
            display: 'block',
            width: 'fit-content'
          }}>
            <TextField id = "date" label = "Choose delivery date" type = "date" InputLabelProps = {{shrink:true,}} onChange={(date) => {
              console.log("select date", date);
              setDate(date);
              let exp = new Date();

              console.log("exp", exp);
              exp.setDate(exp.getDate() + 7);
              setExpiration(exp);
              console.log("expiration", expiration);
            }} />
          </div> */}

        <Text>
          {"\n"}
          {"\n"}
          {"\n"}
        </Text>

        <div className="gallonPrice">
          {" "}
          {/*need to recieve from quoteschema*/}
          <label>Price Per Gallon: </label>
          {/* {
            <text>{ppg}</text>
          } */}
          {getStuff
            .filter((getStuffSet) => getStuffSet.gallons == gallonsRequeseted)
            .map((getStuffFiltered) => (
              <text>{getStuffFiltered.pricePerGallon}</text>
            ))}
        </div>

        <Text>
          {"\n"}
          {"\n"}
          {"\n"}
        </Text>

        <div className="totalPrice">
          {" "}
          {/*need to recieve from quoteschema*/}
          <label>Total Price: </label>
          {/* {
            <text>{totalPrice}</text>
          } */}
          {getStuff
            .filter((getStuffSet) => getStuffSet.gallons == gallonsRequeseted)
            .map((getStuffFiltered) => (
              <text>{getStuffFiltered.totalPrice}</text>
            ))}
        </div>

        <Text>
          {"\n"}
          {"\n"}
          {"\n"}
        </Text>

        <button type="submit" id="save" onClick={submit}>
          Save
        </button>
        <button type="submit" id="getquote" onClick={getquote}>
          Get Quote
        </button>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 8,
    margin: 10,
  },
});
