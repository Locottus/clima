var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";
//var stamm = "http://localhost:3005/incyt/api/clima";

var meses;
var estacion;
var estacion2;
var yyyy1;
var yyyy2;
var selectVisualizacion;
var data;
var data2;
//graphs
var labels;
var datasetLluvia;
var color = Chart.helpers.color;

async function fetchData2(
  estacion,
  estacion2,
  yyyy1,
  yyyy2,
  selectVisualizacion,
  ctx
) {
  console.log("2 stations");
  //MESES
  var res;
  //res = await fetch(stamm + "/getmeses");
  //this.meses = await res.json();
  var titulo = "";
  var l = [];
  var d1 = [];
  var d2 = [];
  var barChartData;

  //https://arcgis-web.url.edu.gt/incyt/api/clima/getdata?yyyy1=1979&yyyy2=1982&estacion=Alameda
  console.log(selectVisualizacion);
  if (selectVisualizacion === "Historico") {
    titulo = "Historico de Lluvia comparativo " + estacion + " " + estacion2;
    var url =
      stamm +
      "/getdata2?yyyy1=" +
      yyyy1 +
      "&yyyy2=" +
      yyyy2 +
      "&estacion=" +
      estacion +
      "&estacion2=" +
      estacion2;
    console.log(url);
    res = await fetch(url);
    this.data = await res.json();

    for (var i = 0; i < this.data.length; i++) {
      l.push(
        this.data[i].year + "/" + this.data[i].mes + "/" + this.data[i].dia
      );
      d1.push(this.data[i].lluvia1);
      d2.push(this.data[i].lluvia2);
    }
    this.labels = l;
    //this.datasetLluvia = d1;
    //console.log(this.labels);
    //console.log(this.datasetLluvia);

    barChartData = {
      labels: labels,
      datasets: [
        {
          label: estacion,
          backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: d1,
        },
        {
          label: estacion2,
          backgroundColor: color(window.chartColors.blue)
            .alpha(0.5)
            .rgbString(),
          borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: d2,
        },
      ],
    };
    console.log(barChartData);
  } else if (selectVisualizacion === "Promedio") {
    titulo = "Promedio de Lluvia comparativo " + estacion + " " + estacion2;
    var url =
      stamm +
      "/getdataAVG2?yyyy1=" +
      yyyy1 +
      "&yyyy2=" +
      yyyy2 +
      "&estacion=" +
      estacion +
      "&estacion2=" +
      estacion2;

    console.log(url);
    res = await fetch(url);
    this.data = await res.json();
    console.log(data);
    for (var i = 0; i < this.data.length; i++) {
      l.push(this.data[i].year + "/" + this.data[i].mes);
      d1.push(this.data[i].lluvia1);
      d2.push(this.data[i].lluvia2);
    }
    this.labels = l;
    //this.datasetLluvia = d1;
    console.log(this.labels);
    //console.log(this.datasetLluvia);

    barChartData = {
      labels: labels,
      datasets: [
        {
          label: estacion,
          backgroundColor: window.chartColors.red,
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: d1,
        },
        {
          label: estacion2,
          backgroundColor: window.chartColors.blue,
          borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: d2,
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

    for (var i = 0; i < this.data.length; i++) {
      l.push(
        this.data[i].year + "/" + this.data[i].mes + "/" + this.data[i].dia
      );
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
    console.log(url);
    res = await fetch(url);
    this.data = await res.json();

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
  //console.log("entrando a generar reporte");
  //console.log(currentDepartment + ' ' + currentMunicipio + ' ' +currentMunicipioId);
  //https://github.com/chartjs/Chart.js

  var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";
  //var stamm = "http://localhost:3000/incyt/api/sosguate";

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

function fillTable(data) {
  console.log(data);
  var table = document.getElementById("tableInfo");
  var tableTitle = document.getElementById("tableTitle");
  tableTitle.innerHTML = "Reportes Municipales de Agua";
  table.innerHTML = "";
  table.innerHTML =
    "<thead>" +
    "   <tr>" +
    "    <th scope='col'>Fecha</th>" +
    "    <th scope='col'>Alerta</th>" +
    "  </tr>" +
    "</thead>  ";

  console.log(data);
  for (var i = 0; i < data.length; i++) {
    //console.log(data);
    var atributos = ({ fecha, text } = data[i]);
    var myDate;

    console.log(atributos);

    // IM WEBSITE ANSEHEN
    var row = table.insertRow(i + 1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    //var cell2 = row.insertCell(2);
    //var cell3 = row.insertCell(3);
    cell0.innerHTML = atributos.fecha;
    cell1.innerHTML = atributos.text;
    //cell2.innerHTML = myDate;//atributos.created_at;
    //cell3.innerHTML = atributos.source;
  }
}
$(document).ready(function () {
  var ctx = document.getElementById("canvas").getContext("2d");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  this.estacion = urlParams.get("selectEstacion");
  this.estacion2 = urlParams.get("selectEstacion2");
  this.yyyy1 = urlParams.get("selectYYYY1");
  this.yyyy2 = urlParams.get("selectYYYY2");
  this.selectVisualizacion = urlParams.get("selectVisualizacion");

  document.getElementById("tituloPrincipal").innerHTML =
    "Estacion: " +
    this.estacion +
    " año inicial " +
    this.yyyy1 +
    " año final " +
    this.yyyy2 +
    " visualizacion " +
    this.selectVisualizacion;

  if (this.estacion2.length > 1) {
    //son 2 a comparar
    fetchData2(
      this.estacion,
      this.estacion2,
      this.yyyy1,
      this.yyyy2,
      this.selectVisualizacion,
      ctx
    );
  } else {
    fetchData(
      this.estacion,
      this.estacion2,
      this.yyyy1,
      this.yyyy2,
      this.selectVisualizacion,
      ctx
    );
  }
});
