
function identity(x) {
  return x;
}


function behaviorReattach(startTime) {
  var tween = new TWEEN.Tween()
    .onStart(function() {

      console.log("in behaviorReattach at time " + startTime);

      for (var allg = grains().length - 1; allg >= 0 ; allg--) {
     //   console.log("parent was " + grains()[allg].uuid); 
        parent.add(grains()[allg]);  
     //   console.log("parent now " + grains()[allg].uuid); 
      }

    })
  .start(startTime);

  return this.tween;
}


function behaviorFormation(gs, startTime, func, rings, dist) {

  var attachArr;
  var tween = new TWEEN.Tween()
    .onStart(function() {

      this.attachArr = func(gs, rings, dist);

    })
  .start(startTime);

  return this.tween;

}


function behaviorChangeTexture(gs, startTime, texture) {

  var tween = new TWEEN.Tween()
    .onStart(function() {
      for (var g = 0; g < gs.length; g++) {
        gs[g].material.uniforms.tex0.value = texture;
      }
    })
  .start(startTime);

  return this.tween;

}



//to is a THREE.Vector3
function behaviorOpacityTo(gs, lengthOfTime, startTime, to, func = identity, scale = 1.0, repeat = 0) {

  var pv = 0.0;

  var rv = {v:0.0};
  var tv = {v:1.0}; 

  var ut = {v:to};


  var tween = new TWEEN.Tween(rv)
    .onStart(function() {

      ut.v = ut.v - gs[0].material.uniforms.opacity.value;

      tween.to(tv, lengthOfTime)

    })
  .onUpdate(function() {

      var cv = {v:func(rv.v * ut.v)};
      var uv = {v:cv.v - func(pv * ut.v)} ;

      for (var g = 0; g < gs.length; g++) {
        gs[g].material.uniforms.opacity.value += uv.v * scale;
      }

      pv = rv.v;
  })
  .onComplete(function() {
  })

  .repeat(repeat)
    .yoyo(true)
    .start(startTime);

  return this.tween;

}


//"to" is a named array
function behaviorOpacityFunc(gs, lengthOfTime, startTime = 0, to, func, scale, repeat = 0) {

  var pv = 0.0;

  var rv = {v:0.0};
  var tv = {v:1.0}; 

  var ut = {v:to}

  this.tween = new TWEEN.Tween(rv)
    .to( tv, lengthOfTime)
    .onUpdate(function() {

      var cv = {v:func(rv.v * ut.v)};
      var uv = {v:cv.v - func(pv * ut.v)} ;

      for (var g = 0; g < gs.length; g++) {
        gs[g].material.uniforms.opacity.value += uv.v * scale;
      }

      pv = rv.v;

    })
  .repeat(repeat)
    .yoyo(true)
    .start(startTime);

  return this.tween;

}



function behaviorOpacity(gs, lengthOfTime, startTime, to, scale = 1.0, repeat = 0) {
  behaviorOpacityFunc(gs, lengthOfTime, startTime, to, identity, scale, repeat)
}


function behaviorOpacitySin(gs, lengthOfTime, startTime, to, scale, repeat = 0) {
  behaviorOpacityFunc(gs, lengthOfTime, startTime, to, Math.sin, scale, repeat)
}

//to is a THREE.Vector3
function behaviorScaleTo(gs, lengthOfTime, startTime, to, anchor = parent, repeat = 0) {

  var pv = 0.0;

  var rv = {v:0.0};
  var tv = {v:1.0}; 


  var tween = new TWEEN.Tween(rv)
    .onStart(function() {

      to.x = to.x - gs[0].scale.x;
      to.y = to.y - gs[0].scale.y;
      to.z = to.z - gs[0].scale.z;
      
      //vecToArr(anchor.worldToLocal(arrToVec(to)));
      tween.to(tv, lengthOfTime)

    })
  .onUpdate(function() {

    var cv = {x:(rv.v * to.x), y:(rv.v * to.y), z:(rv.v * to.z) };
    var uv = {x:(cv.x - (pv * to.x)), y:(cv.y - (pv * to.y)), z:(cv.z - (pv * to.z))};

    for (var g = 0; g < gs.length; g++) {
      gs[g].scale.x += uv.x;
      gs[g].scale.y += uv.y;
      gs[g].scale.z += uv.z;
    }  

    pv = rv.v;
  })
  .onComplete(function() {
  })

  .repeat(repeat)
    .yoyo(true)
    .start(startTime);

  return this.tween;

}


