import React, { useEffect, useState } from "react";
import icon from './input/logo.png'
import Axios from "axios"; 
import "./App.css";

const getAirQualityDescription = (p) => {
  if (p === 1) {
    return "Good";
  } else if (p === 2) {
    return "Fair";
  } else if (p === 3) {
    return "Moderate";
  } else if (p === 4) {
    return "Poor";
  } else if (p === 5) {
    return "Very Poor";
  } else {
    return "Unknown";
  }
};

const CityInput = () => {
  const [city, setCity] = useState("AYODHYA");
  const [unit, setUnit] = useState("metric");
  const [iweather, SetWeather] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState(null);
  const [aqiv, setAqi] = useState(null);

  function handleUnit() {
    setUnit(unit === "metric" ? "imperial" : "metric");
  }

  useEffect(() => {
    // changing the maindata of openweather api

    const maindata = async () => {
      console.log("first");

      try {
        const apik = process.env.REACT_APP_API_KEY;
        const API_CALL = `https://api.openweathermap.org/data/2.5/weather`;
        const res2 = await Axios.get(
          `${API_CALL}?appid=${apik}&q=${city}&units=${unit}`
        );

        SetWeather(res2.data);

        const API_CALL_AQI =
          "https://api.openweathermap.org/data/2.5/air_pollution";
        // always  use https not http as security check might fail
        let lati = iweather?.coord?.lat;
        let longi = iweather?.coord?.lon;
        console.log(lati);
        console.log(longi);
        if (lati !== undefined && longi !== undefined) {
          try {
            const res = await Axios.get(
              `${API_CALL_AQI}?lat=${lati}&lon=${longi}&appid=${apik}`
            );
            setAqi(res.data);
          } catch (error) {
            console.log("openweather aqi server error : ", error);
          }
        }
      } catch (error) {
        console.log("openweather weather data server error : ", error.response);
        setCity("Enter Correct City Name");
      }
    };

    // changing the maindata of the Unsplash api
    const Unsplash = async () => {
      try {
        const Cid = process.env.REACT_APP_UNSPLASH_A_KEY;
        const U_CALL = "https://api.unsplash.com/search/photos?";
        await Axios.get(`${U_CALL}&query=${city}&client_id=${Cid}`).then(
          (r) => {
            setImage(r.data.results[0].urls.regular);
          }
        );
      } catch (error) {
        console.log("server error", error.response);
        setImage(
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhlZ8DBN69jQASKnxARneFIQwdmxFjSKnpDw&usqp=CAU"
        );
      }
    };
    Unsplash();
    maindata();
  }, [city, iweather?.coord?.lat, iweather?.coord?.lon, unit]);

  function handleSubmit() {
    setCity(
      inputValue.trim() === ""
        ? "AYODHYA"
        : inputValue.trim().toLocaleUpperCase()
    );
    setInputValue(""); // Update 'city' state with the current input value
  }

  function handleInputChange(e) {
    setInputValue(e.target.value);
  }

  const { weather, main, wind, clouds } = iweather;

  //  RETURN FUNCTION

  return (
    <div>
      <div className="inputdiv">
        <img src={icon} className="logo slideRight" alt="Check Your Internet" />
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          className="input_place slideRight"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter City"
        ></input>
        <button
          className="search_butt slideRight"
          onClick={handleSubmit}
          type="submit"
        >
          Search
        </button>
      </div>
      <section className="part2 slide-in-section">
        <div className="mini">
          <h1 className="cityname">{city}</h1>
          <div className="WeatherDetails">
            {/* Weather */}
            <div className="Weather one">
              <main>
                <h2>Weather feels like : {weather && weather[0]?.main}</h2>
                <img
                  src={`https://openweathermap.org/img/wn/${
                    weather && weather[0]?.icon
                  }@2x.png`}
                  style={{
                    backgroundColor: "black",
                    borderRadius: "50%",
                    minWidth: "100px",
                    minHeight: "100px",
                  }}
                  alt={`Icon error`}
                />
                <h2>Description : {weather && weather[0]?.description}</h2>
              </main>
            </div>
            {/* temparature */}
            <div className="Temparature one">
              <main>
                <h2>
                  Temparature : {main?.temp}
                  <span onClick={handleUnit} style={{ fontSize: "20px" }}>
                    {" "}
                    {unit === "metric" ? "°C" : "°F"}
                  </span>
                </h2>
                <h2>
                  Minimum Temparature : {main?.temp_min}
                  <span onClick={handleUnit} style={{ fontSize: "20px" }}>
                    {" "}
                    {unit === "metric" ? "°C" : "°F"}
                  </span>
                </h2>
                <h2>
                  Maximum Temparature : {main?.temp_max}
                  <span onClick={handleUnit} style={{ fontSize: "20px" }}>
                    {" "}
                    {unit === "metric" ? "°C" : "°F"}
                  </span>
                </h2>
                <h2>
                  Height From Sea Level : {main?.sea_level}
                  <span onClick={handleUnit} style={{ fontSize: "20px" }}>
                    {" "}
                    {"Meters"}
                  </span>
                </h2>
              </main>
            </div>
            {/* wind n pressure */}
            <div className="WindNPressure one">
              <main>
                <h2>
                  Wind Speed : {wind?.speed}
                  <span onClick={handleUnit} style={{ fontSize: "20px" }}>
                    {" "}
                    {unit === "metric" ? "m/s" : "mph"}
                  </span>
                </h2>
                <h2>
                  Humidity Percentage : {main?.humidity}
                  <span style={{ fontSize: "20px" }}>%</span>
                </h2>

                <h2>
                  Pressure : {main?.pressure}
                  <span style={{ fontSize: "20px" }}> {"hPa"}</span>
                </h2>
                <h2>Percentage of Sky with clouds : {clouds?.all}</h2>
              </main>
            </div>
            {/* clouds */}
            <div className="Aqi one">
              <main>
                <h2>Air Quality Index : {aqiv?.list[0].main.aqi}</h2>
                <h2>
                  Ammonia : {aqiv?.list[0].components.nh3}
                  <span style={{ fontSize: "20px" }}> {"μg/m3"}</span>
                </h2>
                <h2>
                  Ozone : {aqiv?.list[0].components.o3}
                  <span style={{ fontSize: "20px" }}> {"μg/m3"}</span>
                </h2>
                <h2>
                  Carbon-Mono-Oxide : {aqiv?.list[0].components.co}
                  <span style={{ fontSize: "20px" }}> {"μg/m3"}</span>
                </h2>
                <h2>
                  Air Quality :{" "}
                  {getAirQualityDescription(aqiv?.list[0].main.aqi)}
                </h2>
              </main>
            </div>
          </div>
        </div>
      </section>
      {/* image */}
      <div>
        <img
          src={image}
          alt="Error 404"
         className="cityImg"
        />
        {/* footer */}
        <div className="footer">
          <footer style={{ margin: "80px 0" }}>
            Copyright @ ABHINAV P SINGH 2022
          </footer>
        </div>
      </div>
    </div>
  );
};
export default CityInput;
