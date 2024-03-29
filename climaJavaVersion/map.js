var meses = [];
var estaciones = [];
var anios = [];
var clima = [];
var x = 0;
var y = 0;
var accuLocation = false;
//var visualizacion = ["Promedio", "Historico", "Proyeccion"];
var visualizacion = [ "Historico"];
//var datos = ["Lluvia", "Temperatura","ETP","BC"];
var datos = ["Lluvia", "Temperatura"];
var parms = {
  estacion: "",
  estacion2: "",
  yyyy1: "",
  yyyy2: "",
  visualizacion: "",
  datos: "",
};

var MapView;
var track;
var Point;
var Graphic;
var TextSymbol;
var SceneView;

var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";

function abrirPronostico() {
  var url =
    "clima.html?titulo=Clima" +
    "&y=" +
    this.y +
    "&x=" +
    this.x;

  myWindow = window.open(url, "", "scrollbars=1");
  myWindow.focus();

}

function abrirPronosticoWidget() {
  this.y = document.getElementById("latitud").innerHTML ;
  this.x = document.getElementById("longitud").innerHTML ;
  var url =
    "clima.html?titulo=Clima" +
    "&y=" +
    this.y +
    "&x=" +
    this.x;
  console.log(url);
  myWindow = window.open(url, "", "scrollbars=1");
  myWindow.focus();

}


function reportes() {
  //console.log("inicia reportes");
  var selectEstacion = document.getElementById("selectEstacion").value;
  var selectEstacion2 = document.getElementById("selectEstacion2").value;
  var selectYYYY1 = document.getElementById("selectYYYY1").value;
  var selectYYYY2 = document.getElementById("selectYYYY2").value;
  var selectVisualizacion = document.getElementById("selectVisualizacion").value;
  var selectDatos = document.getElementById("selectDatos").value;

  if (selectDatos === datos[0]) {
    //var visualizacion = ["Promedio", "Historico", "Proyeccion"];
    if (selectVisualizacion == visualizacion[2]) {

      var url =
        "proyeccionLluvia.html?titulo=Proyecciones" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;

      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();


    } else {
      var url =
        "lluvia.html?titulo=Historico de LLuvia" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;
      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();
    }
  } 
  else if (selectDatos === datos[1]) {
    if (selectVisualizacion == visualizacion[2]) {
      var url =
        "proyeccionTemperatura.html?titulo=Proyecciones" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;

      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();

    } else {

      var url =
        "temperatura.html?titulo=Historico de LLuvia" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;

      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();
    }
  }
  //etp
  else if (selectDatos === datos[2]){
    if (selectVisualizacion == visualizacion[2]) {

      var url =
        "proyeccionETP.html?titulo=Proyecciones" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;

      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();


    } else {
      var url =
        "etp.html?titulo=Historico de LLuvia" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;
      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();
    }

  }
  //bc
  else if (selectDatos === datos[3]){
    if (selectVisualizacion == visualizacion[2]) {

      var url =
        "proyeccionBC.html?titulo=Proyecciones" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;

      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();


    } else {
      var url =
        "bc.html?titulo=Historico de LLuvia" +
        "&selectEstacion=" +
        selectEstacion +
        "&selectEstacion2=" +
        selectEstacion2 +
        "&selectYYYY1=" +
        selectYYYY1 +
        "&selectYYYY2=" +
        selectYYYY2 +
        "&selectVisualizacion=" +
        selectVisualizacion;
      myWindow = window.open(url, "", "scrollbars=1");
      myWindow.focus();
    }

  }
}

function zoom2Map() {
  //alert('zooming');
  for (var i = 0; i < this.estaciones.length; i++) {
    if (
      this.estaciones[i].estacion ===
      document.getElementById("selectEstacion").value
    ) {
      this.parms.estacion = document.getElementById("selectEstacion").value;
      //console.log(this.estaciones[i].longitud, this.estaciones[i].latitud);
      //console.log(this.MapView);

      //showCoordinates(view.toMap({ x: 0, y: 0 }));
      this.MapView.zoom = 12;
      this.MapView.center = [
        this.estaciones[i].longitud,
        this.estaciones[i].latitud,
      ];
      break;
    }
  }
}

