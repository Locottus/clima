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

var campos;
var arreglo;

//d = data, dataAvg
function poblarFechas(d, tipo) {
  var fechas = [];
  for (var i = 0; i < d.length; i++) {
    var s = "";
    if (tipo === "Historico") s = d[i].dia + "/" + d[i].mes + "/" + d[i].year;
    else s = d[i].mes + "/" + d[i].year;

    if (fechas.indexOf(s) == -1) fechas.push(s);
  }
  return fechas.sort();
}


function poblarEstaciones(d,estacion, fechas, tipo) {
  
  var est = [fechas.length];
  for (var i = 0; i < fechas.length; i++)
    est[i] = '0';

  for (var i = 0; i < d.length; i++) {
    var s = "";
    if (tipo === "Historico") 
      s = d[i].dia + "/" + d[i].mes + "/" + d[i].year;
    else 
      s = d[i].mes + "/" + d[i].year;
    
    var indice = fechas.indexOf(s);

    //console.log(indice,s,' indice de fechas');
    //console.log(d[i]);
    if ((indice > -1) && (estacion === d[i].estacion)) {
      est[indice] = d[i].lluvia;
    }
  }
  //console.log("---------------------------------");
  //console.log(est);
  return est;
}

function download_csv() {
  var archivo = prompt(
    "Ingrese el nombre del archivo a salvar:",
    "archivo_datos.csv"
  );
  if (archivo == null || archivo == "") {
    console.log("User cancelled the prompt.");
  } else {
    //DOWNLOADING FILE
    //archivo = archivo.replace(/ /g,'');//removing white spaces from file name
    if (archivo.toUpperCase().indexOf(".CSV") == -1) {
      archivo = archivo + ".csv";
    }
    console.log(archivo);
    console.log(campos);
    console.log(arreglo);
    //here i create the csv.

    var csv = "";

    //set titles
    for (var i = 0; i < campos.length; i++) {
      csv += campos[i] + ",";
    }
    //set data
    for (var i = 0; i < arreglo.length; i++) {
      csv += "\n";
      for (var j = 0; j < campos.length; j++) {
        csv += arreglo[i][campos[j]] + ",";
      }
    }
    csv += "\n";

    console.log(csv);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = archivo; //"people.csv";
    hiddenElement.click();
  }
}

function createFile() {
  console.log("save file");

  var archivo = prompt(
    "Ingrese el nombre del archivo a salvar:",
    "archivo_datos.csv"
  );
  if (archivo == null || archivo == "") {
    console.log("User cancelled the prompt.");
  } else {
    console.log(archivo);
  }
}

function createTableColumns(arreglo, campos) {
  this.arreglo = arreglo;
  this.campos = campos;
  console.log("creando columnas con datos de tabla***************");
  // console.log(this.arreglo);
  // console.log(this.campos);

  var table = document.getElementById("tableInfo");
  var h1 = "\n<tr>\n";
  for (var i = 0; i < campos.length; i++) {
    h1 = h1 + " <th>" + campos[i] + "</th> \n";
  }

  h1 = h1 + "\n</tr>\n";
  console.log(h1);

  var h2 = "";
  for (var i = 0; i < data.length; i++) {
    h2 = h2 + "<tr>\n";
    for (var j = 0; j < campos.length; j++) {
      h2 = h2 + " <td>" + data[i][campos[j]] + "</td>\n";
    }
    h2 = h2 + "</tr>\n";
  }

  //console.log(h2);

  var tableTail = ` 
  
</table>
`;
  //console.log(h2);
  table.innerHTML = h1 + h2 + tableTail;

  console.log("creando columnas con datos de tabla***************");
}

async function fetchData2(
  estacion,
  estacion2,
  yyyy1,
  yyyy2,
  selectVisualizacion,
  ctx
) {
  document.getElementById("tituloPrincipal").innerHTML =
    " Estacion: " +
    estacion +
    " Estacion2: " +
    estacion2 +
    " año inicial " +
    yyyy1 +
    " año final " +
    yyyy2 +
    " visualizacion " +
    selectVisualizacion;

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
      "/getdata3?yyyy1=" +
      yyyy1 +
      "&yyyy2=" +
      yyyy2 +
      "&estacion=" +
      estacion +
      "&estacion2=" +
      estacion2;
    //console.log(url);
    res = await fetch(url);
    this.data = await res.json();
    createTableColumns(this.data, [
      "estacion",
      "year",
      "mes",
      "dia",
      "lluvia",
      "zona_vida",
    ]);

    l = poblarFechas(data, "Historico");
    d1 = poblarEstaciones(data,  estacion, l,"Historico");
    d2 = poblarEstaciones(data,  estacion2, l,"Historico");
    this.labels = l;

    console.log("here is the new d1:");
    console.log(d1);
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
      "/getdataAVG3?yyyy1=" +
      yyyy1 +
      "&yyyy2=" +
      yyyy2 +
      "&estacion=" +
      estacion +
      "&estacion2=" +
      estacion2;

    res = await fetch(url);
    this.data = await res.json();
    createTableColumns(this.data, ["estacion", "year", "mes", "lluvia"]);

    l = poblarFechas(data, "Promedio");
    d1 = poblarEstaciones(data,  estacion, l,"Promedio");
    d2 = poblarEstaciones(data,  estacion2, l,"Promedio");
    console.log("new d1");
    console.log(d1);
    this.labels = l;

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
  document.getElementById("tituloPrincipal").innerHTML =
    " Estacion: " +
    estacion +
    " año inicial " +
    yyyy1 +
    " año final " +
    yyyy2 +
    " visualizacion " +
    selectVisualizacion;

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

$(document).ready(function () {
  var ctx = document.getElementById("canvas").getContext("2d");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  this.estacion = urlParams.get("selectEstacion");
  this.estacion2 = urlParams.get("selectEstacion2");
  this.yyyy1 = urlParams.get("selectYYYY1");
  this.yyyy2 = urlParams.get("selectYYYY2");
  this.selectVisualizacion = urlParams.get("selectVisualizacion");

  // document.getElementById("tituloPrincipal").innerHTML =
  //   "Estacion: " +
  //   this.estacion +
  //   " año inicial " +
  //   this.yyyy1 +
  //   " año final " +
  //   this.yyyy2 +
  //   " visualizacion " +
  //   this.selectVisualizacion;

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
