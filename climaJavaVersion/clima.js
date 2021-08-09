var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";
//var stamm = "http://localhost:3005/incyt/api/clima";

var data;
var data2;
//graphs
var labels;
var datasetLluvia;
var color = Chart.helpers.color;

var campos;
var arreglo;



async function fetchData(
  estacion,
  estacion2,
  yyyy1,
  yyyy2,
  selectVisualizacion,
  ctx
) {

  //MESES
  var res;
  //res = await fetch(stamm + "/getmeses");
  //this.meses = await res.json();
  var titulo = "";
  var l = [];
  var d1 = [];
  var barChartData;

  //https://arcgis-web.url.edu.gt/incyt/api/clima/getdata?yyyy1=1979&yyyy2=1982&estacion=Alameda
  console.log(selectVisualizacion);
  if (selectVisualizacion === "Historico") {
    titulo = "Historico de Lluvia";
    var url =
      stamm +
      "/getdata?yyyy1=" +
      yyyy1 +
      "&yyyy2=" +
      yyyy2 +
      "&estacion=" +
      estacion;
    console.log(url);
    res = await fetch(url);
    this.data = await res.json();
    createTableColumns(this.data, [
      "estacion",
      "year",
      "mes",
      "dia",
      "lluvia",
      //"zona_vida",
    ]);
    for (var i = 0; i < this.data.length; i++) {
      l.push(
        this.data[i].year + "/" + this.data[i].mes + "/" + this.data[i].dia
      );
      d1.push(this.data[i].lluvia);
    }
    this.labels = l;
    this.datasetLluvia = d1;
    // console.log(this.labels);
    // console.log(this.datasetLluvia);

    barChartData = {
      labels: labels,
      datasets: [
        {
          label: titulo,
          backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: datasetLluvia,
        },
      ],
    };
    console.log(barChartData);
  } else if (selectVisualizacion === "Promedio") {
    titulo = "Promedio de Lluvia";
    var url =
      stamm +
      "/getdataAVG?yyyy1=" +
      yyyy1 +
      "&yyyy2=" +
      yyyy2 +
      "&estacion=" +
      estacion;
    //console.log(url);
    res = await fetch(url);
    this.data = await res.json();
    createTableColumns(this.data, [
      "estacion",
      "year",
      "mes",
      "tPromedio",
      //"zona_vida",
    ]);
    for (var i = 0; i < this.data.length; i++) {
      l.push(this.data[i].year + "/" + this.data[i].mes);
      d1.push(this.data[i].lluvia);
    }
    this.labels = l;
    this.datasetLluvia = d1;
    console.log(this.labels);
    console.log(this.datasetLluvia);

    barChartData = {
      labels: labels,
      datasets: [
        {
          label: titulo,
          backgroundColor: window.chartColors.red,
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: datasetLluvia,
        },
      ],
    };
    console.log(barChartData);
  } else if (selectVisualizacion === "Proyeccion") {
  }

  //console.log(this.meses);
  console.log(this.data);
  //display data
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
        text: titulo,
      },
    },
  });
}

function reporte(id) {

  var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";

  var url = stamm + "/getalertsdetailreport" + "?id=" + id;

  $.get(url, function (data, status) {
    //console.log("Data: " + data + "\nStatus: " + status);
    if (data.length > 0) {
      console.log("desplegamos grid");
      //console.log(data[0].twitjson);
      fillTable(data);
    } else {
      alert("No hay datos disponibles");
    }
  });
}

$(document).ready(function () {
  document.getElementById("tituloPrincipal").innerHTML ='Proyeccion de Clima';


  var ctx = document.getElementById("canvasTemperatura").getContext("2d");
  var ctx2 = document.getElementById("canvasLluvia").getContext("2d");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  this.estacion = urlParams.get("selectEstacion");
  this.estacion2 = urlParams.get("selectEstacion2");
  this.yyyy1 = urlParams.get("selectYYYY1");
  this.yyyy2 = urlParams.get("selectYYYY2");
  this.selectVisualizacion = urlParams.get("selectVisualizacion");


    fetchData(
      this.estacion,
      this.estacion2,
      this.yyyy1,
      this.yyyy2,
      this.selectVisualizacion,
      ctx
    );

});
