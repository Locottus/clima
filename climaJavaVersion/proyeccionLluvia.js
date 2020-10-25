console.log('TODO P(X) LLUVIA');
var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";

// var ctxAbsoluta
// var ctxPorcentual
var meses;
var estacion;
var estacion2;
var yyyy1;
var yyyy2;
var selectVisualizacion;
var dataAbsoluto;
var dataPorcentual;
//graphs
var labels;
var datasetLluvia;
var color = Chart.helpers.color;

var campos;
var arreglo;


async function loadData(estacion){
  var res = await fetch(stamm + "/proyeccionAbsolutaAgua?estacion=" + estacion);
  this.dataAbsoluto = await res.json();
  console.log(this.dataAbsoluto);

  res = await fetch(stamm + "/proyeccionPorcentualAgua?estacion=" + estacion);
  this.dataPorcentual = await res.json();
  console.log(this.dataPorcentual);

  var lAbsoluta = [];
  var lPorcentual = [];

  var dataAbsoluta = [];
  var dataPorcentual = [];
  
  for (var i = 0; i < this.dataAbsoluto.length; i++) {
    lAbsoluta.push( this.dataAbsoluto[i].anio + "/" + this.dataAbsoluto[i].mes );
    dataAbsoluta.push(this.dataAbsoluto[i].proyeccion);
  }

  for (var i = 0; i < this.dataPorcentual.length; i++) {
    lPorcentual.push( this.dataPorcentual[i].anio + "/" + this.dataPorcentual[i].mes );
    dataPorcentual.push(this.dataPorcentual[i].proyeccion);
  }

  displayGraphics('Proyeccion de Datos Absolutos',lAbsoluta,dataAbsoluta,document.getElementById("canvasAbsoluta").getContext("2d"));
  displayGraphics('Proyeccion de Datos Porcentuales',lPorcentual,dataPorcentual,document.getElementById("canvasPorcentual").getContext("2d"));
}

function displayGraphics(titulo, labels,data,ctx){
  console.log(titulo);
  console.log(labels);
  console.log(data);
  console.log(ctx);

  barChartData = {
    labels: labels,
    datasets: [
      {
        label: titulo,
        backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
        borderColor: window.chartColors.red,
        borderWidth: 1,
        data: data,
      },
    ],
  };


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
    var data = [
      ["Foo", "programmer"],
      ["Bar", "bus driver"],
      ["Moo", "Reindeer Hunter"],
    ];
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


$(document).ready(function () {
     //this.ctxAbsoluta = document.getElementById("canvasAbsoluta").getContext("2d");
     //this.ctxPorcentual = document.getElementById("canvasPorcentual").getContext("2d");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.estacion = urlParams.get("selectEstacion");
    this.estacion2 = urlParams.get("selectEstacion2");
    this.yyyy1 = urlParams.get("selectYYYY1");
    this.yyyy2 = urlParams.get("selectYYYY2");
    this.selectVisualizacion = urlParams.get("selectVisualizacion");
  
    loadData(this.estacion);
 
  });
  
  