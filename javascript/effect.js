function calcRings(numGrains, numRings) {

  var returnArr = new Array(numRings);

  var grainsLeft = numGrains;
  var ringsLeft = numRings;

  for (var i = 0; i < numRings - 1; i++) {

    var rawNum = Math.floor(grainsLeft / (ringsLeft+1)) * 2;
  

    returnArr[i] = rawNum;

    grainsLeft -= rawNum;
    ringsLeft--;
  }

  returnArr[numRings - 1] = grainsLeft;
  return returnArr;

}

//this assumes that numGrains is square
function calcRingsFromSquare(numGrains) {

  var squareroot = Math.sqrt(numGrains);
  var numRings = Math.floor((squareroot + 1) / 2) ;
  console.log("numRings = " + numRings);

  var returnArr = new Array(numRings);

  var ringsLeft = numRings;
  var grainsLeft = numGrains;

  for (var i = 0; i < numRings; i++) {

    var rawNum = Math.floor((Math.sqrt(grainsLeft) - 1) * 4);
    console.log("i = " + i + " rawNum " + rawNum);
    returnArr[i] = rawNum;

    grainsLeft -= rawNum;
    ringsLeft--;
 
    //console.log("i at end = " + i + " grains left = " + grainsLeft + ", ringsLeft = " + ringsLeft);
  
  }

  if (grainsLeft == 1) { //this will happen in sqrt is odd
 returnArr[numRings - 1] = grainsLeft;
     
  }

 return returnArr;

}


function formationRings(gs, numRings, maxRadius) {
  //var ringArr = calcRings(gs.length, numRings);
  //var distInc = maxRadius / numRings;

  /* testing square */
  
  //console.log("gs.length = " + gs.length);

  var ringArr = calcRingsFromSquare(gs.length);

  //console.log("r a len = " + ringArr.length);

  var distInc = maxRadius / (ringArr.length );
 
  //console.log("distInc = " + distInc);

  numRings = ringArr.length;

  console.log("ringArr[ringArr.length - 1].length = " + ringArr[ringArr.length - 1]);
  //if (ringArr.length % 2 == 0) {
  if (ringArr[ringArr.length - 1] == 1) {  
    //console.log("here ! even number of rings! = " + ringArr.length);
    distInc = maxRadius / (numRings - 1 );
  }
  /* done testing square */


  var gIndex = 0;

  var attachArr = new Array();


  //testing a square formation
  if (1 == 2) {

   for (var i = 0; i < ringArr.length; i++) {
    
    var dist = maxRadius - (distInc * i);

    var ring = new THREE.Object3D();

    attachArr[i] = { parentObj:ring, grainObjs:new Array() };

    //console.log(attachArr[i].parentObj);

   // console.log(" dist " + dist);
   // console.log("  ringArr[i] " + ringArr[i]);
    var sideInc = dist / ((ringArr[i] / 4) - 1 );

   // console.log("i = " + i + " dist = " + dist + ", sideInc =  " + sideInc);

    for (var g = 0; g < ringArr[i]; g++) {

      //gs[gIndex].position.y = dist * Math.sin(arcVal);
      //gs[gIndex].position.x = dist * Math.cos(arcVal);

      var val = Math.floor(g / (ringArr[i]/4));
      var val2 = Math.floor(g % (ringArr[i]/4));

      var posVec = new THREE.Vector3(0,0,0);
      console.log("val = " + val + " val2 = " + val2);
      if (val == 0) {
        //left side
        posVec = new THREE.Vector3(-dist/2.0, -dist/2.0 + (sideInc * val2), 0.0);
      } else if (val == 1) {
        //top side
        posVec = new THREE.Vector3(-dist/2.0 + (sideInc * val2), dist/2.0, 0.0);
      } else if (val == 2) {
        //right side
        posVec = new THREE.Vector3(dist/2.0, dist/2.0 - (sideInc * val2), 0.0);
      } else if (val == 3) {
        //bot side
        posVec = new THREE.Vector3(dist/2.0 - (sideInc * val2), -dist/2.0, 0.0);
      } 

      attachArr[i].grainObjs[g] = {grain:gs[gIndex], pos:posVec };

      
      gIndex++; 
    }
  }
 


  } else { //circular formation

  for (var i = 0; i < ringArr.length; i++) {
    var dist = maxRadius - (distInc * i);
    var arcInc = (Math.PI * 2) / ringArr[i];

    var arcVal = 0.0;

    var ring = new THREE.Object3D();

    attachArr[i] = {parentObj:ring, grainObjs:new Array()};

    //console.log(attachArr[i].parentObj);

    for (var g = 0; g < ringArr[i]; g++) {

      //gs[gIndex].position.y = dist * Math.sin(arcVal);
      //gs[gIndex].position.x = dist * Math.cos(arcVal);

      attachArr[i].grainObjs[g] = {grain:gs[gIndex], pos:new THREE.Vector3( dist * Math.sin(arcVal), dist * Math.cos(arcVal), 0.0 ) };

      arcVal += arcInc;
      gIndex++; 
    }
  }

  }


  return attachArr;

}
/***********/


