const search = document.getElementById("search");
const API_key = "888c6f6d1a152bfd3be977d295ab111f";

const hourForeCastData = {};
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
  hourlyForecast(city);
  updateWeather(finalData);
};

const updateWeather = (data) => {
  document.querySelector("h1").innerText = data.name;
  document.querySelector(".temp").innerHTML =
    Math.round(data.main.temp) + "&deg";
  document.querySelector('.bottom').innerHTML =  Math.round(data.main.temp) + "&deg";
  document.querySelector(".Info").innerText = data.weather[0].description;
  document.querySelector("#windspeed").innerText = data.wind.speed + " kmph";
  document.querySelector("#gust").innerText = data.wind.gust;
  document.querySelector("#dir").innerHTML = data.wind.deg + "&deg";

  UpdateIcon(data);
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
  console.log(values); 

  values.forEach((val) => {
    // accessing the array values
    if (Icons[weatherCondition]) {
      document.querySelector("#Icon-Now").className =
        "fa-solid " + Icons[weatherCondition];
    }
    console.log(val);// Prints the entire array
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

// To fill the HourForeCastData Object
const hourlyForecast = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`;

  const today = new Date();
  const date = today.getDate();
  console.log(date);

  const hourData = await fetch(url);
  const hourForecast = await hourData.json();
  console.log(hourForecast);

  const dataList = hourForecast.list;
  console.log(dataList);

  dataList.forEach((el) => {
    const temp = el.main.temp;
    const condition = el.weather[0].main;

    let date_unix = el.dt * 1000; // to ms (JS date) => Date from the list
    let dateobject = new Date(date_unix); // to get the date from the API'S data
    const DD = dateobject.getDate();
    const tmLab = dateobject.toLocaleTimeString([], {  // from date to time 
      hour: "numeric", 
      hour12: true, 
    });
    const timelabel = tmLab.replace(/\s/g, "");//remvoing space 
    console.log(DD);

    if (date == DD) {
      hourForeCastData[timelabel] = {
        temp: temp,
        icon: condition,
      };
    }
    
    const element = document.getElementById(timelabel);
    if(element){
          element.innerHTML = Math.round(hourForeCastData[timelabel].temp) + '&deg';
          
    }

  });

  console.log(hourForeCastData);

  
  const hourdatakeys = Object.keys(hourForeCastData);
  hourdatakeys.forEach((val) =>{
    console.log(val);
  });

  
};

// const weeklyForeCast = async (city) => {
//    const url = `https://api.openweathermap.org/data/2.5/weekforecast?q=${city}&appid=${API_key}&units=metric`;

//    const response = await fetch(url);
//    const weekData = response.json();
//    console.log(weekData);

// }


// 2AM
// script.js:139 5AM
// script.js:139 8AM
// script.js:139 11AM
// script.js:139 2PM
// script.js:139 5PM
// script.js:139 8PM
// script.js:139 11PM