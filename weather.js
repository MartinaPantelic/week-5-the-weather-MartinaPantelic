//    Declaring DOM elements:

const getWeather = document.getElementById("search"),
    userInput = document.getElementById("user-input"),
    error = document.getElementById("error"),
    result = document.getElementById("results"),
    resultTable = document.getElementById("result-table"),
    closeButtons = document.getElementsByClassName("close");


// FUNCTIONS

// fade-in-out

const pairCloseButtons = elements => {
    for (let each of elements) {
        each.onclick = function () {
            this.parentElement.classList.remove("fade-in");
            this.parentElement.classList.add("fade-out");
            // we want our error div to no longer take up space
            const displayNone = () => {
                this.parentElement.style.display = "none";
            };
            return setTimeout(displayNone, 300);
        };
    }
};


//   converting Kelvins to Fahrenheit

const convertTemp = K => (1.8 * (K - 273) + 32).toFixed(2);

// convert to proper case

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


// days in week

const getWeekDay = (date) => {
    //Create an array containing each day, starting with Sunday.
    let weekdays = new Array(
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    );
    //Use the getDay() method to get the day.
    let day = date.getDay();
    //Return the element that corresponds to that index.
    return weekdays[day];
}
//fix whitespace
// String.prototype.fixWhiteSpace = function () {
//     return this.replace(/ /g, "%20");
// };

//close
window.onload = function () {
    pairCloseButtons(closeButtons);
};

// WEATHER API DATA
const getWeatherData = () => {

    let city = userInput.value;
    let publicKey = `8fd8cd4cfceeb698eef7a7cd4ea325cc`;
    let lon;
    let lat;
    let apiCallCurrentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${publicKey}`;
    console.log(apiCallCurrentWeather);

    fetch(apiCallCurrentWeather)
        .then(response => response.json())
        .catch(e => {
            console.error(`Retreival error: ${e}`);
        })
        .then(data => {

            console.log(data.coord.lon);
            lon = data.coord.lon;
            lat = data.coord.lat;
            const cityName = data.name;
            const country = data.sys.country;
            const currIcon = data.weather[0].icon;
            const currWeather = data.weather[0].main;

            let currTemp = data.main.temp;
            let tempFeels = data.main.feels_like;
            let currMinTemp = data.main.temp_min;
            let currMaxTemp = data.main.temp_max;

            const humidity = data.main.humidity;
            const wind = data.wind.speed;
            const pressure = data.main.pressure;

            //convert to Fahrenheit

            currTemp = convertTemp(currTemp);
            tempFeels = convertTemp(tempFeels);
            currMinTemp = convertTemp(currMinTemp);
            currMaxTemp = convertTemp(currMaxTemp);

            //rounding values
            currTemp = Math.round(currTemp);
            tempFeels = Math.round(tempFeels);
            currMinTemp = Math.round(currMinTemp);
            currMaxTemp = Math.round(currMaxTemp);


            result.innerHTML = `
            <!-- <h3>Current weather</h3> -->

            <div class="city-wrap">
            <h1>${cityName}</h1>
            <h5> ${country}</h5>
        </div>
            <div class="curr-weather-content">
        <div>
            <div class="weather-data"><img src="http://openweathermap.org/img/wn/${currIcon}@2x.png" alt="${currIcon}"></div>
            <div class="weather-desc">${currWeather}</div>
        </div>
        <div>
            <div class="curr-temp weather-data">${currTemp}<span>&#176;</span></div>
            <div class="weather-desc">current <br/>temperature</div>
        </div>
        <div>
            <div class="weather-data">${currTemp}<span>&#176;</span> </div>
            <div class="weather-desc">feels  <br/> like</div>
        
        </div>
        <div>
            <div class="weather-data">${currMinTemp}<span>&#176;</span> </div>
            <div class="weather-desc">min  <br/> temp</div>
        </div>
        
        <div>
            <div class="weather-data">${currMaxTemp}<span>&#176;</span> </div>
            <div class="weather-desc">max  <br/> temp</div>
        </div>
        
        <div>
            <div class="weather-data">${humidity} <span class="unit">%</span> </div>
            <div class="weather-desc">humidity</div>
        </div>
        
        <div>
            <div class="weather-data">${wind} <span class="unit"> <span class="unit"></span>m/s</span></div>
            <div class="weather-desc">wind</div>
        </div>
        
        <div>
            <div class="weather-data">${pressure}  <span class="unit"> hpa</span> </div>
            <div class="weather-desc">pressure</div>
        </div>
            
        </div>
    
            `;

            // fetching second (one) API

            let apiCallOne = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
            &appid=${publicKey}`;

            getApiCallOne(apiCallOne);

        })
        .catch(e => {
            let resultDiv = document.getElementById("search-result"),
                errorDiv = document.getElementById("errorContainer");

            resultDiv.style.display = "none"; // if error, no results
            errorDiv.style.display = "block"; // display error
            errorDiv.classList.remove("fade-out"); // fade animations
            errorDiv.classList.add("fade-in"); // fade animations
            console.error(`Data Error: ${e} \n city probably does not exist`);
        });

};