function effectReset(gs, beginTime, lengthOfTime) {
  
   var tween = new TWEEN.Tween()
    .onStart(function() {

        console.log("in effectReset at time " + beginTime);


   console.log("resetting " + gs.length + " grains");

   for (var j = 0; j < gs.length; j++) {

     behaviorScaleTo(
            new Array(gs[j]),
            lengthOfTime / 3, 
            beginTime,
            new THREE.Vector3(1.0,1.0,1.0),
            gs[j],
            0   
            );

     var offs = getOffsetsForIndex(j,1.0);

       behaviorTranslateTo( 
            new Array(gs[j]), 
            lengthOfTime / 2, 
            beginTime + lengthOfTime / 2,
            new THREE.Vector3(offs.x,offs.y,0),
            gs[j], 
            0   
            );
        
  
     

   }

     
         })
  .start(beginTime);


}



function effectShimmer(gs, beginTime, lengthOfTime, startLength, angle) {

  var loopSpeed = 1.0;

  var currentBeginTime = 0;

  var scale = 1.0;

  var loopSpeedMultiplier = 0.8;

  var numLoops = 0;
  var cLT = startLength; // * loopSpeedMultiplier;
  var useStartLength = startLength;

 // console.log("in effectShimmer: lengthOfTime = " + lengthOfTime); 
 // console.log("in effectShimmer: startLength = " + startLength);  
 
  var loopSpeeds = new Array();

  for (var c = 0; c < 100; c++) {
  
     loopSpeeds.push(useStartLength);
     
    var useStartLength = useStartLength * loopSpeedMultiplier;
    cLT += useStartLength;
   
 //  console.log("useStartLength = " + useStartLength + "\ncLT = " + cLT);  
     if (cLT > lengthOfTime || useStartLength < 1) {
       //console.log(" cLT ("+ cLT +") > lengthOfTime (" + lengthOfTime + ")" );
      break;
    }

   numLoops++;
  //console.log("numLoops = " + numLoops);


    
  }

 // return 0;

   cLT = startLength;

  for (var loop = 0; loop <= numLoops; loop++) {


    var useLengthOfTime = loopSpeeds[loop]; //lengthOfTime * loopSpeed;

    //console.log("useLengthOfTime = " + useLengthOfTime);
    //loopSpeed *= loopSpeedMultiplier;

    scale *= 0.9;

    for (var g = 0; g < gs.length; g++) {

      var delayTime = getRandomBetween(0, useLengthOfTime/4);
      var lot = useLengthOfTime; // - delayTime / 2;

      var whereTo = Math.PI;

      if (Math.random() < 0.25) {
        whereTo = -Math.PI;
      } else if (Math.random() < 0.5) {
        whereTo = -Math.PI;
      } else if (Math.random() < 0.75) {
        whereTo = Math.PI;
      }


    //  if ( loop%2 == 0 ) {
        behaviorSineY( 
            new Array(gs[g]), 
            lot, 
            beginTime + currentBeginTime + delayTime / 2,
            whereTo,
            scale,
            0   
            );


        behaviorSineX( 
            new Array(gs[g]), 
            lot, 
            beginTime + currentBeginTime + delayTime / 2,
            whereTo * 32,
            0.1,
            0   
            );
     // } else {
       
       /*
        behaviorSineX( 
            new Array(gs[g]), 
            lot, 
            beginTime + currentBeginTime + delayTime / 2,
            whereTo,
            scale,
            0   
            );


        behaviorSineY( 
            new Array(gs[g]), 
            lot, 
            beginTime + currentBeginTime + delayTime / 2,
            whereTo * 32,
            0.1,
            0   
            );
      }
      */
    }

    currentBeginTime += useLengthOfTime;

  }
}

