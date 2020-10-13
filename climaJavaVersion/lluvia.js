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

function download_csv() {
  var archivo = prompt(
    "Ingrese el nombre del archivo a salvar:",
    "archivo_datos.csv"
  );
  if (archivo == null || archivo == "") {
    console.log("User cancelled the prompt.");
  } else {
    //DOWNLOADING FILE
    archivo = archivo.replace(/ /g,'');//removing white spaces from file name
    if (archivo.toUpperCase().indexOf(".CSV") == -1){
      archivo = archivo + csv;
    }
    console.log(archivo);

    //here i create the csv.
    var data = [
      ["Foo", "programmer"],
      ["Bar", "bus driver"],
      ["Moo", "Reindeer Hunter"],
    ];

    var csv = "Name,Title\n";
    data.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });

    console.log(csv);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = archivo;//"people.csv";
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
    //console.log(url);
    res = await fetch(url);
    this.data = await res.json();
    console.log(Object.keys(res));
    createTableColumns(this.data, [
      "estacion1",
      "estacion2",
      "year",
      "mes",
      "dia",
      "lluvia1",
      "zona_vida1",
      "lluvia2",
      "zona_vida2",
    ]);

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
    //console.log(data);
    createTableColumns(this.data, [
      "estacion1",
      "estacion2",
      "year",
      "mes",
      "lluvia1",
      //"zona_vida1",
      "lluvia2",
      //"zona_vida2",
    ]);

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
