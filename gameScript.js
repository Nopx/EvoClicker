  var stage;
  var clickCounter = "#clickCounter";
  var clickValue = 1;
  var timeCookie = "time";
  var structureCookie = "structure";
  var clickCookie = "clicks";
  var clicks = 0;


function start(){
  clicks = parseInt(getCookie(clickCookie));
  console.log(clicks);
  if(isNaN(clicks)) clicks = 0;
  $(clickCounter).html(clicks);

  stage = new createjs.Stage("demoCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
  circle.addEventListener("click", function(event) {clickFunction();});
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  stage.update();
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