function effectSparkle(gs, beginTime, lengthOfTime, flickerRateMin, flickerRateMax, scaleMin, scaleMax   ) {

  //SPARKLE
  for (var i = 0; i < gs.length; i++) {

    var flickerRate = getRandomBetween(flickerRateMin, flickerRateMax);
    var repeatVal = Math.floor (1.0 / flickerRate);

    if (repeatVal % 2 == 0) { repeatVal -= 1; }

    var tot = flickerRate * (repeatVal + 1);

    var totalTime = lengthOfTime * tot;
    var flickerTime = lengthOfTime * (flickerRate);
    var startTime = lengthOfTime - totalTime;


    /* 
       console.log("repeats = " + repeatVal + " flickerTime = " + flickerTime + "tot = " + tot);
       console.log("startTime = " + (startTime));
       console.log("totalTime = " + (totalTime));
       console.log("del + tot = " + (startTime + totalTime));
       */


    var scaleVal = getRandomBetween(scaleMin,scaleMax);

     behaviorScale(
        new Array(gs[i]), 
        flickerTime,
        beginTime + startTime, 
        {x:scaleVal, y:scaleVal, z:0.0},
        1.0,
          repeatVal
          ); 
  }

}



function effectDart(gs, beginTime, lengthOfTime, timeArray ) {

    var numDarts = timeArray.length;
  var dartTimes = timeArray;


  var positions = new Array();
  var keepTrack = getRandomArrayBetween(0,0,0,0);

  for (var i = 0; i < numDarts; i++) {

    var xmin = -2;
    var xmax = 2;
    var ymin = -1;
    var ymax = 1;
    var zmin = 0;
    var zmax = 0;

    if (keepTrack.x < -1) {
      xmin = 2;
      xmax = 3;
    }
    else if (keepTrack.x > 1) {
      xmin = -2;
      xmax = -3;
    }

    if (keepTrack.y < -1) {
      ymin = 2;
      ymax = 3;
    }
    else if (keepTrack.y > 1) {
      ymin = -2;
      ymax = -3;
    }

    if (keepTrack.z < -2) {
      zmin = 1;
      zmax = 3;
    }
    else if (keepTrack.z > 2) {
      zmin = -1;
      zmax = -3;
    }

    var newPush = getRandomArrayBetween (xmin, xmax, ymin, ymax, zmin, zmax );
    keepTrack.x += newPush.x;
    keepTrack.y += newPush.y;
    keepTrack.z += newPush.z;

    positions.push ( newPush );
  }


  for (var i = 0; i < numDarts - 1; i++) {

    useBeginTime = beginTime + dartTimes[i];

    var to = positions[i];

    var useParent = parent;  
    var scatter = false; //true;

    //if (Math.random() < 0.2) {
    if (i % 2 == 0) {
      scatter = false; //true;
    }

    var dartLength = dartTimes[i+1] - dartTimes[i];
    //console.log("useBeginTime = " + useBeginTime);
    //console.log("\nloop " + i + ", dartLength = " + dartLength);


    for (var j = 0; j < gs.length; j++) {
    
      var delayBegin = getRandomBetween(0, dartLength/4);
      var delayEnd = getRandomBetween(0, dartLength/4);
      var newTo = new THREE.Vector3().copy(to);

      var grainInArr = new Array(gs[j]);

      if (i < numDarts - 1) {
        behaviorTranslate( 
          grainInArr,
          (dartLength) - (delayBegin + delayEnd), 
          useBeginTime - delayBegin*2,
          newTo,
          1.0,
          0   
          );

        var sa = getRandomBetween(-0.5,0.5);
        var sz = getRandomBetween(0.0,0.0);

        behaviorScale(
            grainInArr,
          (dartLength) - (delayBegin + delayEnd), 
          useBeginTime - delayBegin*2,
          new THREE.Vector3(sa, sa, sz),
          1.0,
          0   
          );  
      } 
    }
  }

 
  }



  
