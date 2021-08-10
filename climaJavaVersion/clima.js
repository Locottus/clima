
var data;
var data2;
//graphs
var labels;
var datasetLluvia;
var color = Chart.helpers.color;

var campos;
var arreglo;
var x = 0;
var y = 0;

var fecha = [];
var maxTemp = [];
var minTemp = [];
var diaTemp = [];
var nocheTemp = [];
var rain = [];
var humidity = [];
var weather = [];


function parseFecha(l){
  var d =  new Date(l.dt * 1000).toString().split(' '); 
  //console.log(d);
  return (d[0] + ' '+ d[2] + ' ' + d[1] +' ' +d[3] );
}

function graficarArreglos(daily){
  console.log(daily);

  for(var i = 0; i < daily.length; i++)
  {
    this.fecha.push(parseFecha(daily[i]));
    this.maxTemp.push(daily[i].temp.max);
    this.minTemp.push(daily[i].temp.min);
    this.diaTemp.push(daily[i].temp.day);
    this.nocheTemp.push(daily[i].temp.night);
    this.rain.push(daily[i].rain);
    this.humidity.push(daily[i].humidity);
    this.weather.push(daily[i].weather[0].description);
  }
  graficaTemperatura();
  graficaLluvia();
  graficaIconos(daily);
}

function graficaIconos(daily){
  var dia = false;
  var icon = 'fa-sun';
  var colorIcon = 'orange';
  var climaTexto = 'soleado bonito';
  var fechaTexto = 'algun dia';

var d = new Date();
//fecha = d.toString();
thishora = d.getHours();



var ld=''
for(var i = 0; i < daily.length; i++)
  {
    if (this.hora > 5 && this.hora < 19){
      dia = true;
      colorIcon = 'orange';
      if (this.weather[i].indexOf( "nub" )>-1)
        icon = 'fa-cloud-sun';
      if (this.weather[i].indexOf( "lluvi" )>-1)
        icon = 'fa-cloud-sun-rain';
    }
      
    else{
      dia = false;
      colorIcon = 'steelblue';
      icon = 'fa-moon'
      if (this.weather[i].indexOf( "nub" )>-1)
        icon = 'fa-cloud-moon';
      if (this.weather[i].indexOf( "lluvi" )>-1)
        icon = 'fa-cloud-moon-rain';

    }
    var colTemplate = `  
    <div class="col">
    <i  class="fas fa-5x fa-align-center ${icon}" style="color:${colorIcon}"></i>
    <div><b>${this.weather[i]}</b></div>
    <p>${this.fecha[i]}</p>            
  </div>
  `;
          
    ld = ld + colTemplate;
  }


  document.getElementById("iconosClima").innerHTML =  ld;
}

function graficaTemperatura(){

  barChartData = {
    labels: this.fecha,
    datasets: [
      {
        label: 'Temperatura Maxima',
        backgroundColor: color(window.chartColors.red).alpha(0).rgbString(),
        borderColor: window.chartColors.red,
        borderWidth: 1,
        data: this.maxTemp,
      },
      {
        label: 'Temperatura Minima',
        backgroundColor: color(window.chartColors.yellow)
          .alpha(0)
          .rgbString(),
        borderColor: window.chartColors.yellow,
        borderWidth: 1,
        data: this.minTemp,
      },
      {
        label: 'Temperatura Dia',
        backgroundColor: color(window.chartColors.green)
          .alpha(0)
          .rgbString(),
        borderColor: window.chartColors.green,
        borderWidth: 1,
        data: this.diaTemp,
      },
      {
        label: 'Temperatura Noche',
        backgroundColor: color(window.chartColors.blue)
          .alpha(0)
          .rgbString(),
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: this.nocheTemp,
      },

    ],
  };
  console.log(barChartData);
  var ctx = document.getElementById("canvasTemperatura").getContext("2d");

  window.myBar = new Chart(ctx, {
    type: "line",
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: 'Lluvia de los proximos días',
      },
    },
  });
}





function graficaLluvia(){

  barChartData = {
    labels: this.fecha,
    datasets: [
      {
        label: 'Humedad',
        backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        borderColor: window.chartColors.red,
        borderWidth: 1,
        data: this.humidity,
      },
      {
        label: 'Lluvia',
        backgroundColor: color(window.chartColors.green)
          .alpha(0.5)
          .rgbString(),
        borderColor: window.chartColors.blue,
        borderWidth: 1,
        data: this.rain,
      },
    ],
  };
  console.log(barChartData);
  var ctx = document.getElementById("canvasLluvia").getContext("2d");

  window.myBar = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: {
      responsive: true,
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: 'Temperaturas de los proximos días',
      },
    },
  });
}




