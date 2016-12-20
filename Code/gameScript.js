  var stage;
  var clickCounter = "#clickCounter";
  var clickValue = 1;
  var timeCookie = "time";
  var structureCookie = "structure";
  var clickCookie = "clicks";
  var clicks = 0;
  var structures = {};

function start(){
  clicks = parseInt(getCookie(clickCookie));
  console.log(clicks);
  if(isNaN(clicks)) clicks = 0;
  $(clickCounter).html(clicks);
  loadPhase('phase1');

  initializeStructures();

  stage = new createjs.Stage("mainCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
  circle.addEventListener("click", function(event) {clickFunction();});
  circle.x = stage.canvas.width/2;
  circle.y = stage.canvas.height/2;
  stage.addChild(circle);
  stage.update();
}

function loadPhase(phaseName){
  var client = new XMLHttpRequest();
  client.open('GET', phaseName+'.dat');
  client.onreadystatechange = function() {
    loadPhaseData(client.responseText);
  }
  client.send();
}

function loadPhaseData(phaseData){
  var structureInputArray = phaseData.split("\n");
  for(var i=0; i<structureInputArray.length; i++){
    structureInputArray[i] = structureInputArray[i].split(",");
  }
  for(var i=0; i<structureInputArray.length; i++){
    if(structureInputArray[i][0]=="")
      structureInputArray.splice(i,1);
  }
  structures = structureInputArray;
}

function clickFunction(){
  clicks += clickValue;
  $(clickCounter).html(clicks);
  saveCookie(clickCookie,clicks);
}

function saveGlobalState(){
  saveCookie(clickCookie,clicks);
  saveCookie(structureCookie,"XXXXXXXXXX");
  saveCookie(timeCookie,"TIME");
}

function initializeStructures(){
  if(structures,length<=0) return;
  for(var i =0; i<structures.length; i++){
    var html = "";//TODO
  }
}

function buildStructuresFromCookie(){
  var structureList = getCookie(structureCookie).split(",");
  for(var i =0; i< structureList.length; i++){
    var structure = structureList[i].split(":");
    var structureName = structure[0];
    var structureAmount = structure[1];
    buildStructure(structureName,structureAmount);
  }
}

function buildStructure(structureName,structureAmount){
  structures[structureName] = structureAmount;
}

function getCookie(key){
  var c = document.cookie.split(";");
  for(var i =0; i<c.length; i++){
    var cookie = c[i].split("=");
    if(cookie[0].indexOf(key)>=0) return cookie[1];
  }
}

function saveCookie(key, value){
  document.cookie = ""+key+"="+value;
}