function unhide(elemento) {
  document.getElementById(elemento).style.display = "block";
}

function hide(elemento) {
  document.getElementById(elemento).style.display = "none";
}

/*function zoom2Map(){
  //alert('zooming');
  for (var i = 0; i < this.estaciones.length; i++){
      if (this.estaciones[i].estacion === document.getElementById('selectEstacion').value){
        this.parms.estacion = document.getElementById('selectEstacion').value;
        //this.mapView.center = [this.estaciones[i].longitud, this.estaciones[i].latitud];
        //this.mapView.zoom = 12;
        console.log(this.estaciones[i].longitud, this.estaciones[i].latitud);
        //this.MapView.centerAndZoom(new Point(this.estaciones[i].longitud, this.estaciones[i].latitud), 12);
        console.log(this.MapView);
        //console.log(Point);
        break;
      }
  }
}*/


async function fetchData() {



  //MESES
  var res;
  res = await fetch(stamm + "/getmeses");
  this.meses = await res.json();

  //estaciones
  res = await fetch(stamm + "/getestaciones");
  this.estaciones = await res.json();

  //anios
  res = await fetch(stamm + "/getanios");
  this.anios = await res.json();


  cargaFechas(2);
  cargaFechas(1);
  cargaEstacion("selectEstacion");
  cargaEstacion("selectEstacion2");
  cargaTipoReporte();
  cargaTipoDato();


  /*
  obtenerCoordenadas();
  var url = 'https://api.openweathermap.org/data/2.5/weather?APPID=98674de6a91859bcea48ba07be964379&lat='
    + this.y + '&lon=' + this.x + '&lang=sp&units=metric';
  console.log(url);

  var res = await fetch(url);
  this.clima = await res.json();
  graficaIconos();

*/
}

function cargaFechas(opcion) {
  //console.log("carga fechas");
  var objeto = "";
  if (opcion === 1) objeto = "selectYYYY1";
  if (opcion === 2) objeto = "selectYYYY2";

  var select = document.getElementById(objeto);
  if (opcion === 1) {
    for (var i = this.anios.length - 1; i >= 0; i--) {
      var el = document.createElement("option");
      el.textContent = this.anios[i].year;
      el.value = this.anios[i].year;
      select.appendChild(el);
    }
    this.parms.yyyy1 = this.anios[this.anios.length - 1];
  }
  if (opcion === 2) {
    for (var i = 0; i < this.anios.length; i++) {
      var el = document.createElement("option");
      el.textContent = this.anios[i].year;
      el.value = this.anios[i].year;
      select.appendChild(el);
    }
    this.parms.yyyy2 = this.anios[0].year;
  }
}

function cargaEstacion(s) {
  //console.log("carga estaciones");
  var select = document.getElementById(s);
  //console.log(this.stations);

  var el = document.createElement("option");
  el.textContent = " "; // this.estaciones[i].estacion;
  el.value = " "; //this.estaciones[i].estacion;
  select.appendChild(el);

  for (var i = 0; i < this.estaciones.length; i++) {
    var el = document.createElement("option");
    el.textContent = this.estaciones[i].estacion;
    el.value = this.estaciones[i].estacion;
    select.appendChild(el);
  }
  this.parms.estacion = this.estaciones[0].estacion;
}

function cargaTipoReporte() {
  var select = document.getElementById("selectVisualizacion");
  //console.log(this.stations);
  for (var i = 0; i < this.visualizacion.length; i++) {
    var el = document.createElement("option");
    el.textContent = this.visualizacion[i];
    el.value = this.visualizacion[i];
    select.appendChild(el);
  }
  this.parms.visualizacion = this.visualizacion[0];
}

function cargaTipoDato() {
  var select = document.getElementById("selectDatos");
  //console.log(this.stations);
  for (var i = 0; i < this.datos.length; i++) {
    var el = document.createElement("option");
    el.textContent = this.datos[i];
    el.value = this.datos[i];
    select.appendChild(el);
  }
  this.parms.datos = this.datos[0];
}