async function fetchData(y,  x) {
  
  console.log(y,x);
  //var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${y}&lon=${x}&appid=98674de6a91859bcea48ba07be964379&units=metric&lang=sp`;
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${y}&lon=${x}&appid=98674de6a91859bcea48ba07be964379&units=metric&lang=sp`;
  
  
  //esto es para produccion
  var res = await fetch(url);
  console.log(res);
  var data = await res.json();
  console.log(data);
  var daily = data.daily;
  
  //con daily voy a trabajar ahorita que es dev
 
 /*
  console.log('******************************************');
  var daily = [
    {
        "dt": 1628532000,
        "sunrise": 1628509630,
        "sunset": 1628555283,
        "moonrise": 1628512980,
        "moonset": 1628559600,
        "moon_phase": 0.04,
        "temp": {
            "day": 23.11,
            "min": 13.99,
            "max": 23.82,
            "night": 14.84,
            "eve": 21.5,
            "morn": 14.05
        },
        "feels_like": {
            "day": 23.12,
            "night": 14.91,
            "eve": 21.51,
            "morn": 14.04
        },
        "pressure": 1017,
        "humidity": 63,
        "dew_point": 15.69,
        "wind_speed": 1.87,
        "wind_deg": 36,
        "wind_gust": 3,
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "lluvia ligera",
                "icon": "10d"
            }
        ],
        "clouds": 94,
        "pop": 1,
        "rain": 3.39,
        "uvi": 12.93
    },
    {
        "dt": 1628618400,
        "sunrise": 1628596042,
        "sunset": 1628641655,
        "moonrise": 1628602680,
        "moonset": 1628648520,
        "moon_phase": 0.07,
        "temp": {
            "day": 23.23,
            "min": 13.03,
            "max": 23.74,
            "night": 14.71,
            "eve": 17.82,
            "morn": 13.03
        },
        "feels_like": {
            "day": 22.99,
            "night": 14.77,
            "eve": 18.03,
            "morn": 12.9
        },
        "pressure": 1016,
        "humidity": 53,
        "dew_point": 13.4,
        "wind_speed": 1.91,
        "wind_deg": 25,
        "wind_gust": 2.97,
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "lluvia ligera",
                "icon": "10d"
            }
        ],
        "clouds": 76,
        "pop": 0.85,
        "rain": 1.35,
        "uvi": 13.3
    },
    {
        "dt": 1628704800,
        "sunrise": 1628682454,
        "sunset": 1628728025,
        "moonrise": 1628692260,
        "moonset": 1628737380,
        "moon_phase": 0.11,
        "temp": {
            "day": 23.23,
            "min": 12.86,
            "max": 23.23,
            "night": 14.84,
            "eve": 18.08,
            "morn": 12.86
        },
        "feels_like": {
            "day": 23.02,
            "night": 14.89,
            "eve": 18.19,
            "morn": 12.73
        },
        "pressure": 1016,
        "humidity": 54,
        "dew_point": 13.59,
        "wind_speed": 1.86,
        "wind_deg": 19,
        "wind_gust": 3.1,
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "lluvia ligera",
                "icon": "10d"
            }
        ],
        "clouds": 75,
        "pop": 0.53,
        "rain": 0.12,
        "uvi": 13.19
    },
    {
        "dt": 1628791200,
        "sunrise": 1628768865,
        "sunset": 1628814396,
        "moonrise": 1628781960,
        "moonset": 1628826240,
        "moon_phase": 0.15,
        "temp": {
            "day": 22.41,
            "min": 13.13,
            "max": 23.24,
            "night": 15.43,
            "eve": 18.26,
            "morn": 13.13
        },
        "feels_like": {
            "day": 22.25,
            "night": 15.54,
            "eve": 18.52,
            "morn": 13.01
        },
        "pressure": 1016,
        "humidity": 59,
        "dew_point": 14.36,
        "wind_speed": 1.54,
        "wind_deg": 6,
        "wind_gust": 2.47,
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "lluvia ligera",
                "icon": "10d"
            }
        ],
        "clouds": 88,
        "pop": 0.94,
        "rain": 2.93,
        "uvi": 12.94
    },
    {
        "dt": 1628877600,
        "sunrise": 1628855276,
        "sunset": 1628900765,
        "moonrise": 1628871600,
        "moonset": 1628915100,
        "moon_phase": 0.18,
        "temp": {
            "day": 23.87,
            "min": 12.68,
            "max": 24,
            "night": 15.75,
            "eve": 18.99,
            "morn": 12.68
        },
        "feels_like": {
            "day": 23.62,
            "night": 15.76,
            "eve": 19.14,
            "morn": 12.48
        },
        "pressure": 1016,
        "humidity": 50,
        "dew_point": 13.13,
        "wind_speed": 1.86,
        "wind_deg": 28,
        "wind_gust": 3.01,
        "weather": [
            {
                "id": 500,
                "main": "Rain",
                "description": "lluvia ligera",
                "icon": "10d"
            }
        ],
        "clouds": 55,
        "pop": 0.65,
        "rain": 0.62,
        "uvi": 14.26
    },
    {
        "dt": 1628964000,
        "sunrise": 1628941686,
        "sunset": 1628987133,
        "moonrise": 1628961420,
        "moonset": 1629004200,
        "moon_phase": 0.22,
        "temp": {
            "day": 24.39,
            "min": 13.95,
            "max": 24.39,
            "night": 15.77,
            "eve": 18.6,
            "morn": 13.95
        },
        "feels_like": {
            "day": 24.35,
            "night": 15.91,
            "eve": 18.87,
            "morn": 13.86
        },
        "pressure": 1016,
        "humidity": 56,
        "dew_point": 15.3,
        "wind_speed": 1.52,
        "wind_deg": 33,
        "wind_gust": 2.48,
        "weather": [
            {
                "id": 501,
                "main": "Rain",
                "description": "lluvia moderada",
                "icon": "10d"
            }
        ],
        "clouds": 34,
        "pop": 1,
        "rain": 8.75,
        "uvi": 15
    },
    {
        "dt": 1629050400,
        "sunrise": 1629028096,
        "sunset": 1629073501,
        "moonrise": 1629051300,
        "moonset": 1629093540,
        "moon_phase": 0.25,
        "temp": {
            "day": 22.25,
            "min": 14.8,
            "max": 22.25,
            "night": 16.57,
            "eve": 18.18,
            "morn": 14.8
        },
        "feels_like": {
            "day": 22.49,
            "night": 16.82,
            "eve": 18.51,
            "morn": 14.87
        },
        "pressure": 1016,
        "humidity": 75,
        "dew_point": 17.81,
        "wind_speed": 1.31,
        "wind_deg": 158,
        "wind_gust": 2.37,
        "weather": [
            {
                "id": 501,
                "main": "Rain",
                "description": "lluvia moderada",
                "icon": "10d"
            }
        ],
        "clouds": 91,
        "pop": 1,
        "rain": 13.77,
        "uvi": 15
    },
    {
        "dt": 1629136800,
        "sunrise": 1629114506,
        "sunset": 1629159868,
        "moonrise": 1629141420,
        "moonset": 0,
        "moon_phase": 0.29,
        "temp": {
            "day": 22.43,
            "min": 14.86,
            "max": 22.43,
            "night": 16.45,
            "eve": 18,
            "morn": 14.86
        },
        "feels_like": {
            "day": 22.71,
            "night": 16.71,
            "eve": 18.31,
            "morn": 14.91
        },
        "pressure": 1014,
        "humidity": 76,
        "dew_point": 18.15,
        "wind_speed": 1.55,
        "wind_deg": 140,
        "wind_gust": 2.13,
        "weather": [
            {
                "id": 501,
                "main": "Rain",
                "description": "lluvia moderada",
                "icon": "10d"
            }
        ],
        "clouds": 41,
        "pop": 1,
        "rain": 17.03,
        "uvi": 15
    }
];

*/  
  graficarArreglos(daily);
}


$(document).ready(function () {
  document.getElementById("tituloPrincipal").innerHTML ='Proyeccion de Clima';


  

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  this.y = urlParams.get("y");
  this.x = urlParams.get("x");

  //temperatura y lluvia
  fetchData( this.y, this.x);

});
