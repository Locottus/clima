import { Component, ElementRef, ViewChild, Injectable } from "@angular/core";
import { loadModules } from "esri-loader";
import { HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";


// ng build --prod --deploy-url "/clima/"    --aot --output-hashing=all
//https://github.com/angular/angular-cli/issues/1080
//https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical
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
  multi = [];
  track;
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = "Fecha";
  yAxisLabel: string = "Historico por Caterogira";
  timeline: boolean = true;

  colorScheme = {
    domain: [
      "#5AA454",
      "#E44D25",
      "#fcba03",
      "#a8385d",
      "#7aa3e5",
      "#c242f5",
      "#5BA455",
      "#fdb113",
    ],
  };

  stations;
  years;
  months;
  dataStations;
  visualizacion = ["Promedio", "Historico", "Proyeccion"];
  datos = ["Lluvia", "Temperatura"];

  parms = { estacion: "", yyyy1: "", yyyy2: "", visualizacion: "", datos: "" };
  // map;
  // graphicsLayer;
  selectData;

  // Get a container link for map place
  @ViewChild("mapView", { static: true })
  private readonly mapViewElement: ElementRef;
  // main map view
  mapView;
  Graphic;
  scene;

  title = "Clima Incyt";

  localizaEstacion() {
    //console.log("estacion seleccionada:", this.parms.estacion);
    var estacion_seleccionada = 0;
    var long, lat;
    for (var i = 0; i < this.stations.length; i++) {
      //console.log(this.stations[i]);
      if (this.stations[i].estacion === this.parms.estacion) {
        estacion_seleccionada = i;
        long = this.stations[i].longitud;
        lat = this.stations[i].latitud;
        break;
      }
    }

    //console.log("*******************************", estacion_seleccionada);

    var point = {
      type: "point",
      longitude: long,
      latitude: lat,
    };
    //https://gis.stackexchange.com/questions/115481/how-to-set-center-of-map-in-arcgis-api-for-javascript-using-lat-long
    this.mapView.center = [long, lat];
    this.mapView.zoom = 12;
  }
  cargaTipoReporte() {
    var select = document.getElementById("sVisualizacion");
    //console.log(this.stations);
    for (var i = 0; i < this.visualizacion.length; i++) {
      var el = document.createElement("option");
      el.textContent = this.visualizacion[i];
      el.value = this.visualizacion[i];
      select.appendChild(el);
    }
    this.parms.visualizacion = this.visualizacion[0];
  }

  cargaTipoDato() {
    var select = document.getElementById("sDatos");
    //console.log(this.stations);
    for (var i = 0; i < this.datos.length; i++) {
      var el = document.createElement("option");
      el.textContent = this.datos[i];
      el.value = this.datos[i];
      select.appendChild(el);
    }
    this.parms.datos = this.datos[0];
  }

  cargaEstacion() {
    //console.log("carga estaciones");
    var select = document.getElementById("selectEstacion");
    //console.log(this.stations);
    for (var i = 0; i < this.stations.length; i++) {
      var el = document.createElement("option");
      el.textContent = this.stations[i].estacion;
      el.value = this.stations[i].estacion;
      select.appendChild(el);
    }
    this.parms.estacion = this.stations[0].estacion;
    this.cargaTipoReporte();
    this.cargaTipoDato();
  }

  cargaFechas(opcion) {
    //console.log("carga fechas");
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
      this.parms.yyyy1 = this.years[this.years.length - 1].year;
    }
    if (opcion === 3) {
      for (var i = 0; i < this.years.length; i++) {
        var el = document.createElement("option");
        el.textContent = this.years[i].year;
        el.value = this.years[i].year;
        select.appendChild(el);
      }
      this.parms.yyyy2 = this.years[0].year;
    }

    if (opcion === 2 || opcion === 4) {
      /*for (var i = 0; i < this.months.length; i++) {
        var el = document.createElement("option");
        el.textContent = this.months[i].mes;
        el.value = this.months[i].id;
        select.appendChild(el);
      }*/
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

  chartGraph(val) {
    var dataSerieLluvia = [],
      dataSerieTmax = [],
      dataSerieTmin = [],
      dataEtp = [],
      dataBc = [];
    var sLluvia, sTmax, sTmin, sEtp, sBc;
    for (var i = 0; i < val.length; i++) {
      var {
        id,
        estacion,
        longitud,
        latitud,
        zona_vida,
        year,
        mes,
        dia,
        lluvia,
        tmax,
        tmin,
        etp,
        bc,
      } = val[i];

      //fixing values
      lluvia = lluvia === "-99.9" ? "0" : lluvia;
      tmax = tmax === "-99.9" ? "0" : tmax;
      tmin = tmin === "-99.9" ? "0" : tmin;
      etp = etp === "-99.9" ? "0" : etp;
      bc = bc === "-99.9" ? "0" : bc;

      sLluvia = {
        name: dia + "/" + mes + "/" + year,
        //mes: mes,
        //dia: dia,
        value: lluvia,
      };

      sTmax = {
        name: dia + "/" + mes + "/" + year,
        //mes: mes,
        //dia: dia,
        value: tmax,
      };

      sTmin = {
        name: dia + "/" + mes + "/" + year,
        //mes: mes,
        //dia: dia,
        value: tmin,
      };

      sEtp = {
        name: dia + "/" + mes + "/" + year,
        //mes: mes,
        //dia: dia,
        value: etp,
      };

      sBc = {
        name: dia + "/" + mes + "/" + year,
        //mes: mes,
        //dia: dia,
        value: bc,
      };

      dataSerieLluvia.push(sLluvia);
      dataSerieTmax.push(sTmax);
      dataSerieTmin.push(sTmin);
      dataEtp.push(sEtp);
      dataBc.push(sBc);
    }
    if (this.parms.datos === "Lluvia") {
      var data = [
        {
          name: "Lluvia",
          series: dataSerieLluvia,
        },
        /*{
          name: "T. Maxima",
          series: dataSerieTmax,
        },
        {
          name: "T. Minima",
          series: dataSerieTmin,
        },
        {
          name: "ETP",
          series: dataEtp,
        },
        {
          name: "BC",
          series: dataBc,
        },*/
      ];
      //console.log(data);
      this.multi = data;
    } else if (this.parms.datos === "Temperatura") {
      var data = [
        {
          name: "T. Maxima",
          series: dataSerieTmax,
        },
        {
          name: "T. Minima",
          series: dataSerieTmin,
        },
      ];
      //console.log(data);
      this.multi = data;
    }
  }

  getMesNombre(numMes) {
    for (var i = 0; i < this.months.length; i++) {
      if (numMes === this.months[i].id) return this.months[i].mes;
    }
    return numMes;
  }

  chartGraphProyeccion(val) {
    console.log("proyeccion");
  }

  chartGraphAVG(val) {
    var dataSerieLluvia = [],
      dataSerieTmax = [],
      dataSerieTmin = [],
      dataEtp = [],
      dataBc = [],
      dataTP = [];
    var sLluvia, sTmax, sTmin, sEtp, sBc, tP;
    //console.log(val);

    for (var i = 0; i < val.length; i++) {
      var { estacion, year, mes, lluvia, tmax, tmin, etp, bc, tPromedio } = val[
        i
      ];

      //fixing values
      lluvia = lluvia === "-99.9" ? "0" : lluvia;
      tmax = tmax === "-99.9" ? "0" : tmax;
      tmin = tmin === "-99.9" ? "0" : tmin;
      etp = etp === "-99.9" ? "0" : etp;
      bc = bc === "-99.9" ? "0" : bc;
      tPromedio = tPromedio === "-99.9" ? "0" : tPromedio;
      sLluvia = {
        name: mes + "/" + year,
        value: lluvia,
      };
      //mes = this.getMesNombre(mes);
      sTmax = {
        name: mes + "/" + year,
        value: tmax,
      };

      sTmin = {
        name: mes + "/" + year,
        value: tmin,
      };

      sEtp = {
        name: mes + "/" + year,
        value: etp,
      };

      sBc = {
        name: mes + "/" + year,
        value: bc,
      };

      tP = {
        name: mes + "/" + year,
        value: tPromedio,
      };

      dataSerieLluvia.push(sLluvia);
      dataSerieTmax.push(sTmax);
      dataSerieTmin.push(sTmin);
      dataEtp.push(sEtp);
      dataBc.push(sBc);
      dataTP.push(tP);
    }
    if (this.parms.datos === "Lluvia") {
      var data = [
        {
          name: "Lluvia",
          series: dataSerieLluvia,
        },
      ];

      this.multi = data;
    } else if (this.parms.datos === "Temperatura") {
      var data = [
        {
          name: "T. Maxima",
          series: dataSerieTmax,
        },
        {
          name: "T. Minima",
          series: dataSerieTmin,
        },
        {
          name: "T. Promedio",
          series: dataTP,
        },
      ];
      this.multi = data;
    }
  }

  //DUMMY FUNCTION GET
  httpGetHistory(url) {
    //https://arcgis-web.url.edu.gt/incyt/api/clima/getdata?yyyy1=1979&yyyy2=1982&estacion=Alameda
    url =
      url +
      "?yyyy1=" +
      this.parms.yyyy1 +
      "&yyyy2=" +
      this.parms.yyyy2 +
      "&estacion=" +
      this.parms.estacion;
    //console.log(url);
    this.http.get(url).subscribe(
      (val) => {
        console.log("GET call successful value returned in body", val);
        //this.stations[0].estacion

        if (this.parms.visualizacion === "Historico") this.chartGraph(val);
        else if (this.parms.visualizacion === "Promedio")
          this.chartGraphAVG(val);
        else if (this.parms.visualizacion === "Proyeccion") {
          this.chartGraphProyeccion(val);
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

   onDataChanged() {
    console.log(this.parms);
    if (this.parms.visualizacion === "Historico")
      this.httpGetHistory(stamm + "/getdata");
    else this.httpGetHistory(stamm + "/getdataAVG");

    //this.toastMessage("hi","jo")
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

  constructor(private http: HttpClient, private toastr: ToastrService) {
    //this.cargaTipoReporte();

    //Staadten detail Dienst addresse
    var url = stamm + "/getestaciones";
    this.httpGetFunctionOnInit(url, 1);

    url = stamm + "/getanios";
    this.httpGetFunctionOnInit(url, 2);
    url = stamm + "/getmeses";
    this.httpGetFunctionOnInit(url, 3);

    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/Graphic",
      "esri/layers/GraphicsLayer",
      "esri/widgets/Track",
      "esri/request",
      "esri/views/SceneView",
    ]).then(
      ([
        Map,
        MapView,
        Graphic,
        GraphicsLayer,
        Track,
        esriRequest,
        SceneView,
      ]) => {
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

        setTimeout(() => {
          for (var i = 0; i < this.stations.length; i++) {
            //console.log(this.stations[i]);

            var point = {
              type: "point",
              longitude: this.stations[i].longitud,
              latitude: this.stations[i].latitud,
            };

            var simpleMarkerSymbol = {
              type: "simple-marker",
              color: [226, 119, 40], // orange
              outline: {
                color: [255, 255, 255], // white
                width: 1,
              },
            };

            var pointGraphic = new Graphic({
              geometry: point,
              symbol: simpleMarkerSymbol,
            });
            this.Graphic = Graphic;

            // Add graphic when GraphicsLayer is constructed
            var layer = new GraphicsLayer({
              graphics: [pointGraphic],
              atributos: this.stations[i].estacion,
            });

            map.add(layer);
          }

          //console.log("delay stopped@@@@@@@");
        }, 5000);

        var scene = this.mapView;
        scene.on("click", function (event) {
          scene.hitTest(event).then(function (response) {
            // do something with the result graphic
            var graphic = response.results[0].graphic;
            console.log(graphic.layer.atributos);
            alert("estacion: " + graphic.layer.atributos);

            //this.toastMessage("estacion: " + graphic.layer.atributos);
            
          });
        });
        this.scene = scene;
        // Create an instance of the Track widget
        // and add it to the view's UI
        this.track = new Track({
          view: this.mapView,
        });

        this.mapView.ui.add(this.track, "top-left");
        // The sample will start tracking your location
        // once the view becomes ready
        this.mapView.when(function () {
          //uncomment to start with current location on load
          //track.start();
        });
      }
    );
  }

  onSelect(data): void {
    //console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    //console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    //console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }

  toastMessage(header, message) {
    //https://www.npmjs.com/package/ngx-toastr
    this.toastr.success(header, message);
  }
}

/*
https://www.youtube.com/watch?v=K5vTytWq2Sc

create table proyeccion_porcentual(
	id serial,
	estacion text not null,
	longitud numeric not null,
	latitud numeric not null,
	zona_vida text not null,
	year numeric,
	mes numeric NOT NULL,
    dia numeric NOT NULL,
    lluvia numeric NOT NULL,
    tmax numeric NOT NULL,
    tmin numeric NOT NULL,
    etp numeric NOT NULL,
    bc numeric NOT NULL
    
);

*/
