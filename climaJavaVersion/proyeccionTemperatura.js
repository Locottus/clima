console.log('TODO P(X) TEMPERATURA');
var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";

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


$(document).ready(function () {
    var ctx = document.getElementById("canvas").getContext("2d");
  
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.estacion = urlParams.get("selectEstacion");
    this.estacion2 = urlParams.get("selectEstacion2");
    this.yyyy1 = urlParams.get("selectYYYY1");
    this.yyyy2 = urlParams.get("selectYYYY2");
    this.selectVisualizacion = urlParams.get("selectVisualizacion");
  
  
    if (this.estacion2.length > 1) {
     
    } else {
      

    }
  });
  
  