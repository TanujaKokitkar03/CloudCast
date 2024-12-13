const cityInput = document.querySelector('.input_city')
const searchBtn = document.querySelector('.search_btn')

// taking each important value & storing it in a variable

const countryTxt = document.querySelector('.country')
const currentDate = document.querySelector('.current_date')
const tempTxt = document.querySelector('.temp')
const conditionTxt = document.querySelector('.condition')
const humidityValueTxt = document.querySelector('.humidity_value_txt')
const windValueTxt = document.querySelector('.wind_value_txt')
const weatherSummaryImg = document.querySelector('.weather_summary_img')

const forecastItemsCont = document.querySelector('.forecast_items_cont')

const weatherInfo = document.querySelector('.weather_info')
const notFoundCity = document.querySelector('.not_found_city')
const searchCity = document.querySelector('.search_city')

// store api key 
const apiKey = 'dbc69abdbe4113b9bb17a8f3a6e795e4'

searchBtn.addEventListener('click', () => {
    // input value cannot be empty
    if(cityInput.value.trim() != ''){    
        // console.log(cityInput.value)
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' && 
        cityInput.value.trim() != ''
    ){
        updateWeatherInfo(cityInput.value)

        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city){
    const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiURL)
    return response.json()
}

// func to display appropriate weather image based on id
function getWeatherIcon(id){
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

// func to display current date
function getCurrentDate(){
    const currDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currDate.toLocaleDateString('en-GB', options)
}

//func to fetch weather data for input city
async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)

    // if city does not exist
    if(weatherData.cod != 200){
        showDisplaySection(notFoundCity)
        return
    }
    
    // fetching imp details about weather & city/country
    const{
        name: country,
        main: {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherData

    //matching the value with API data
    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + '°C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + ' M/s'

    currentDate.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfo)
}

// func to fetch list of weather forecasts
async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsCont.innerHTML = ''

    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherData){
    // console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short',
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast_item">
            <h5 class="forecast_item_date regular_txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast_item_img" />
            <h5 class="forecast_item_temp">${Math.round(temp)}°C</h5>
        </div>
    `
    forecastItemsCont.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){
    [weatherInfo, searchCity, notFoundCity].forEach(section => section.style.display = 'none')
    section.style.display = 'flex'
}