//"to" is a named array
function behaviorScaleFunc(gs, lengthOfTime, startTime = 0, to, func, scale, repeat = 0) {

  var pv = 0.0;

  var rv = {v:0.0};
  var tv = {v:1.0}; 

  this.tween = new TWEEN.Tween(rv)
    .to( tv, lengthOfTime)
    .onUpdate(function() {

      var cv = {x:func(rv.v * to.x), y:func(rv.v * to.y), z:func(rv.v * to.z)};
      var uv = {x:cv.x - func(pv * to.x), y:cv.y - func(pv * to.y), z:cv.z - func(pv * to.z)} ;

      for (var g = 0; g < gs.length; g++) {
        gs[g].scale.x += (uv.x * scale);
        gs[g].scale.y += (uv.y * scale);
        gs[g].scale.z += (uv.z * scale);
      }  

      pv = rv.v;

    })
  .repeat(repeat)
    .yoyo(true)
    .start(startTime);

  return this.tween;

}


function behaviorScale(gs, lengthOfTime, startTime = 0, to, scale = 1.0, repeat = 0) {
  return behaviorScaleFunc(gs, lengthOfTime, startTime, to, identity, scale, repeat);
}


function behaviorScaleSin(gs, lengthOfTime, startTime = 0, to, func, scale = 1.0, repeat = 0) {
  return behaviorScaleFunc(gs, lengthOfTime, startTime, to, func, scale, repeat);
}



function behaviorRotateFunc(gs, lengthOfTime, startTime = 0, to, func, scale, repeat = 0, yoyo = true) {

  var pv = 0.0;

  var rv = {v:0.0};
  var tv = {v:1.0}; 

  this.tween = new TWEEN.Tween(rv)
    .to( tv, lengthOfTime)
    .onUpdate(function() {

      var cv = {x:func(rv.v * to.x), y:func(rv.v * to.y), z:func(rv.v * to.z)};
      var uv = {x:cv.x - func(pv * to.x), y:cv.y - func(pv * to.y), z:cv.z - func(pv * to.z)} ;

      for (var g = 0; g < gs.length; g++) {
        gs[g].rotation.x += (uv.x * scale);
        gs[g].rotation.y += (uv.y * scale);
        gs[g].rotation.z += (uv.z * scale);
      }  

      pv = rv.v;

    })
  .repeat(repeat)
    .yoyo(yoyo)
    .start(startTime);

  return this.tween;

}


function behaviorRotate(gs, lengthOfTime, startTime = 0, to, scale = 1.0, repeat = 0) {
  return behaviorRotateFunc(gs, lengthOfTime, startTime, to, identity, scale, repeat);
}

function behaviorRotateX(gs, lengthOfTime, startTime = 0, to = Math.PI * 2, scale = 1.0, repeat = 0) {
  return behaviorRotateFunc(gs, lengthOfTime, startTime, {x:to, y:0, z:0}, identity, scale, repeat);
}

function behaviorRotateY(gs, lengthOfTime, startTime = 0, to = Math.PI * 2, scale = 1.0, repeat = 0) {
  return behaviorRotateFunc(gs, lengthOfTime, startTime, {x:0, y:to, z:0}, identity, scale, repeat);
}

function behaviorRotateZ(gs, lengthOfTime, startTime = 0, to = Math.PI * 2, scale = 1.0, repeat = 0) {
  return behaviorRotateFunc(gs, lengthOfTime, startTime, {x:0, y:0, z:to}, identity, scale, repeat, false);
}

function behaviorRotateZSine(gs, lengthOfTime, startTime = 0, to = Math.PI * 2, scale = 1.0, repeat = 0) {
  return behaviorRotateFunc(gs, lengthOfTime, startTime, {x:0, y:0, z:to}, Math.sin, scale, repeat);
}



//to is a THREE.Vector3
function behaviorTranslateTo(gs, lengthOfTime, startTime, to, anchor = parent, repeat = 0) {

  var pv = 0.0;

  var rv = {v:0.0};
  var tv = {v:1.0}; 


  var tween = new TWEEN.Tween(rv)
    .onStart(function() {

      to = vecToArr(anchor.worldToLocal(arrToVec(to)));
      tween.to(tv, lengthOfTime)

    })
  .onUpdate(function() {

    var cv = {x:(rv.v * to.x), y:(rv.v * to.y), z:(rv.v * to.z) };
    var uv = {x:(cv.x - (pv * to.x)), y:(cv.y - (pv * to.y)), z:(cv.z - (pv * to.z))};

    for (var g = 0; g < gs.length; g++) {
      gs[g].position.x += uv.x;
      gs[g].position.y += uv.y;
      gs[g].position.z += uv.z;
    }  

    pv = rv.v;
  })
  .onComplete(function() {
  })

  .repeat(repeat)
    .yoyo(true)
    .start(startTime);

  return this.tween;

}

