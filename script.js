const search = document.getElementById("search");
const API_key = "888c6f6d1a152bfd3be977d295ab111f";

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
const levels = {
  1: "Good 🌿",
  2: "Fair 🌤️",
  3: "Moderate ",
  4: "Poor ",
  5: "Very Poor ",
};

search.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    let city = search.value;
    console.log(city);
    getweather(city);
  }
});

const getweather = async (city) => {
  try {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`;

    let data = await fetch(URL);
    console.log(data);

    let finalData = await data.json(); //into JSON format
    console.log(finalData);
    console.log(finalData.main.temp);

    const lat = finalData.coord.lat;
    const lon = finalData.coord.lon;

    getAQIndex(lat, lon);
    hourlyForecast(city);
    updateWeather(finalData);
  } catch (error) {
    alert("Invalid City Name !");
  }
};

const updateWeather = (data) => {
  document.querySelector("h1").innerText = data.name;
  document.querySelector(".temp").innerHTML =
    Math.round(data.main.temp) + "&deg";
  document.querySelector(".bottom").innerHTML =
    Math.round(data.main.temp) + "&deg";
  document.querySelector(".Info").innerText = data.weather[0].description;
  document.querySelector("#windspeed").innerText = data.wind.speed + " kmph";
  document.querySelector("#gust").innerText = data.wind.gust;
  document.querySelector("#dir").innerHTML = data.wind.deg + "&deg";

  UpdateIcon(data, "Now");
};

const UpdateIcon = (data, timelabel) => {
  const weatherCondition = data.weather[0].main;
  console.log(weatherCondition);

  const values = Object.keys(Icons); //Turns the object data vlaue's keywords into an array
  // console.log(values);

  const element = document.getElementById(`Icon-${timelabel}`);
  // accessing the array values
  if (Icons[weatherCondition] && element) {
    element.className = "fa-solid " + Icons[weatherCondition];
  }
};

// To fill the HourForeCastData Object
const hourlyForecast = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_key}&units=metric`;

  const hourForeCastData = {};
  const weeklyData = {};

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
    const tmLab = dateobject.toLocaleTimeString([], {
      // from date to time
      hour: "numeric",
      hour12: true,
    });
    const timelabel = tmLab.replace(/\s/g, ""); //remvoing space
    console.log(DD);

    if (date == DD || date + 1 == DD) {
      hourForeCastData[timelabel] = {
        temp: temp,
        icon: condition,
      };

      const element = document.getElementById(timelabel);
      if (element) {
        element.innerHTML =
          Math.round(hourForeCastData[timelabel].temp) + "&deg";
        UpdateIcon(el, timelabel);
      }
    }
  });

  //Weekly Forecast Data fill-up
  const weekList = hourForecast.list; // weekList => array of the list
  console.log(weekList);
  for (let i = 4; i <= weekList.length; i += 8) {
    //day extraction
    const dt = weekList[i].dt;
    const weekdate = new Date(dt * 1000);
    const day = weekdate.toLocaleDateString([], {
      weekday: "long",
    });
    console.log(day); //logs Current day value to the console

    const weekday_max_temp = weekList[i].main.temp_max;
    const weekday_min_temp = weekList[i].main.temp_min;
    const weatherCondition = weekList[i].weather[0].description;

    weeklyData[day] = {
      maxtemp: weekday_max_temp,
      mintemp: weekday_min_temp,
      condition: weatherCondition,
    };

    //updating the UI for week
    const weekelement = document.getElementById(day);
    if (weeklyData[day] && weekelement) {
      document.getElementById(`${day}-temp`).innerHTML =
        Math.round(weeklyData[day].maxtemp) +
        "°/" +
        Math.round(weeklyData[day].mintemp) +
        "°";
      document.getElementById(`${day}-condition`).innerHTML =
        weeklyData[day].condition;
      UpdateIcon(weekList[i], day);
    }
    console.log(weeklyData[day]);
  }
  console.log(weeklyData);
};

const getAQIndex = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_key}`;
  const response = await fetch(url);
  const AQIndex = await response.json();
  console.log(AQIndex);

  const aqi = AQIndex.list[0].main.aqi;
  document.getElementById("aqi").innerHTML = aqi;
  if (levels[aqi]) {
    document.querySelector("#aqilabel").innerHTML = levels[aqi];
  }

  UpdateProgressbar(aqi);
};

function UpdateProgressbar(val) {
  const slidebar = document.querySelector("#slider");
  slidebar.disable;
  slidebar.value = val;
}

const srchbr = document.getElementById("sbar");

srchbr.addEventListener("click", () => {
  srchbr.classList.toggle("active");
});

window.addEventListener("load", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
    async function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
      
        const city = await getcity(lat,lon);
        getweather(city);
        
      },
      function (error) {
        console.error("Error getting location:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  } else {
    alert("Geolocation is not supported by this browser");
    console.log("Geolocation is not supported by this browser.");
  }
});

const scroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    smartphone: {
    smooth: true
  },
  tablet: {
    smooth: true
  }
});

async function getcity(lat,lon) {
   const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

   let data = await fetch(url);
   let reponse = await data.json();
  // console.log(reponse);
  const CITY = reponse.address.city;
  return CITY;
  
}