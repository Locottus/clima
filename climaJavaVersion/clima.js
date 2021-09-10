
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


function parseFecha(l) {
  var d = new Date(l.dt * 1000).toString().split(' ');
  //console.log(d);
  //return (d[0] + ' '+ d[2] + ' ' + d[1] +' ' +d[3] );
  return (d[2] + ' ' + d[1] + ' ' + d[3]);
}

function graficarArreglos(daily) {
  console.log(daily);

  for (var i = 0; i < daily.length; i++) {
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

function graficaIconos(daily) {
  var dia = false;
  var icon = 'fa-sun';
  var colorIcon = 'orange';

  var d = new Date();
  //fecha = d.toString();
  hora = d.getHours();



  var ld = ''
  for (var i = 0; i < daily.length; i++) {
    if (hora > 5 && hora < 19) {
      dia = true;
      colorIcon = 'orange';

      if (this.weather[i].indexOf("clar") > -1)
        icon = 'fa-sun';
      if (this.weather[i].indexOf("nub") > -1)
        icon = 'fa-cloud-sun';
      if (this.weather[i].indexOf("lluvi") > -1)
        icon = 'fa-cloud-sun-rain';
    }

    else {
      dia = false;
      colorIcon = 'steelblue';
      icon = 'fa-moon'
      if (this.weather[i].indexOf("nub") > -1)
        icon = 'fa-cloud-moon';
      if (this.weather[i].indexOf("lluvi") > -1)
        icon = 'fa-cloud-moon-rain';

    }
    var colTemplate = `  
    <div class="col">
    <i  class="fas fa-5x fa-align-center ${icon}" style="color:${colorIcon}"></i>
    <div><b>${this.weather[i]}</b></div>
    <div><b>${this.diaTemp[i]}℃</b></div>
    <div>${this.fecha[i]}</div>
    <div>Viento: ${daily[i].wind_speed}m/s</div>
    <div>uvi: ${daily[i].uvi}UV</div>
    <div>Fase Lunar: ${daily[i].moon_phase}</div>
  </div>
  `;

    ld = ld + colTemplate;
  }


  document.getElementById("iconosClima").innerHTML = ld;
}

function graficaTemperatura() {

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
        label: 'Temperatura de Dia',
        backgroundColor: color(window.chartColors.green)
          .alpha(0)
          .rgbString(),
        borderColor: window.chartColors.green,
        borderWidth: 1,
        data: this.diaTemp,
      },
      {
        label: 'Temperatura de Noche',
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
        text: 'Temperatura de los proximos días',
      },
    },
  });
}





function graficaLluvia() {

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
        text: 'Lluvia de los proximos días',
      },
    },
  });
}




async function fetchData(y, x) {

  console.log(y, x);
  //var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${y}&lon=${x}&appid=98674de6a91859bcea48ba07be964379&units=metric&lang=sp`;
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${y}&lon=${x}&appid=98674de6a91859bcea48ba07be964379&units=metric&lang=sp`;


  //esto es para produccion
  var res = await fetch(url);
  console.log(res);
  var data = await res.json();
  console.log(data);
  var daily = data.daily;

  graficarArreglos(daily);
}


$(document).ready(function () {
  document.getElementById("tituloPrincipal").innerHTML = 'Proyeccion de Clima';

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  this.y = urlParams.get("y");
  this.x = urlParams.get("x");

  //temperatura y lluvia
  fetchData(this.y, this.x);

});
