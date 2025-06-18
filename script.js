const search = document.getElementById("search");
const API_key = "888c6f6d1a152bfd3be977d295ab111f";

search.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    let city = search.value;
    console.log(city);
    getweather(city);
  }
});

const getweather = async (city) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`;

  let data = await fetch(URL);
  console.log(data);

  let finalData = await data.json(); //into JSON format
  console.log(finalData);
  console.log(finalData.main.temp);
  updateWeather(finalData);
  hourlyForecast(city);
};

const updateWeather = (data) => {
  document.querySelector("h1").innerText = data.name;
  document.querySelector(".temp").innerHTML =
    Math.round(data.main.temp) + "&deg";
  document.querySelector(".Info").innerText = data.weather[0].description;

  UpdateIcon(data);
};

const Icons = {
  Clear: "fa-sun",
  Clouds: "fa-cloud",
  Rain: "fa-cloud-showers-heavy",
  Thunderstorm: "fa-bolt",
  Drizzle: "fa-cloud-rain",
  Snow: "fa-snowflake",
  Mist: "fa-smog",
  Smoke: "fa-smog",
  Haze: "fa-smog",
  Dust: "fa-smog",
  Fog: "fa-smog",
  Sand: "fa-smog",
  Ash: "fa-smog",
  Squall: "fa-wind",
  Tornado: "fa-poo-storm",
};

const UpdateIcon = (data) => {
  const date = new Date();
  const timelabel = date.toLocaleTimeString([], {
    hour: "numeric",
    hour12: true,
  });
  const tmLab = timelabel.replace(/\s/g, ""); // removing the space
  console.log(tmLab);

  const weatherCondition = data.weather[0].main;
  console.log(weatherCondition);

  const values = Object.keys(Icons); //Turns the object data vlaue's keywords into an array
  console.log(values); // Prints the entire array

  values.forEach((val) => {
    // accessing the array values
    if (weatherCondition === val) {
      document.querySelector("#Icon-Now").className =
        "fa-solid " + Icons[weatherCondition];
    }
    console.log(val);
  });

  //   const check = Icons[weatherCondition];
  //   if (Icons[weatherCondition]) {
  //     document.querySelector("#Icon-Now").className =
  //       "fa-solid " + Icons[weatherCondition];
  //   }
};

// const values = Object.keys(Icons); //Turns the object data vlaues keywords into an array
// console.log(values); // Prints the entire array

// values.forEach((val) => {
//   // accessing the array values
//   if (weatherCondition == val) {
//     document.querySelector("#Icon-Now").className =
//       "fa-solid " + Icons[weatherCondition];
//   }
//   console.log(val);
// });


const hourlyForecast = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`;
    
    const hourData = await fetch(url);
    
    let hourForecast = await hourData.json();
    console.log(hourForecast);
}