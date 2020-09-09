import { Component, ElementRef, ViewChild, Injectable } from "@angular/core";
import { loadModules } from "esri-loader";
import { HttpClient } from "@angular/common/http";

// ng build --prod --deploy-url "/clima/"    --aot --output-hashing=all
//https://github.com/angular/angular-cli/issues/1080

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
      "#7aa3e5",
      "#5AA454",
      "#E44D25",
      "#fcba03",
      "#a8385d",
      "#c242f5",
      "#5BA455",
      "#fdb113",
    ],
  };

  stations;
  years;
  months;
  dataStations;
  visualizacion = ["Promedio", "Historico"];
  datos = ["Lluvia", "Temperatura"];

  parms = { estacion: "", yyyy1: "", yyyy2: "", visualizacion: "", datos: "" };
  // map;
  // graphicsLayer;
  selectData;

  // Get a container link for map place
  @ViewChild("mapView", { static: true })
  private readonly mapViewElement: ElementRef;
  // main map view
  private mapView;

  title = "Clima Incyt";

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

  getMesNombre(numMes){
    for(var i = 0; i < this.months.length;i++){
      if (numMes === this.months[i].id)
        return this.months[i].mes;
    }
    return numMes;

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
        else this.chartGraphAVG(val);
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
    //console.log(this.parms);
    if (this.parms.visualizacion === "Historico")
      this.httpGetHistory(stamm + "/getdata");
    else this.httpGetHistory(stamm + "/getdataAVG");
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
    ]).then(([Map, MapView, Graphic, GraphicsLayer]) => {
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
        latitude: 14.0005930608889,
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

      var graphicA = new Graphic(); // graphic with line geometry
      var graphicB = new Graphic(); // graphic with point geometry
      var graphicC = new Graphic(); // graphic with polygon geometry
      var graphicD = new Graphic();
      var graphicE = new Graphic();

      // Add graphic when GraphicsLayer is constructed
      var layer = new GraphicsLayer({
        graphics: [pointGraphic],
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

  onSelect(data): void {
    //console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    //console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    //console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}
