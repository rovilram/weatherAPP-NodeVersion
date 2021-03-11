const WEATHER_API_KEY = "7302d365a535e9b73d4e624a79aea55f";


const printHeader = (headerText, d) => {

    const headerDiv = d.createElement("header");
    const h1 = d.createElement("h1");
    const h1Text = d.createTextNode(`El tiempo en ${headerText}`);
    h1.appendChild(h1Text);
    headerDiv.appendChild(h1);
    d.body.appendChild(headerDiv);
    console.log(headerDiv);

}

const printMap = (lat, lon, mapDiv,weatherPIC) => {

    const mymap = L.map(mapDiv).setView([lat, lon], 10);
    L.marker([lat, lon]).addTo(mymap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    console.log(weatherPIC)
    
    const overlay = new L.ImageOverlay(  `http://openweathermap.org/img/wn/${weatherPIC}@4x.png`   , [[lat-.075,lon-.1], [lat+0.075,lon+0.1]], {opacity: 0.75,});
    mymap.addLayer(overlay);

}


//Intentando de hacer una clase para el geoposicionamiento, pero no puedo crear un constructor async.
//Hay otras formas de hacerlo, pero por ahora es demasiado complejo para mi
/* class geoPosition {
    async construct() {
        const position = await getPosition();
        this._lat = position.coords.latitude;
        this._lon = position.coords.longitude;
    }

    getPosition () {
        return new Promise((resolve, reject) => {

            navigator.geolocation.getCurrentPosition(resolve, reject);
        })
    }

    get lat (){
        return this._lat;
    }

    get lon () {
        return this._lon;
    }
} */



//const position = new geoPosition();

//console.log("POSICION CLASE",position._lat, position.lon)




const getPosition = () => {
    return new Promise((resolve, reject) => {

        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

async function getWeather(lat, lon) {
    if (!WEATHER_API_KEY)
        console.log(new Error("An API KEY must be provided"));
    else if (!lat || !lon)
        console.log(new Error("You must provide latitue and longitude"));
    else {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${WEATHER_API_KEY}&units=metric`)

        if (response.ok) return response.json();
        else console.log(new Error("ERROR: API MALA!"))
    }
}



async function getLocation(lat, lon) {
    if (!WEATHER_API_KEY)
        throw(new Error("An API KEY must be provided"));
    else if (!lat || !lon)
        throw(new Error("You must provide latitude and longitude"));
    else {

        const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=10&appid=${WEATHER_API_KEY}`);
        if (response.ok) return response.json();
        else console.log(new Error("ERROR: API MALA!"))
    }

}



const dayOfWeek = (number) => {

    if (number < 0 || number > 6) {
        throw new Error("Día de la semana invalido");
    }

    const weekdayText = [];
    weekdayText[0] = "Domingo";
    weekdayText[1] = "Lunes";
    weekdayText[2] = "Martes";
    weekdayText[3] = "Miércoles";
    weekdayText[4] = "Jueves";
    weekdayText[5] = "Viernes";
    weekdayText[6] = "Sábado";

    return weekdayText[number];
}



const printChart = (json, chartDiv) => {

    const data = {};
    data.labels = [];
    data.series = [[], [], []];

    json.daily.map((day) => {
        const date = new Date(day.dt * 1000);
        const weekDay = date.getDay();

        data.labels.push(dayOfWeek(weekDay));
        data.series[0].push(day.temp.max);
        data.series[1].push(day.temp.min);
        data.series[2].push(day.temp.day);
    })

    new Chartist.Line(chartDiv, data);
}



const printWeather = (weatherJSON, d) => {
    const weatherWrapper = d.createElement("div");
    weatherWrapper.setAttribute("class", "weatherWrapper");
    const h2 = d.createElement("h2");
    console.log(weatherJSON)
    const h2Text = d.createTextNode("Tiempo actual");
    h2.appendChild(h2Text);
    weatherWrapper.appendChild(h2);
    d.body.appendChild(weatherWrapper);


    const actualWrapper = d.createElement("div");
    actualWrapper.setAttribute("class", "actualWrapper");

    weatherWrapper.appendChild(actualWrapper);

    const actualValWrapper = d.createElement("div")
    actualValWrapper.setAttribute("class", "actualValWrapper");

    actualWrapper.appendChild(actualValWrapper);

    const actualTemp = d.createElement("div");
    actualTemp.setAttribute("class", "actualTemp");

    actualValWrapper.appendChild(actualTemp);
    const tempLabel = d.createElement("div");
    tempLabel.setAttribute("class", "tempLabel");

    const tempLabelText = d.createTextNode("Temperatura:");
    tempLabel.appendChild(tempLabelText);
    actualTemp.appendChild(tempLabel);
    const tempVal = d.createElement("div");
    tempVal.setAttribute("class", "tempVal");

    const tempValText = d.createTextNode(`${weatherJSON.current.temp}ºC`);
    tempVal.appendChild(tempValText);
    actualTemp.appendChild(tempVal);

    const actualPress = d.createElement("div");
    actualPress.setAttribute("class", "actualPress");

    actualValWrapper.appendChild(actualPress);
    const pressLabel = d.createElement("div");
    pressLabel.setAttribute("class", "pressLabel");

    const pressLabelText = d.createTextNode("Presión:");
    pressLabel.appendChild(pressLabelText);
    actualPress.appendChild(pressLabel);
    const pressVal = d.createElement("div");
    pressVal.setAttribute("class", "pressVal");

    const pressValText = d.createTextNode(`${weatherJSON.current.pressure} mbar`);
    pressVal.appendChild(pressValText);
    actualPress.appendChild(pressVal);

    const actualIconWrapper = d.createElement("div");
    actualIconWrapper.setAttribute("class", "actualIconWrapper");

    actualWrapper.appendChild(actualIconWrapper);
    const actualIcon = d.createElement("div");
    actualIcon.setAttribute("class", "actualIcon");

    actualIconWrapper.appendChild(actualIcon);
    const icon = d.createElement("img");
    icon.setAttribute("class", "icon");

    actualIcon.appendChild(icon);
    icon.setAttribute("src", `http://openweathermap.org/img/wn/${weatherJSON.current.weather[0].icon}@4x.png`);
    icon.setAttribute("alt", "clear sky");
    icon.setAttribute("title", "clear sky");


    const chartWrapper = d.createElement("div");
    chartWrapper.setAttribute("class", "chartWrapper");
    weatherWrapper.appendChild(chartWrapper);

    const chartH2 = d.createElement("h2");
    const chartH2Text = d.createTextNode("La temperatura en 7 días");
    chartH2.appendChild(chartH2Text);
    chartWrapper.appendChild(chartH2);


    const chartDiv = d.createElement("div");
    chartDiv.setAttribute("class", "chartDiv ct-octave");
    chartWrapper.appendChild(chartDiv);
    printChart(weatherJSON, ".chartDiv");


}

const main = async (d) => {

    const position = await getPosition();
    console.log(position);
    const location = await getLocation(position.coords.latitude, position.coords.longitude);
    console.log("LOCATION:", location)
    console.log(`${location[0].name}/${location[0].country}`);
    const weatherJSON = await getWeather(position.coords.latitude, position.coords.longitude);
    weatherJSON.location=(`${location[0].name}/${location[0].country}`)

    console.log(weatherJSON);
    printHeader(weatherJSON.location, d);
    mapDiv = d.createElement("div");
    mapDiv.setAttribute("id", "mapDiv")
    d.body.appendChild(mapDiv)
    printMap(position.coords.latitude, position.coords.longitude, "mapDiv",weatherJSON.current.weather[0].icon);
    weatherDiv = d.createElement("div");
    weatherDiv.setAttribute("class", "weatherDiv");
    d.body.appendChild(weatherDiv);
    printWeather(weatherJSON, d);
}




window.addEventListener("load", () => {
    main(document)
});

