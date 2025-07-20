# 🌤️ SkyCast – Weather Forecast App

[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()

## 🔗 Live Demo
 [Click here to try SkyCast](https://weather-icq3jz6k1-usman-gani-s-projects.vercel.app)

> Hosted on **vercel** | Geolocation Support |  Dynamic Background Videos | Smart City Suggestions | 

---

##  Preview

![Screenshot](Assets/image.png)

---

##  Features

-  Real-Time Weather with Dynamic UI
-  Hourly Forecast with Weather Icons
-  Weekly Forecast (Aggregated from 3-Hour Data)
-  Air Quality Index (AQI) with Visual Slider
-  Weather-Based Background Video Transitions
-  Smart Autocomplete for City Names
-  Geolocation Detection on Load
-  Liquid Glass
-  Intro Animation & Smooth Scrolling (GSAP + Locomotive)
-  Fully Responsive and Mobile Friendly


## ⚙️ How It Works

### 🧱 Architecture

```ascii
+------------------------+
|   User Input / Geo     |
+-----------+------------+
            |
            ▼
+----------------------------+
|  OpenWeather API Endpoints |
+-----------+----------------+
            |
            ▼
+-----------------------------+
|     Data Processing Layer   |
|  - Hourly Forecast Parser   |
|  - Weekly Aggregator        |
|  - AQI Formatter            |
+-------------+---------------+
              |
              ▼
+------------------------------+
|     UI Rendering Engine      |
|  - DOM Updates               |
|  - Background Video Swap     |
|  - Suggestion Dropdown       |
+------------------------------+
````

---

## 🔄 Data Flow

```
User Input / Geolocation
        │
        ▼
 getweather(city)
        │
        ├─► updateWeather(data)
        │       └─► DOM update: city, temp, wind, condition
        │
        ├─► UpdateIcon(data, "Now")
        │
        ├─► updateBgVideo(condition)
        │
        ├─► getAQIndex(lat, lon)
        │       └─► AQI Value + Emoji + Slider
        │
        └─► hourlyForecast(city)
                ├─► hourlyForecastData = { "2PM": {...}, ... }
                └─► weeklyData = { Monday: {...}, ... }
```

---

##  Core Function Breakdown

### 🔹 `getweather(city)`

* Fetches current weather
* Extracts lat/lon
* Triggers:

  * `updateWeather()`
  * `getAQIndex()`
  * `hourlyForecast()`

### 🔹 `updateWeather(data)`

* Updates city name, temp, wind, condition in DOM
* Calls:

  * `UpdateIcon()`
  * `updateBgVideo()`

### 🔹 `UpdateIcon(data, timelabel)`

* Maps weather condition to FontAwesome icon:

```js
Icons = {
  Clear: "fa-sun",
  Rain: "fa-cloud-showers-heavy",
  Clouds: "fa-cloud",
  ...
};
```

### 🔹 `getAQIndex(lat, lon)`

* Fetches AQI from `/air_pollution` endpoint
* Maps 1–5 to health levels:

```js
levels = {
  1: "Good 🌿", 2: "Fair 🌤️", 3: "Moderate", ...
};
```

* Updates emoji label and progress slider

### 🔹 `hourlyForecast(city)`

* Loops over 3-hour forecast
* Converts timestamps to readable hours (e.g. "2PM")
* Stores into:

```js
hourForeCastData = {
  "2PM": { temp, icon },
  ...
};
```

### 🔹 Weekly Forecast Logic

* Selects every 8th item (\~24hr)
* Parses into weekday name via `.toLocaleDateString({ weekday })`

```js
weeklyData = {
  Monday: { maxtemp, mintemp, condition },
  ...
};
```

* Updates UI elements: `#Monday-temp`, `#Monday-condition`

### 🔹 `updateBgVideo(condition)`

* Maps condition to video files:

```js
const videoList = {
  Clear: "sunny.mp4",
  Rain: "rain.mp4",
  Clouds: "cloudy.mp4",
  Snow: "snow.mp4",
  ...
};
```

* Swaps video background smartly



## 📂 Data Structures

### ⏱ Hourly Forecast

```js
hourForeCastData = {
  "2PM": { temp: 34, icon: "Clouds" },
  "5PM": { temp: 32, icon: "Rain" },
};
```

### 📅 Weekly Forecast

```js
weeklyData = {
  Monday:  { maxtemp: 34, mintemp: 26, condition: "clear sky" },
  Tuesday: { ... }
}
```

---

## 🌐 API Endpoints Used

| Type              | Endpoint                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------- |
| Current Weather   | `https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_key}`                  |
| 3-Hour Forecast   | `https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_key}`                 |
| Air Quality Index | `https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_key}` |
| Reverse Geocoding | `https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&appid={API_key}`        |
| City Suggestions  | `https://api.openweathermap.org/geo/1.0/direct?q={query}&limit=5&appid={API_key}`           |


##  Key Functionalities

###  Geolocation Fetch

```js
navigator.geolocation.getCurrentPosition((pos) => {
  const { latitude, longitude } = pos.coords;
  getcity(latitude, longitude);
});
```

###  Hourly Forecast Extraction

```js
dataList.forEach((el) => {
  const date = new Date(el.dt * 1000);
  const time = date.toLocaleTimeString([], { hour: "numeric", hour12: true }).replace(/\s/g, "");
  hourForeCastData[time] = {
    temp: el.main.temp,
    icon: el.weather[0].main
  };
});
```

###  Weekly Aggregation Logic

```js
for (let i = 4; i <= weekList.length; i += 8) {
  const date = new Date(weekList[i].dt * 1000);
  const day = date.toLocaleDateString([], { weekday: "long" });
  weeklyData[day] = {
    maxtemp: weekList[i].main.temp_max,
    mintemp: weekList[i].main.temp_min,
    condition: weekList[i].weather[0].description,
  };
}
```

###  City Suggestion (Debounced)

```js
setTimeout(() => getSuggestions(city), 1500);
```

###  Background Video Handler

```js
const weatherVideo = videoList[condition] || "default.mp4";
if (!video.src.includes(weatherVideo)) {
  video.src = weatherVideo;
  video.load();
  video.play();
}
```

---

##  UI Enhancements

*  Liquid Glass Weekly Cards
*  AQI Slider Bar
*  Smart Autocomplete Dropdown
* Animated Intro (GSAP)
*  Mobile-First Layout
*  Error Feedback for Invalid City

---

##  Local Setup

```bash
git clone https://github.com/Usman0226/Weather-App.git

```

>  Insert your OpenWeather API key inside `script.js` as:

```js
const API_key = "your-api-key";
```

## 🌐 Hosting

App is hosted via **vercel**

##  Credits

*  [OpenWeatherMap](https://openweathermap.org/)
* 🌀[Locomotive Scroll](https://github.com/locomotivemtl/locomotive-scroll)
*  [GSAP](https://greensock.com/gsap/)
*  Videos: [Pexels](https://pexels.com) & [Coverr](https://coverr.co)