require([
  "esri/widgets/Track",
  "esri/views/MapView",
  "esri/Map",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/request",
  "esri/widgets/Popup",
  "esri/geometry/Point",
  "esri/views/SceneView",
  "esri/symbols/TextSymbol",
], function (
  Track,
  MapView,
  Map,
  Graphic,
  GraphicsLayer,
  esriRequest,
  Popup,
  Point,
  SceneView,
  TextSymbol
) {
  var map = new Map({
    basemap: "topo",
    //basemap: Additional basemap options are: satellite, hybrid, topo, gray, dark-gray, oceans, osm, national-geographic
    //https://community.esri.com/t5/arcgis-api-for-javascript-questions/adding-two-tiled-layers-to-the-map-javascript-api/td-p/357762
  });

  //this is hardcoded to Guatemalan centroid (approximate centroid)
  var view = new MapView({
    map: map,
    container: "viewDiv",
    center: [-90.625, 15.6],
    zoom: 8,
  });

  this.Point = Point;
  this.Graphic = Graphic;
  this.TextSymbol = TextSymbol;
  //punkte ansicht Karte Einstellungen
  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  function createPoint(id, longitude, latitude, atributos) {
    // Punkte Einstellungen
    var point = {
      id: id,
      type: "point",
      longitude: longitude,
      latitude: latitude,
    };

    var simpleMarkerSymbol = {
      type: "simple-marker",
      color: [0, 0, 0], // https://www.w3schools.com/colors/colors_picker.asp
      outline: {
        color: [255, 255, 255], // white
        width: 1,
      },
    };
    //https://developers.arcgis.com/javascript/latest/guide/display-point-line-and-polygon-graphics/
    var popupTemplate = {
      title: "Estacion Metereologica",
      content: atributos.estacion,
      image: "./estacion.JPG"
    };

    var pointGraphic = new Graphic({
      geometry: point,
      atributos: atributos,
      symbol: simpleMarkerSymbol,
      //popupTemplate: popupTemplate
    });

    graphicsLayer.add(pointGraphic);
  }

  // Define the 'options' for the request
  var options = {
    query: {
      f: "json",
    },
    responseType: "json",
  };

  //MAP ANSICHT
  var coordsWidget = document.createElement("div");
  coordsWidget.id = "coordsWidget";
  coordsWidget.className = "esri-widget esri-component";
  coordsWidget.style.padding = "7px 15px 5px";
  view.ui.add(coordsWidget, "bottom-right");

  //*** Update lat, lon, zoom and scale ***//
  function showCoordinates(pt) {
    var coords =
      "Lat/Lon " +
      pt.latitude.toFixed(3) +
      " " +
      pt.longitude.toFixed(3) +
      " | Scale 1:" +
      Math.round(view.scale * 1) / 1 +
      " | Zoom " +
      view.zoom;
    coordsWidget.innerHTML = coords;
    this.x = pt.longitude.toFixed(5);
    this.y = pt.latitude.toFixed(5);
    //console.log(this.x, this.y);
    //console.log(infoUser.browserName(),infoUser.latitude(), infoUser.longitude(),infoUser.altitude());
  }

  //*** Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
  view.watch(["stationary"], function () {
    showCoordinates(view.center);
  });

  view.on(["pointer-down", "pointer-move"], function (evt) {
    showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
  });

  view.on(["click"], function (evt) {
    view.hitTest(evt).then(getGraphics);
    console.log(view);
    /*
    async function getWeather(nombrePunto) {
      var url = 'https://api.openweathermap.org/data/2.5/weather?APPID=98674de6a91859bcea48ba07be964379&lat='
        + this.y + '&lon=' + this.x + '&lang=sp&units=metric';
      console.log(url);

      var res = await fetch(url);
      this.clima = await res.json();

      console.log(this.y, this.x);
      graficaIconos();

      
    }
*/

    function getGraphics(response) {

      if (response.results.length) {
        console.log("picked something");
        this.parms.estacion = response.results[0].graphic.atributos.estacion;
        document.getElementById("selectEstacion").value = this.parms.estacion;
        //getWeather(this.parms.estacion);
        console.log(this.parms.estacion);
      } else{
        //getWeather("");
      }
        
    }
  });
  // Create an instance of the Track widget
  // and add it to the view's UI
  this.track = new Track({
    view: view,
  });

  view.ui.add(track, "top-left");
  // The sample will start tracking your location
  // once the view becomes ready
  view.when(function () {
    //uncomment to start with current location on load
    //track.start();
  });

  function loadPoints(post) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (var i = 0; i < this.estaciones.length; i++) {
          var atributos = ({
            estacion,
            longitud,
            latitud,
            zona_vida,
          } = this.estaciones[i]);
          //console.log(atributos);
          createPoint(
            i + 1,
            this.estaciones[i].longitud,
            this.estaciones[i].latitud,
            atributos
          );
        }

        resolve();
      }, 5000);
    });
  }

  //this.SceneView =SceneView = MapView;

  loadPoints();
  this.MapView = MapView;
});

