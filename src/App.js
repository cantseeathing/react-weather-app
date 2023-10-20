import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = "a8a33ec79eaa1b91cc0678875cb2b1c7";
export default function App() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(() => new Date().getHours());
    }, 60000);
  }, []);

  function fetchData(city) {
    if (city.length === 0) {
      setResult(null);
    }
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((res) => {
        let geoLocation = res[0];
        if (geoLocation === undefined) {
          setResult(null);
          setIsLoading(false);
          setShowPopUp(true);
        } else {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${geoLocation?.lat}&lon=${geoLocation?.lon}&appid=${API_KEY}&units=metric`
          )
            .then((data) => data.json())
            .then((json) => console.log(setResult(json)));
        }
      });
  }

  function handleUserInput(value) {
    setUserInput(value);
  }

  function HandleWeatherData(city) {
    if (!city) return;
    setIsLoading(true);
    fetchData(city);
    setIsLoading(false);
  }
  return (
    <>
      {isLoading && <Loading />}
      <ErrorPopUp
        userInput={userInput}
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
      />
      <div
        className={currentHour >= 5 && currentHour <= 15 ? "app" : "app-dark"}
      >
        <div
          className={
            currentHour >= 5 && currentHour <= 15
              ? "app-container"
              : "app-container-dark"
          }
        >
          <p className="title">Weather App</p>
          <SearchBar
            userInput={userInput}
            handleUserInput={handleUserInput}
            HandleWeatherData={HandleWeatherData}
          />
          {result !== null && (
            <WeatherCard data={result} currentHour={currentHour} />
          )}
        </div>
      </div>
    </>
  );
}

function SearchBar({ userInput, handleUserInput, HandleWeatherData }) {
  return (
    <div className="search-bar">
      <input
        placeholder="Enter a city name here..."
        className="search-input"
        value={userInput}
        onChange={(e) => handleUserInput(e.target.value)}
      ></input>
      <button
        className="search-button"
        onClick={() => HandleWeatherData(userInput)}
      >
        Search!
      </button>
    </div>
  );
}

function WeatherCard({ data, currentHour }) {
  console.log("card: ", data);
  console.log("city: ", data.name);
  console.log("temp: ", data.main.temp);
  console.log("humidity: ", data.main.humidity);
  console.log("weather: ", data.weather.at(0));
  return (
    <div
      className={
        currentHour >= 5 && currentHour <= 15
          ? "weather-card"
          : "weather-card-dark"
      }
    >
      <p>{data?.name}</p>
      <img
        className="weather-status-img"
        src={
          "https://openweathermap.org/img/wn/" +
          data.weather.at(0).icon +
          ".png"
        }
        alt={data?.weather?.id}
      />
      <p>{data.main.temp} C</p>
      <p>{data.main.humidity}% Humidity</p>
    </div>
  );
}

function ErrorPopUp({ userInput, showPopUp, setShowPopUp }) {
  return (
    <>
      {showPopUp && (
        <div className="pop-up">
          <div className="pop-up-container">
            <p>Error!</p>
            <p>No city with the {userInput} name was found!</p>
            <button onClick={() => setShowPopUp(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

function Loading() {
  return (
    <div className="pop-up">
      <div className="loader"></div>
    </div>
  );
}