// API CALL ONE DATA, 7-DAY FORECAST

const getApiCallOne = (api) => {
    fetch(api)
        .then(response => response.json())
        .catch(e => {
            console.error(`Retreival error: ${e}`);
        })
        .then(data => {

            const resultDiv = document.getElementById("search-result"),
                errorDiv = document.getElementById("errorContainer");
            errorDiv.style.display = "none"; // if results, no error
            resultDiv.style.display = "block"; // if results, display
            window.scrollTo(0, 200); //scroll if window is too small to view results.

            //create table

            const tableHead = document.getElementById('table-head'),
                tableBody = document.getElementById('table-body');
            tableHead.removeChild(tableHead.childNodes[0]);


            let tr = document.createElement('tr');
            tr.innerHTML = `<th scope="col"></th>
        <th scope="col">Weather</th>
        <th scope="col">Temperature</th>
        <th scope="col">Min Temperature</th>
        <th scope="col">Max Temperature</th>`;

            tableHead.appendChild(tr);

            //loop throught days

            for (let i = 0; i < 7; i++) {

                //const day = data.daily[i].dt;
                let getDay = new Date(data.daily[i].dt * 1000),
                    date = getDay.getDate(),
                    month = getDay.getMonth() + 1,
                    day = `${month}. ${date}.`,
                    weekDay = getWeekDay(getDay);


                //weather data
                const weather = data.daily[i].weather[0].description,
                    icon = data.daily[i].weather[0].icon;

                let temp = data.daily[i].temp.day,
                    minTemp = data.daily[i].temp.min,
                    maxTemp = data.daily[i].temp.max;

                temp = convertTemp(temp);
                minTemp = convertTemp(minTemp);
                maxTemp = convertTemp(maxTemp);

                temp = Math.round(temp);
                minTemp = Math.round(minTemp);
                maxTemp = Math.round(maxTemp);

                //html 

                let tr = document.createElement('tr');
                tr.innerHTML = `
                <th scope="row">
                <div>${weekDay}</div>
                <div>${day}</div>
                </th>
                    <td>
                    <div><img src="http://openweathermap.org/img/wn/${icon}.png" alt="${icon}"></div>
                    <div>${weather}</div>
                    </td>
                    <td>${temp}<span>&#176;</span></td>
                    <td>${minTemp}<span>&#176;</span></td>
                    <td>${maxTemp}<span>&#176;</span></td>`;

                tableBody.appendChild(tr);

            }
        })

}

//search click
getWeather.onclick = function () {
    getWeatherData();
};

// search enter
userInput.onkeydown = function (e) {
    if (e.key === 'Enter') getWeatherData();
};