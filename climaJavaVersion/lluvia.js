var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";
//var stamm = "http://localhost:3000/incyt/api/sosguate";

var meses;
var estacion ;
var estacion2 ;
var yyyy1 ;
var yyyy2 ;
var selectVisualizacion ;

async function fetchData() {
  //MESES
  var res;
  res = await fetch(stamm + "/getmeses");
  this.meses = await res.json();

  //estaciones
  // res = await fetch(stamm + "/getestaciones");
  // this.estaciones = await res.json();

  //anios
  // res = await fetch(stamm + "/getanios");
  // this.anios = await res.json();

  //url = stamm  + "/getmunicipios";
  //url = stamm  + "/getdepartamentos";

  //console.log(estaciones);
  console.log(this.meses);
  // console.log(this.estaciones);
  // console.log(this.anios);

  
}


function reporte(id) {
    //console.log("entrando a generar reporte");
    //console.log(currentDepartment + ' ' + currentMunicipio + ' ' +currentMunicipioId);
  //https://github.com/chartjs/Chart.js
  
    var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";
//var stamm = "http://localhost:3000/incyt/api/sosguate";

    var url =
      stamm + "/getalertsdetailreport" +
      "?id=" + id;
  
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
  
    console.log(data)
    for (var i = 0; i < data.length; i++) {
      //console.log(data);
      var atributos = ({ fecha,text } = data[i]);
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.estacion = urlParams.get("selectEstacion");
    this.estacion2 = urlParams.get("selectEstacion2");
    this.yyyy1 = urlParams.get("selectYYYY1");
    this.yyyy2 = urlParams.get("selectYYYY2");
    this.selectVisualizacion = urlParams.get("selectVisualizacion");

    document.getElementById("tituloPrincipal").innerHTML = 'Estacion: ' + this.estacion + ' año inicial ' 
    + this.yyyy1 + ' año final ' + this.yyyy2 + ' visualizacion ' + this.selectVisualizacion ;

    fetchData();
  });


