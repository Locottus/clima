
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


async function fetchData(y,  x,  ctx) {
  
  console.log(y,x);
  //var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${y}&lon=${x}&appid=98674de6a91859bcea48ba07be964379&units=metric&lang=sp`;
  var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${y}&lon=${x}&appid=98674de6a91859bcea48ba07be964379&units=metric&lang=sp`;
  
  var res = await fetch(url);
  console.log(res);
  var data = await res.json();
  console.log(data);
  
  var titulo = "";
  var l = [];
  var d1 = [];
  var barChartData;

}


$(document).ready(function () {
  document.getElementById("tituloPrincipal").innerHTML ='Proyeccion de Clima';


  var ctx = document.getElementById("canvasTemperatura").getContext("2d");
  var ctx2 = document.getElementById("canvasLluvia").getContext("2d");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  this.y = urlParams.get("y");
  this.x = urlParams.get("x");


  //temperatura y lluvia
    fetchData(
      this.y,
      this.x,
      ctx
    );


});