var dataClima =

{
  "coord": {
    "lon": -90.5249,
    "lat": 14.6342
  },
  "weather": [
    {
      "id": 803,
      "main": "Clouds",
      "description": "muy nuboso",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 20.82,
    "feels_like": 20.99,
    "temp_min": 20.82,
    "temp_max": 21.86,
    "pressure": 1022,
    "humidity": 78
  },
  "visibility": 10000,
  "wind": {
    "speed": 3.09,
    "deg": 200
  },
  "clouds": {
    "all": 75
  },
  "dt": 1629128150,
  "sys": {
    "type": 1,
    "id": 7079,
    "country": "GT",
    "sunrise": 1629114506,
    "sunset": 1629159868
  },
  "timezone": -21600,
  "id": 3598132,
  "name": "Guatemala City",
  "cod": 200
}
  ;



function graficaIconos() {
  //console.log('creando icono',daily);
  var dia = false;
  var icon = 'fa-sun';
  var colorIcon = 'black';

  var d = new Date();
  //fecha = d.toString();
  hora = d.getHours();

  var ld = ''
  //for (var i = 0; i < daily.length; i++) 
  {
    if (hora > 5 && hora < 19) {
      dia = true;
      //colorIcon = 'orange';

      if (this.clima["weather"][0].description.indexOf("clar") > -1)
        icon = 'fa-sun';
      if (this.clima["weather"][0].description.indexOf("nub") > -1)
        icon = 'fa-cloud-sun';
      if (this.clima["weather"][0].description.indexOf("lluvi") > -1)
        icon = 'fa-cloud-sun-rain';
    }

    else {
      dia = false;
      //colorIcon = 'steelblue';
      icon = 'fa-moon'
      if (this.clima["weather"][0].description.indexOf("nub") > -1)
        icon = 'fa-cloud-moon';
      if (this.clima["weather"][0].description.indexOf("lluvi") > -1)
        icon = 'fa-cloud-moon-rain';

    }
    var colTemplate = `  
      <i  class="fas fa-4x fa-align-center ${icon}" style="color:${colorIcon}"></i>
     `;
    //console.log(colTemplate);
    ld = ld + colTemplate;
  }
  document.getElementById("iconosClima").innerHTML = ld;

  //var clima = this.dataClima;
  console.log(this.clima);
  document.getElementById("name").innerHTML = ' ' + this.clima["name"].toUpperCase();
  document.getElementById("temp").innerHTML = ' ' + this.clima["main"].feels_like + '℃';
  document.getElementById("descripcion").innerHTML = ' ' + this.clima["weather"][0].description;
  document.getElementById("humedad").innerHTML = ' ' + this.clima["main"].humidity + '%';
  document.getElementById("maxTemp").innerHTML = ' ' + this.clima["main"].temp_max + '℃';
  document.getElementById("minTemp").innerHTML = ' ' + this.clima["main"].temp_min + '℃';
  document.getElementById("viento").innerHTML = ' ' + this.clima["wind"].speed + 'm/s';
  document.getElementById("nubes").innerHTML = ' ' + this.clima["clouds"].all + '%';

  document.getElementById("latitud").innerHTML = this.y;
  document.getElementById("longitud").innerHTML = this.x;
}

function obtenerCoordenadas() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.y = position.coords.latitude;
      this.x = position.coords.longitude;
      console.log(position.coords.latitude, position.coords.longitude);

    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

//run stuff

fetchData();
