var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";
//var stamm = "http://localhost:3000/incyt/api/sosguate";

var meses;
var estacion;
var estacion2;
var yyyy1;
var yyyy2;
var selectVisualizacion;
var data;
var data2;
//graphs

var color = Chart.helpers.color;

var campos;
var arreglo;


function createFile(){
  console.log('saving file');
  
}

function createTableColumns(arreglo, campos) {
  this.arreglo = arreglo;
  this.campos =campos;
  console.log("creando columnas con datos de tabla***************");
  console.log(this.arreglo);
  console.log(this.campos);

  var table = document.getElementById("tableInfo");
  var h1 = "\n<tr>\n";
  for (var i = 0; i < campos.length; i++) {
    h1 = h1 + " <th>" + campos[i] + "</th> \n";
  }

  h1 = h1 +  "\n</tr>\n";
  //console.log(h1 );

  var h2 = "";
  for (var i = 0; i < data.length; i++) {
    h2 = h2 +  "<tr>\n";
    for(var j = 0; j < campos.length; j++){
      h2 = h2 + " <td>" + data[i][campos[j]] + "</td>\n";
    }
    h2 = h2 + "</tr>\n"
  }
  
  //console.log(h2);
  

  var tableTail = ` 
  
</table>
`;
  console.log(h2);
  table.innerHTML = h1 + h2  + tableTail;

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
  var tmax1 = [];
  var tmin1 = [];
  var tavg1 = [];
  var tmax2 = [];
  var tmin2 = [];
  var tavg2 = [];

  var barChartData;

  //https://arcgis-web.url.edu.gt/incyt/api/clima/getdata?yyyy1=1979&yyyy2=1982&estacion=Alameda
  console.log(selectVisualizacion);
  if (selectVisualizacion === "Historico") {
    titulo =
      "Historico de temperatura comparativo " + estacion + " " + estacion2;
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
    createTableColumns(this.data,["estacion1","estacion2","year","mes","dia","tmax1","tMin1","tMax2","tMin2","zona_vida1","zona_vida2"]);

    for (var i = 0; i < this.data.length; i++) {
      l.push(
        this.data[i].year + "/" + this.data[i].mes + "/" + this.data[i].dia
      );
      tmax1.push(this.data[i].tmax1);
      tmin1.push(this.data[i].tmin1);
      //tavg1.push(this.data[i].tPromedio1)
      tmax2.push(this.data[i].tmax2);
      tmin2.push(this.data[i].tmin2);
      //tavg2.push(this.data[i].tPromedio2)
    }
    this.labels = l;
    //this.datasetLluvia = d1;
    //console.log(this.labels);
    //console.log(this.datasetLluvia);

    barChartData = {
      labels: labels,
      datasets: [
        {
          label: "Temperatura Maxima " + estacion,
          //backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: tmax1,
        },
        {
          label: "Temperatura Minima " + estacion,
          //backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
          borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: tmin1,
        },

        {
          label: "Temperatura Maxima " + estacion2,
          //backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
          borderColor: window.chartColors.green,
          borderWidth: 1,
          data: tmax2,
        },
        {
          label: "Temperatura Minima " + estacion2,
          //backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
          borderColor: window.chartColors.yellow,
          borderWidth: 1,
          data: tmin2,
        },
      ],
    };
    console.log(barChartData);
  } else if (selectVisualizacion === "Promedio") {
    titulo =
      "Promedio de temperatura comparativo " + estacion + " " + estacion2;
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

    //console.log(url);
    res = await fetch(url);
    this.data = await res.json();
    createTableColumns(this.data,["estacion1","estacion2","year","mes","tmax1","tmin1","tPromedio1","tmax2","tmin2","tPromedio2"]);
    for (var i = 0; i < this.data.length; i++) {
      l.push(this.data[i].year + "/" + this.data[i].mes);
      tmax1.push(this.data[i].tmax1);
      tmin1.push(this.data[i].tmin1);
      tavg1.push(this.data[i].tPromedio1);
      tmax2.push(this.data[i].tmax2);
      tmin2.push(this.data[i].tmin2);
      tavg2.push(this.data[i].tPromedio2);
    }
    this.labels = l;
    //this.datasetLluvia = d1;
    console.log(this.labels);
    //console.log(this.datasetLluvia);

    barChartData = {
      labels: labels,
      datasets: [
        {
          label: "Temperatura Maxima " + estacion,
          //backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: tmax1,
        },
        {
          label: "Temperatura Minima " + estacion,
          //backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
          borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: tmin1,
        },
        {
          label: "Temperatura Promedio " + estacion,
          //backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
          borderColor: window.chartColors.green,
          borderWidth: 1,
          data: tavg1,
        },

        {
          label: "Temperatura Maxima " + estacion2,
          //backgroundColor: color(window.chartColors.yellow).alpha(0.5).rgbString(),
          borderColor: window.chartColors.yellow,
          borderWidth: 1,
          data: tmax2,
        },
        {
          label: "Temperatura Minima " + estacion2,
          //backgroundColor: color(window.chartColors.orange).alpha(0.5).rgbString(),
          borderColor: window.chartColors.orange,
          borderWidth: 1,
          data: tmin2,
        },
        {
          label: "Temperatura Promedio " + estacion2,
          //backgroundColor: color(window.chartColors.black).alpha(0.5).rgbString(),
          borderColor: window.chartColors.black,
          borderWidth: 1,
          data: tavg2,
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
    type: "line",
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
  res = await fetch(stamm + "/getmeses");
  this.meses = await res.json();
  var titulo = "";
  var l = [];
  var d1 = [];
  var d2 = [];
  var d3 = [];
  var barChartData;

  //https://arcgis-web.url.edu.gt/incyt/api/clima/getdata?yyyy1=1979&yyyy2=1982&estacion=Alameda
  console.log(selectVisualizacion);
  if (selectVisualizacion === "Historico") {
    titulo = "Historico de Temperatura";
    var url =
      stamm +
      "/getdata?yyyy1=" +
      yyyy1 +
      "&yyyy2=" +
      yyyy2 +
      "&estacion=" +
      estacion;
    //console.log(url);
    res = await fetch(url);
    this.data = await res.json();
    createTableColumns(this.data,["estacion","year","mes","dia","tmax","tmin","zona_vida"]);

    for (var i = 0; i < this.data.length; i++) {
      l.push(
        this.data[i].year + "/" + this.data[i].mes + "/" + this.data[i].dia
      );
      d1.push(this.data[i].tmax);
      d2.push(this.data[i].tmin);
    }

    barChartData = {
      labels: l,
      datasets: [
        {
          label: "temperatura maxima",
          //backgroundColor: window.chartColors.red,
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: d1,
        },
        {
          label: "temperatura minima",
          //backgroundColor: window.chartColors.blue,
          borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: d2,
        },
      ],
    };
    console.log(barChartData);
  } else if (selectVisualizacion === "Promedio") {
    titulo = "Promedio de Temperatura";
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
    createTableColumns(this.data,["estacion","year","mes","tmax","tmin","tPromedio"]);

    for (var i = 0; i < this.data.length; i++) {
      l.push(this.data[i].year + "/" + this.data[i].mes);
      d1.push(this.data[i].tmax);
      d2.push(this.data[i].tmin);
      d3.push(this.data[i].tPromedio);
    }

    barChartData = {
      labels: l,
      datasets: [
        {
          label: "temperatura maxima",
          //backgroundColor: window.chartColors.red,
          borderColor: window.chartColors.red,
          borderWidth: 1,
          data: d1,
        },
        {
          label: "temperatura minima",
          //backgroundColor: window.chartColors.blue,
          borderColor: window.chartColors.blue,
          borderWidth: 1,
          data: d2,
        },
        {
          label: "temperatura promedio",
          //backgroundColor: window.chartColors.black,
          borderColor: window.chartColors.green,
          borderWidth: 1,
          data: d3,
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
    type: "line",
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
