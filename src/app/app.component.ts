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

  stations ;
  years ;
  months;
  dataStations;


  //https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/vertical-bar-chart
  saleData = [
    { name: "Mobiles", value: 105000 },
    { name: "Laptop", value: 55000 },
    { name: "AC", value: 15000 },
    { name: "Headset", value: 150000 },
    { name: "Fridge", value: 20000 },
    { name: "service", value: 110000 }
  ];


  // Get a container link for map place
  @ViewChild("mapView", { static: true })
  private readonly mapViewElement: ElementRef;
  // main map view
  private mapView;
  title = "ArcGIS angular map Template";

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
  }

  cargaFechas(opcion) {
    console.log("carga fechas");
    var objeto = "";
    if (opcion === 1) objeto = "selectyyyy1";
    if (opcion === 2) objeto = "selectmm1";
    if (opcion === 3) objeto = "selectyyyy2";
    if (opcion === 4) objeto = "selectmm2";

    var select = document.getElementById(objeto);
    if (opcion === 1 ) {
      for (var i = this.years.length - 1; i >= 0 ; i--) {
        var el = document.createElement("option");
        el.textContent = this.years[i].year;
        el.value = this.years[i].year;
        select.appendChild(el);
      }
    }
    if ( opcion === 3) {
      for (var i = 0 ; i < this.years.length ; i++) {
        var el = document.createElement("option");
        el.textContent = this.years[i].year;
        el.value = this.years[i].year;
        select.appendChild(el);
      }
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

  //DUMMY FUNCTION GET
  httpGetFunctionOnInit(url, option) {
    this.http.get(url).subscribe(
      (val) => {
        console.log("GET call successful value returned in body", val);
        if (option === 1) {
          this.stations = val;
          this.cargaEstacion();
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

        if (option === 4){
          //recibe los datos de las consultas
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

    // This function to load Dojo's require the classes listed in the array modules
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/MapImageLayer",
    ]).then(
      ([Map, MapView, MapImageLayer]: [
        __esri.MapConstructor,
        __esri.MapViewConstructor,
        __esri.MapImageLayerConstructor
      ]) => {
        // set default map properties

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

        // Set service properties
        // url - this address to MapServer from ArcGIS Enterprise
        // sublayers - this are the settings for the inner layers of the service.
        // id = 1 it tell us that will be displayed only one layer with the identifier
        const oilSandLayerProperties = {
          url:
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/OilSandsProjectBoundaries/MapServer",
          sublayers: [{ id: 1 }],
        };
        // Create map image layer by properties
        const oilSandsLayer = new MapImageLayer(oilSandLayerProperties);
        // Adding a layer into map
        map.add(oilSandsLayer);
      }
    );
  }
}
