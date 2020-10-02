function cargaDepto() {
  var select = document.getElementById("selectDepartamento");
  //console.log(departamentos);
  for (var i = 0; i < departamentos.length; i++) {
    var el = document.createElement("option");
    el.textContent = departamentos[i].departamen_1;
    el.value = departamentos[i].departamen_1;
    select.appendChild(el);
  }
}

function clearSelect(select) {
  var length = select.options.length;
  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }
}

function cargaMuni() {
  var select = document.getElementById("selectMunicipio");
  clearSelect(select);
  // console.log("cargaMuni()");
  var d = document.getElementById("selectDepartamento");
  var dval = d.options[d.selectedIndex].value;
  // console.log(dval);
  for (var i = 0; i < municipios.length; i++) {
    if (municipios[i].departamen_1 === dval) {
      var el = document.createElement("option");
      el.textContent = municipios[i].municipi_1;
      el.value = municipios[i].municipi_1;
      select.appendChild(el);
    }
  }
}

function cargaNecesidad() {
  var select = document.getElementById("selectNecesidad");
  //console.log(departamentos);
  for (var i = 0; i < necesidad.length; i++) {
    var el = document.createElement("option");
    el.textContent = necesidad[i].descripcion;
    el.value = necesidad[i].descripcion;
    select.appendChild(el);
  }
}

function unhide(elemento) {
  document.getElementById(elemento).style.display = "block";
}

function hide(elemento) {
  document.getElementById(elemento).style.display = "none";
}

//anfang funktion
window.onload = function () {
  cargaNecesidad();
  cargaDepto();
};


function getMunicipioId(m){
  for(var i = 0; i < municipios.length; i++){
    if (m === municipios[i].municipi_1)
    return municipios[i].id;
  }
  return 0;
}

function getNecesidadId(n){
  for(var i = 0; i < necesidad.length; i++){
    if (n === necesidad[i].descripcion)
    return necesidad[i].id;
  }
  return 0;
}

function acurateLocation(){
  if (document.getElementById('checkLocation').checked === true){
    track.start();
    this.accuLocation = true;
   
  }else{
    track.stop();
    this.accuLocation = false;
  }
  
}

function reporteCubo1() {
  //var strValue = document.getElementById('txtboxId').value;
  var url = "cubo1.html?id=" + currentMunicipioId + '&municipio=' + currentMunicipio + '&departamento=' + currentDepartment ;
  myWindow = window.open(url, '', 'width=800,height=600,scrollbars=1');
  myWindow.focus();
}


function postData(){
    var mId = getMunicipioId(document.getElementById("selectMunicipio").value);
    var nId = getNecesidadId(document.getElementById("selectNecesidad").value);
    //console.log(mId + " " + nId);
    var src = 'Web Page';
    var url = stamm + "/createalerts";
    var template =  
      '{"id":"'  +           Date.now()  +  '",' +
      '"name":"'  +           document.getElementById("email").value +  '",' +
      '"screen_name":"'  +    document.getElementById("nombre").value +  '",' +
      '"retweet_count":"'  +  Date.now() +  '",' +
      '"text":"'  +           document.getElementById("txt").value.toString().replace("'"," ").replace('"'," ") +  '",' +
      '"location":["' + document.getElementById("selectDepartamento").value + '","' + document.getElementById("selectMunicipio").value + '"],' +
      '"coordinates":" [' + x.toString().replace(" ","") + "," + y.toString().replace(" ","") +"]"  + '",' +
      '"geo_enabled":"'  +      accuLocation  +  '",' +
      '"geo":"'  +      accuLocation  +  '",' +
      '"created_at":"'  +      Date.now() +  '",' +
      '"favorite_count":"'  +  Date.now() +  '",' +
      '"hashtags": ["' + document.getElementById("selectNecesidad").value + '"],' +
      '"status_count":"'  +  Date.now() +  '",' +
      '"place": ["' + document.getElementById("selectDepartamento").value + '","' +document.getElementById("selectMunicipio").value + '"],' +
      '"source":"'  +         src + '",' +
      '"locationId":"'  +     mId + '",' +
      '"necesidadId":"'  +    nId + '"}' ;

    console.log(template);
  
  if (document.getElementById("txt").value.length > 0 && document.getElementById("email").value.length > 0 && document.getElementById("nombre").value.length > 0){
    $.post(url, JSON.parse(template), function(response){ 
      if ("{'msg':'OK'}" === response){
        alert("La informacion ha sido enviada. " );
        document.getElementById("email").value = "";
        document.getElementById("nombre").value = "";
        document.getElementById("txt").value = "";
      }else
        alert ("hubo un error al enviar el mensaje, por favor intente despues");
        console.log(response);
    });
  }else
    alert("por favor llene todos los campos para reportar el alerta");
}
//https://stackoverflow.com/questions/6396101/pure-javascript-send-post-data-without-a-form