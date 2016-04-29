
var totalTime = 60000; //(8 * 60 * 1000); //8 minutes
var numCols = 12;
var numRows = 12;
var textures = new Array(5);

var parent = new THREE.Object3D();
var grainsArr = new Array(); //to hold all grains, regardless of where they are in the scene graph

function grains() {
  return grainsArr;
}

function secondsToPerc(sec) {

  return (sec * 1000) / totalTime;

}

function makeGrains(cols, rows, scene, tex0, blur, vs, fs) {

  scene.add( parent );

  var xinc; 
  var yinc;
  var uinc;
  var vinc;

  xinc = 2.0 / (cols-1);
  uinc = 1.0 / (cols);
  yinc = 2.0 / (rows-1);
  vinc = 1.0 / (rows);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {

      var xpos = -1.0 + (xinc * i);
      var ypos = -1.0 + (yinc * j);

      //  console.log("xpos / ypos = " + xpos + " / " + ypos);
      var uoff = uinc * i;
      var voff = vinc * j;

      var geometry = new THREE.PlaneGeometry( xinc/1.0, yinc/1.0, 1 );

      var material = new THREE.ShaderMaterial({
        uniforms: {
          time: { type: "f", value: 1.0 },
          my_color: {type: "v4", value: new THREE.Vector4(0.0,0.0,0.0,1.0)},
          tex0: {type: 't', value: tex0},
          texBlur: {type: 't', value: blur},
          blurOff:  {type: "f", value: 0.15 }, //should be a small value, between -1.0 (tiny points) and always less than 0.5 (no blur at all)
          uOff: {type: "f", value: uoff },
          vOff: {type: "f", value: voff },
          uvScale: {type: "f", value: cols }, //i.e. if there are 4 cells, then the width and height are both cut in half = 2.0; if there are 16, then they are cut in quarters = 4.0
        },
          vertexShader: vs,
          fragmentShader: fs,
          transparent: true
      });
      material.side = THREE.DoubleSide;

      var mesh = new THREE.Mesh( geometry, material );
      mesh.translateX(xpos);
      mesh.translateY(ypos);

      parent.add( mesh );
      grainsArr.push( mesh ); //add to global list of all grains, regardless of where in scene graph

    }
  }
}


function getOffsetsForIndexB(g, scale = 1.0, rs, cs) {

  var gX = Math.floor(g/cs);
  var gY = g%cs;

  var length = 2.0 * scale;

  var xinc = (length*1.0)/(cs-1);
  var yinc = (length*1.0)/(rs-1);
  var offX = -length/2.0 + xinc*gX;
  var offY = -length/2.0 + yinc*gY;

  var offs = {x:offX, y:offY};
  return offs;
}

function getOffsetsForIndex(g, scale = 1.0) {

  var gX = Math.floor(g/numCols);
  var gY = g%numCols;

  var length = 2.0 * scale;

  var xinc = (length*1.0)/(numCols-1);
  var yinc = (length*1.0)/(numRows-1);
  var offX = -length/2.0 + xinc*gX;
  var offY = -length/2.0 + yinc*gY;

  var offs = {x:offX, y:offY};
  return offs;
}


function setupTimeline(scene, stages, briefDelay, totalTime) {

  for (var i = 0; i < stages.length; i++) {
    var beginTime = stages[i].timing.s * totalTime;
    var lengthOfTime = (stages[i].timing.e - stages[i].timing.s) * totalTime;
    stages[i].action(briefDelay + beginTime, lengthOfTime);
  }

}

/*
   function setupTimeline(scene, stages, totalTime) {

   var timing = { nowPerc: 0.0 };

   var tween = new TWEEN.Tween(timing)
   .to( {nowPerc:1.0}, totalTime)
   .onUpdate(function() {




   for (var i = 0; i < stages.length; i++) {
   if (stages[i].started == false && timing.nowPerc >= stages[i].timing.s) {
   stages[i].started = true;
   var lengthOfTime = (stages[i].timing.e - stages[i].timing.s) * totalTime;
   stages[i].action(lengthOfTime);        
   } else if (stages[i].started == true && timing.nowPerc >= stages[i].timing.e) {
//stages[i].started = false; //should be a different "completed" flag...
}  
}


})

.delay(0)
.start();
}
*/