function behaviorPositionFunc(gs, lengthOfTime, startTime = 0, to, func, scale, repeat = 0, yoyo = true) {

  var pv = 0.0;

  var rv = {v:0.0};
  var tv = {v:1.0}; 

  this.tween = new TWEEN.Tween(rv)
    .to( tv, lengthOfTime)
    .onStart(function() {
      //console.log("tranlsation starting at " + Math.floor(performance.now( )));
      //console.log("lengthOfTime = " + lengthOfTime);
    })
  .onUpdate(function() {

    var cv = {x:func(rv.v * to.x), y:func(rv.v * to.y), z:func(rv.v * to.z)};
    var uv = {x:cv.x - func(pv * to.x), y:cv.y - func(pv * to.y), z:cv.z - func(pv * to.z)} ;

    for (var g = 0; g < gs.length; g++) {
      gs[g].position.x += (uv.x * scale);
      gs[g].position.y += (uv.y * scale);
      gs[g].position.z += (uv.z * scale);
    }  

    pv = rv.v;

  })
  //  .easing(TWEEN.Easing.Quadratic.InOut)

  .repeat(repeat)
    .yoyo(yoyo)
    .start(startTime);

  return this.tween;
}



function behaviorTranslate(gs, lengthOfTime, startTime = 0, to, scale = 1.0, repeat = 0) {
  return behaviorPositionFunc(gs, lengthOfTime, startTime, to, identity, scale, repeat);
}

function behaviorSine(gs, lengthOfTime, startTime, to, scale = 1.0, repeat = 0) {
  return behaviorPositionFunc(gs, lengthOfTime, startTime, to, Math.sin, scale, repeat, false);
}

function behaviorSineX(gs, lengthOfTime, startTime, to = Math.PI * 2, scale = 1.0, repeat = 0) {
  return behaviorSine(gs, lengthOfTime, startTime, {x:to, y:0, z:0}, scale, repeat);
}

function behaviorSineY(gs, lengthOfTime, startTime, to = Math.PI * 2, scale = 1.0, repeat = 0) {
  return behaviorSine(gs, lengthOfTime, startTime, {x:0, y:to, z:0}, scale, repeat);
}

function behaviorSineZ(gs, lengthOfTime, startTime, to = Math.PI * 2, scale = 1.0, repeat = 0) {
  return behaviorSine(gs, lengthOfTime, startTime, {x:0, y:0, z:to}, scale, repeat);
}






/*
   function Behavior(grains, lengthOfTime, to) {
   this.grains = grains;
   this.to = Math.PI * 2.0;
   this.lengthOfTime = lengthOfTime;
   this.tween = null;
   }
//Behavior.prototype.behave = function() {};


BehaviorTest.prototype = new Behavior(); 
BehaviorTest.prototype.constructor = BehaviorTest;

function BehaviorTest(grains, lengthOfTime, to) {
Behavior.call(this, grains, lengthOfTime, to); 


var tvs = {v:0.0, gs:this.grains, pv:0.0, cv:0.0, uv:0.0};

this.tween = new TWEEN.Tween(tvs)
.to( {v:this.to}, this.lengthOfTime)
.onUpdate(function() {
tvs.cv = tvs.v;  
tvs.uv = (tvs.cv - tvs.pv) ;

for (var g = 0; g < tvs.gs.length; g++) {

tvs.gs[g].rotation.z += tvs.uv;
}

tvs.pv = tvs.cv;
} );  

}
*/
/*
   BehaviorTest.prototype.behave = function() {
   this.curVal = this.tweenVal.v;  
   this.useVal = (this.curVal - this.prevVal) ;

   console.log("to = " + this.to);
   console.log("tweenVal = " + this.tweenVal);
   console.log("curVal = " + this.curVal);

   for (var g = 0; g < this.grains.length; g++) {

   this.grains[g].rotation.z += this.useVal;

//console.log("which.rotation.z" + this.grains[g].rotation.z);
//console.log("C " + g);
}
this.prevVal = this.curVal;

}

*/


