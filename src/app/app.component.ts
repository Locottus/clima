import { Component, ElementRef, ViewChild, Injectable } from "@angular/core";
import { loadModules } from "esri-loader";
import { HttpClient } from "@angular/common/http";

//https://swimlane.github.io/ngx-charts/#/ngx-charts/line-chart
var stamm = "https://arcgis-web.url.edu.gt/incyt/api/clima";
//http://localhost:3004/incyt/api/clima/getdata?yyyy1=1979&yyyy2=1982&estacion=Alameda

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) {}
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  stations;
  years;
  months;
  dataStations;
  data;
  parms = { estacion: "", yyyy1: "", yyyy2: "" };
  // map;
  // graphicsLayer;
  selectData;

  //https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/vertical-bar-chart
  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 },
    { name: "service", value: 110000 },
  ];

  // Get a container link for map place
  @ViewChild("mapView", { static: true })
  private readonly mapViewElement: ElementRef;
  // main map view
  private mapView;

  title = "Clima Incyt";

  cargaEstacion() {
    console.log("carga estaciones");
    var select = document.getElementById("selectEstacion");
    console.log(this.stations);
    for (var i = 0; i < this.stations.length; i++) {
      var el = document.createElement("option");
      el.textContent = this.stations[i].estacion;
      el.value = this.stations[i].estacion;
      select.appendChild(el);
      
    }
    this.parms.estacion =   this.stations[0].estacion;
    
  }



  cargaFechas(opcion) {
    console.log("carga fechas");
    var objeto = "";
    if (opcion === 1) objeto = "selectyyyy1";
    if (opcion === 2) objeto = "selectmm1";
    if (opcion === 3) objeto = "selectyyyy2";
    if (opcion === 4) objeto = "selectmm2";

    var select = document.getElementById(objeto);
    if (opcion === 1) {
      for (var i = this.years.length - 1; i >= 0; i--) {
        var el = document.createElement("option");
        el.textContent = this.years[i].year;
        el.value = this.years[i].year;
        select.appendChild(el);
        
      }
      this.parms.yyyy1 =   this.years[this.years.length - 1].year;
    }
    if (opcion === 3) {
      for (var i = 0; i < this.years.length; i++) {
        var el = document.createElement("option");
        el.textContent = this.years[i].year;
        el.value = this.years[i].year;
        select.appendChild(el);
        
      }
      this.parms.yyyy2 =   this.years[0].year;
    }

    if (opcion === 2 || opcion === 4) {
      for (var i = 0; i < this.months.length; i++) {
        var el = document.createElement("option");
        el.textContent = this.months[i].mes;
        el.value = this.months[i].id;
        select.appendChild(el);
      }
    }
  }

  muestraPuntosEnMapa() {
    var point = {
      id: 0,
      type: "point",
      longitude: "",
      latitude: "",
    };

    var simpleMarkerSymbol = {
      type: "simple-marker",
      color: [255, 0, 0], // https://www.w3schools.com/colors/colors_picker.asp
      outline: {
        color: [255, 255, 255], // white
        width: 1,
      },
    };
  }

  //DUMMY FUNCTION GET
  httpGetFunctionOnInit(url, option) {
    this.http.get(url).subscribe(
      (val) => {
        console.log("GET call successful value returned in body", val);
        if (option === 1) {
          this.stations = val;
          this.cargaEstacion();
          this.muestraPuntosEnMapa();
        }

        if (option === 2) {
          this.years = val;
          this.cargaFechas(1);
          this.cargaFechas(3);
        }

        if (option === 3) {
          this.months = val;
          this.cargaFechas(2);
          this.cargaFechas(4);
        }
      },
      (response) => {
        console.log("GET call in error", response);
      },
      () => {
        console.log("The GET observable is now completed.");
      }
    );
  }


  chartGraph(val){
    
    var dataSerie = [];
    var serie;
    for(var i = 0; i < val.length; i++){
      var {id,estacion,longitud,latitud,zona_vida,year,mes,dia,lluvia,tmax,tmin,etp,bc} = val[i];
       serie = {
        "year":year,
        "mes":mes,
        "dia":dia,
        "lluvia":lluvia,
        "tmax":tmax,
        "tmin":tmin,
        "etp":etp,
        "bc":bc
      };
      
      dataSerie.push(serie);


    }
    console.log('*************************************');
    console.log(dataSerie);
    var data = [
      {
        "nombre": val[0].estacion,
        "zona_vida": val[0].zona_vida,
        "series": dataSerie
      }
    ]; 
    console.log(data);
  }

  //DUMMY FUNCTION GET
httpGetHistory(url) {
  //https://arcgis-web.url.edu.gt/incyt/api/clima/getdata?yyyy1=1979&yyyy2=1982&estacion=Alameda
  url = url + "?yyyy1=" + this.parms.yyyy1 + "&yyyy2=" + this.parms.yyyy2 + "&estacion=" + this.parms.estacion ;
  //console.log(url);
  this.http.get(url).subscribe(
    (val) => {
      console.log("GET call successful value returned in body", val);
      this.chartGraph(val);
    },
    (response) => {
      console.log("GET call in error", response);
    },
    () => {
      console.log("The GET observable is now completed.");
    }
  );
}

  onDataChanged() {
    console.log(this.parms);
    var url = stamm + "/getdata";
    this.httpGetHistory(url);
  }

  //DUMMY FUNCTION POST
  httpPostFunction(url) {
    this.http
      .post(url, {
        nombre: "herlich",
        telefono: "telefono",
        msg: "hola mundo!",
        email: "ich@gmail.com",
      })
      .subscribe(
        (val) => {
          console.log("POST call successful value returned in body", val);
        },
        (response) => {
          console.log("POST call in error", response);
        },
        () => {
          console.log("The POST observable is now completed.");
        }
      );
  }

  constructor(private http: HttpClient) {
    //Staadten detail Dienst addresse
    var url = stamm + "/getestaciones";
    this.httpGetFunctionOnInit(url, 1);

    url = stamm + "/getanios";
    this.httpGetFunctionOnInit(url, 2);
    // url = stamm + "/getmeses";
    // this.httpGetFunctionOnInit(url, 3);

    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
    ]).then(([Map, MapView,  Graphic, GraphicsLayer]) => {
      const mapProperties = {
        basemap: "topo",
      };
      // create map by default properties
      const map = new Map(mapProperties);
      // set default map view properties
      // container - element in html-template for locate map
      // zoom - default zoom parameter, value from 1 to 18
      const mapViewProperties = {
        container: this.mapViewElement.nativeElement,
        center: [-90.625, 15.6], //this is the center of the map
        zoom: 8, //zoom level
        map,
      };
      // create map view by default properties
      this.mapView = new MapView(mapViewProperties);
      
      
      
      var point = {
        type: "point",
        longitude: -90.80657463861,
        latitude: 14.0005930608889
      };

      var simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // orange
        outline: {
          color: [255, 255, 255], // white
          width: 1
        }
      };

      var pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol
      });
 
      
      var graphicA = new Graphic();  // graphic with line geometry
      var graphicB = new Graphic();  // graphic with point geometry
      var graphicC = new Graphic();  // graphic with polygon geometry
      var graphicD = new Graphic();
      var graphicE = new Graphic();

      // Add graphic when GraphicsLayer is constructed
  var layer = new GraphicsLayer({
    graphics: [pointGraphic]
  });

  // Add graphic to graphics collection
  layer.graphics.add(graphicB);

  // Add graphic using add()
  layer.add(graphicC);
  layer.addMany([graphicD, graphicE]);

  // Add GraphicsLayer to map
  map.add(layer);

    });
  }
}
