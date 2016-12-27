//Bookkeeping
  var stage;
  var clickCounter = "#clickCounter";
  var clickValue = 1;
  var clickPerSecond = 0;
  var timeCookie = "time";
  var structureCookie = "structure";
  var htmlConstructs = {};
  var initCounter =0;
  var lastUpdateTime =new Date().getTime();
  var clickCookie = "clicks";
  var clicks = 0;

  //Game Logic
  var structuresBought = {};
  var structures = {};
  var structuredInitialized = false;
  var ready = false;

function start(){
  clicks = parseInt(getCookie(clickCookie));
  if(isNaN(clicks)) clicks = 0;
  $(clickCounter).html(clicks);
  loadPhase('phase1');
  loadHtmlConstructs();

  stage = new createjs.Stage("mainCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
  circle.addEventListener("click", function(event) {clickFunction();});
  circle.x = stage.canvas.width/2;
  circle.y = stage.canvas.height/2;
  stage.addChild(circle);
  stage.update();
  var currentTimeCookie = getCookie(timeCookie);
  if(currentTimeCookie != undefined) lastUpdateTime = parseInt(currentTimeCookie);
  console.log(lastUpdateTime);
  update();
  window.setInterval(update,100);
}

function update(){
  if(!ready) return;
  var time = new Date().getTime();
  var timeDifference = time-lastUpdateTime;
  var seconds = timeDifference/1000;
  clicks+=seconds*clickPerSecond;
  $(clickCounter).html(clicks.toFixed(2));
  stage.update();
  lastUpdateTime = time
  saveCookie(clickCookie,clicks);
  saveCookie(timeCookie,lastUpdateTime);
}

function initReady(){
  initCounter++;
  if(initCounter>=2){
    //do init stuff
    initializeStructures();
    buildStructuresFromCookie();
    ready = true;
  }
}

function loadHtmlConstructs(){
  var client = new XMLHttpRequest();
  client.open('GET', 'htmlConstructs.txt');
  client.onload = function() {
    constructs = client.responseText.split(";;");
    for(var i =0; i<constructs.length-1; i++){
      splitConstruct = constructs[i].split("::");
      htmlConstructs[splitConstruct[0]] = splitConstruct[1];
    }
    initReady();
  }
  client.send();
}

function loadPhase(phaseName){
  var client = new XMLHttpRequest();
  client.open('GET', phaseName+'.dat');
  client.onload = function() {
    loadPhaseData(client.responseText);
    initReady();
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
  $(clickCounter).html(clicks.toFixed(2));
  saveCookie(clickCookie,clicks);
}

function saveGlobalState(){
  saveCookie(clickCookie,clicks);
  saveCookie(structureCookie,"XXXXXXXXXX");
  saveCookie(timeCookie,"TIME");
}

function initializeStructures(){
  if(structures.length<=0) return;
  if(structuredInitialized) return;
  structuredInitialized = true;
  for(var i =0; i<structures.length; i++){
    var html = htmlConstructs["shopElement"];
    html = html.replace("ELEMENTNAME",structures[i][1]);
    html = html.replace("ELEMENTPRICE",structures[i][2]);
    html = html.replace("ELEMENTCLICKS",structures[i][3]);
    html = html.replace("ELEMENTINDEX",""+i);
    $("#structureShop").append(html);
  }
}

function buyStructure(index){
  buildStructure(structures[index][0],1);
  pay(structures[index][2]);
}

function pay(amount){
  clicks -= amount;
}

function earn(amount){
  //TODO
}

function buildStructuresFromCookie(){
  var cookie = getCookie(structureCookie);
  if(cookie == undefined){
    cookie = "";
    return;
  }
  var structureList = cookie.split(",");
  for(var i =0; i< structureList.length; i++){
    var structure = structureList[i].split(":");
    var structureId = structure[0];
    var structureAmount = structure[1];
    buildStructure(structureId,structureAmount);
  }
}

function buildStructure(structureId,structureAmount){
  if(structuresBought[structureId]==null) structuresBought[structureId]=parseInt(structureAmount);
  else structuresBought[structureId] += structureAmount;

  var newClickPerSecond = 0;
  var newCookie = "";

  for(var key in structuresBought){
    var id = key;
    var amount = structuresBought[key];
    newCookie += ""+id+":"+amount+",";
    for(var i =0; i<structures.length; i++){
      if(structures[i][0]==id){
        newClickPerSecond += amount*structures[i][3];
        break;
      }
    }
  }
  clickPerSecond = newClickPerSecond;
  saveCookie(structureCookie,newCookie);
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