function effectDartSimple(gs, beginTime, lengthOfTime, timeArray ) {

    var numDarts = timeArray.length;
  var dartTimes = timeArray;


  var positions = new Array();
  var keepTrack = getRandomArrayBetween(0,0,0,0);

  for (var i = 0; i < numDarts; i++) {

    var xmin = -2;
    var xmax = 2;
    var ymin = -1;
    var ymax = 1;
    var zmin = 0;
    var zmax = 0;

    if (keepTrack.x < -1) {
      xmin = 2;
      xmax = 3;
    }
    else if (keepTrack.x > 1) {
      xmin = -2;
      xmax = -3;
    }

    if (keepTrack.y < -1) {
      ymin = 2;
      ymax = 3;
    }
    else if (keepTrack.y > 1) {
      ymin = -2;
      ymax = -3;
    }

    if (keepTrack.z < -2) {
      zmin = 1;
      zmax = 3;
    }
    else if (keepTrack.z > 2) {
      zmin = -1;
      zmax = -3;
    }

    var newPush = getRandomArrayBetween (xmin, xmax, 0, 0, 0, 0 );
    keepTrack.x += newPush.x;
    keepTrack.y += newPush.y;
    keepTrack.z += newPush.z;

    positions.push ( newPush );
  }


  for (var i = 0; i < numDarts - 1; i++) {

    useBeginTime = beginTime + dartTimes[i];

    var to = positions[i];

    var useParent = parent;  
    var scatter = false; //true;

    //if (Math.random() < 0.2) {
    if (i % 2 == 0) {
      scatter = false; //true;
    }

    var dartLength = dartTimes[i+1] - dartTimes[i];
    //console.log("useBeginTime = " + useBeginTime);
    //console.log("\nloop " + i + ", dartLength = " + dartLength);


    for (var j = 0; j < gs.length; j++) {
   
          var delayBegin = getRandomBetween(0, dartLength/4);
      var delayEnd = getRandomBetween(0, dartLength/4);
      var newTo = new THREE.Vector3().copy(to);

      var grainInArr = new Array(gs[j]);

      if (i < numDarts - 1) {
        behaviorTranslate( 
          grainInArr,
          (dartLength) - (delayBegin + delayEnd), 
          useBeginTime - delayBegin*2,
          newTo,
          1.0,
          0   
          );

 
      } 
    }
  }

 
  }


    /*
       for (var j = 0; j < grains().length; j++) {

       var offs = getOffsetsForIndex(j,1.0);


       console.log("HERE! _ ubt = " + useBeginTime);
       behaviorTranslateTo( 
       new Array(grains()[j]), 
       1000, 
       lastBeginTime,
       new THREE.Vector3(offs.x,offs.y,0),
       grains()[j], 
//parent,
0   
);
}
*/





