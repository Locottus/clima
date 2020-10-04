function reporte(id) {
  //console.log("entrando a generar reporte");
  //console.log(currentDepartment + ' ' + currentMunicipio + ' ' +currentMunicipioId);


  var stamm = "https://arcgis-web.url.edu.gt/incyt/api/sosguate";
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

    /*if(isNaN(atributos.created_at)){
      console.log(atributos.created_at + " is not a number ");
      myDate = atributos.created_at;
     }else{
      console.log(atributos.created_at + " is a number ");
      myDate = new Date(1000 * atributos.created_at);
      console.log(myDate);
     }*/
    
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
  const id = urlParams.get("id");
  const municipio = urlParams.get("municipio");
  const departamento = urlParams.get("departamento");
  document.getElementById("tituloPrincipal").innerHTML =
    departamento + " " + municipio;
  //cargamos los datos detallados
  reporte(id);
});
