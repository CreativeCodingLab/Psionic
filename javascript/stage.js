/*
Stages - 
  set the time of different Effects - 
    which apply Behvaiors to particular Grains
*/

function filterOdd(value, index, ar) {
  if (index % 2 == 1) {
    return true;
  }
  return false;
}
    

function filterEven(value, index, ar) {
  if (index % 2 == 0) {
    return true;
  }
  return false;
}
  

function vecToArr(vec) { //THREE.Vector3 to named array
  return {x:vec.x, y:vec.y, z:vec.z};
}


function arrToVec(arr) { //THREE.Vector3 to named array
  return new THREE.Vector3(arr.x, arr.y, arr.z);
}

function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomArrayBetween(minX, maxX, minY, maxY, minZ = 0.0, maxZ = 0.0) {
  return {
    x:Math.random() * (maxX - minX) + minX, 
    y:Math.random() * (maxY - minY) + minY, 
    z:Math.random() * (maxZ - minZ) + minZ
  };
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

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


function Stage(name, timing) {
  this.name = name;
  this.timing = timing;
  this.started = false;
}
Stage.prototype.action = function() {};


StageTest1.prototype = new Stage(); 
StageTest1.prototype.constructor = StageTest1;

function StageTest1(name, timing) {
  Stage.call(this, name, timing); 
}

StageTest1.prototype.action = function(beginTime, lengthOfTime) {
  //behaviorRotateZ(grains().filter(filterOdd), lengthOfTime );
 
  //effectSparkle(beginTime, lengthOfTime, 0.05, 0.1, 1.0, 4.0);
 
  var gs = parent.children.filter(filterEven);
  var gsOdd = parent.children.filter(filterOdd);
   
/*
  behaviorSine( gs, 
        lengthOfTime/4, 
        beginTime,
        {x:Math.PI * 2, y:0, z:Math.PI * 8}, 
        //Math.PI * 2,
        1.5,
        3   
        );
   */

  /*
   behaviorTranslate( gs, 
        lengthOfTime/4, 
        beginTime,
        {x:1.0, y:1.0, z:0}, 
        //Math.PI * 2,
        1.0,
        3   
        );
*/
   
  /*
  behaviorTranslateTo( new Array(parent), 
        lengthOfTime/8, 
        beginTime/4,
        //getRandomArrayBetween(-1,1,-1,1) ,
        {x:2.0, y:1.0, z:0}, 
        parent,
        0   
        );

  
  behaviorTranslateTo( new Array(parent), 
        lengthOfTime/8, 
        beginTime + lengthOfTime/2,
        //getRandomArrayBetween(-1,1,-1,1) ,
        {x:1.0, y:-2.0, z:0}, 
        parent,
        0   
        );
  */
  
/*
  behaviorTranslateTo( gs, 
        lengthOfTime/8, 
        beginTime + lengthOfTime - lengthOfTime/4,
        {x:0.0, y:0.0, z:0}, 
        parent,
        0   
        );
  */

   /*

  for (var i = 0; i < gsOdd.length; i++) {

    behaviorTranslateTo( new Array(gsOdd[i]), 
        lengthOfTime/8, 
        beginTime,
        {x:1.0, y:1.0, z:0.0}, 
        gsOdd[i],
        0   
        );

  }

  for (var i = 0; i < gs.length; i++) {

    behaviorTranslateTo( new Array(gs[i]), 
        lengthOfTime/8, 
        beginTime,
        {x:0.0, y:0.0, z:0}, 
        gs[i],
        0   
        );

      
  }

  
  for (var i = 0; i < grains().length; i++) {

    var offs = getOffsetsForIndex(i);

    behaviorTranslateTo( new Array(grains()[i]), 
        lengthOfTime/8, 
        beginTime + lengthOfTime/4,
        {x:offs.x, y:offs.y, z:0}, 
        grains()[i],
        0   
        );
  }

  behaviorTranslateTo( new Array(parent), 
        lengthOfTime/2, 
        beginTime + lengthOfTime/4,
        {x:-3.0, y:0.0, z:0}, 
        parent,
        0   
        );
  

  for (var i = 0; i < gs.length; i++) {

    var offs = getOffsetsForIndex(i);

    behaviorTranslateTo( new Array(gs[i]), 
        lengthOfTime/8, 
        beginTime + lengthOfTime,
        {x:offs.x + 2.0, y:offs.y + 1.0, z:-1.0}, 
        gs[i],
        0   
        );

      
  }

  behaviorChangeTexture(grains(), beginTime + lengthOfTime, textures[2]);
*/

  /*
   behaviorRotateY( gs, 
        lengthOfTime/4, 
        beginTime,
        //{x:0.0, y:0.0, z:Math.PI * 2}, 
        Math.PI * 4,
        1.0,
        3   
        );



   behaviorScale( gs, 
        lengthOfTime/4, 
        beginTime,
        {x:1.0, y:1.0, z:0}, 
        1.0,
        3   
        );
  */

}



Stage1.prototype = new Stage(); 
Stage1.prototype.constructor = Stage1;
  
function Stage1(name, timing) {
  Stage.call(this, name, timing); 
}

Stage1.prototype.action = function(beginTime, lengthOfTime) {

    
 var dartTimes = [
2133.7200000000003,
2345.73,
2567.435,
4017.4150000000004,
4263.710000000001,
4486.595,
5364.055,
11504.08,
14253.845000000001,
14542.175000000003,
14850.420000000002,
15174.255000000001,
18326.320000000003,
19624.445,
20019.8,
20392.000000000004,
20592.34,
20736.815,
21037.53,
21943.675000000003,
22326.925000000003,
22727.515,
23176.160000000003,
23816.125000000004,
24439.140000000003,
25426.250000000004,
25614.295000000002,
25808.440000000002,
29312.18

];


 var numDarts = dartTimes.length;


//var dartTimes = new Array(numDarts) ;
  

  var totalDartTime = 30000; //lengthOfTime - (lengthOfTime * 0.1); 
  //var dartTime = totalDartTime / (numDarts);
  var lastBeginTime = beginTime + totalDartTime;

  /*
   var dartTimes = new Array(numDarts);
  for (var i = 0; i < numDarts; i++) {
    dartTimes[i] = dartTime;
    //dartTimes[i] = 1000;
  }
  */


 /*
  dartTimes[0] = dartTime * 0.3;
  dartTimes[1] = dartTime * 0.3;
  dartTimes[2] = dartTime * 2.0;
  dartTimes[3] = dartTime * 0.5;
  dartTimes[4] = dartTime * 0.5;
  dartTimes[5] = dartTime * 3.0;


  dartTimes[6] = dartTime * 0.5;
  dartTimes[7] = dartTime * 0.1;
  dartTimes[8] = dartTime * 0.1;
  dartTimes[9] = dartTime * 1.0;
  dartTimes[10] = dartTime * 0.1;
  dartTimes[11] = dartTime * 0.1;
  dartTimes[12] = dartTime * 0.1;
  dartTimes[13] = dartTime * 1.0;
  dartTimes[14] = dartTime * 0.1;
  dartTimes[15] = dartTime * 0.1;
*/


  effectDart(grains(), beginTime, lengthOfTime, dartTimes);

}


Stage4.prototype = new Stage(); 
Stage4.prototype.constructor = Stage4;
  
function Stage4(name, timing) {
  Stage.call(this, name, timing); 
}

Stage4.prototype.action = function(beginTime, lengthOfTime) {

    
 var dartTimes = [
2133.7200000000003,
2345.73,
2567.435,
4017.4150000000004,
4263.710000000001,
4486.595,
5364.055,
11504.08,
14253.845000000001,
14542.175000000003,
14850.420000000002,
15174.255000000001,
18326.320000000003,
19624.445,
20019.8,
20392.000000000004,
20592.34,
20736.815,
21037.53,
21943.675000000003,
22326.925000000003,
22727.515,
23176.160000000003,
23816.125000000004,
24439.140000000003,
25426.250000000004,
25614.295000000002,
25808.440000000002,
29312.18

];


 var numDarts = dartTimes.length;

  var totalDartTime = 30000; 
  var lastBeginTime = beginTime + totalDartTime;

  effectDart(grains(), beginTime, lengthOfTime, dartTimes);

}





Stage3.prototype = new Stage(); 
Stage3.prototype.constructor = Stage3;

function Stage3(name, timing) {
  Stage.call(this, name, timing); 
}

Stage3.prototype.action = function(beginTime, lengthOfTime) {


  shuffleArray(grains());


//formation should be in a behavior, otherwise the scene graph changes right away!
  //
  //var bf = behaviorFormation( grains(), beginTime, formationRings, 5, 2.5);
  //var attachArr = bf.attachArr;
 

 var tween = new TWEEN.Tween()
    .onStart(function() {

   
  var attachArr = formationRings(grains(), 5, 2.0);

  for (var r = 0; r < attachArr.length; r++) {

    var ra = attachArr[r];
    parent.add(ra.parentObj);

    for (var g = 0; g < ra.grainObjs.length; g++) {

      var ga = ra.grainObjs[g];

      var grain = ga.grain;

      ra.parentObj.add(grain); //in THREEjs, adding automatically handles removing it from current parent


          behaviorTranslateTo( new Array(grain), 
          lengthOfTime/2, 
          beginTime,
          vecToArr(ga.pos), 
          grain,
          0   
          );
          
      
    }

    if (r%2 == 0) {
     // behaviorRotateZ(ra.parentObj.children, lengthOfTime, beginTime, Math.PI);
      behaviorRotateZ(new Array(ra.parentObj), lengthOfTime, beginTime, Math.PI);

      if (r == 4) {
   behaviorRotateZ(new Array(ra.parentObj), lengthOfTime, beginTime, Math.PI, 32.0);


      }
    } else {
     // behaviorRotateZ(ra.parentObj.children, lengthOfTime, beginTime, -Math.PI);
  //    behaviorRotateZ(new Array(ra.parentObj), lengthOfTime, beginTime, -Math.PI);
    } 
  }

  
  var sparkleLoops = 20;
  var beginSparkleTime = beginTime + lengthOfTime/4;
  
  var sparkleLoopTime = (lengthOfTime - lengthOfTime/2) / sparkleLoops;

  //gs, beginTime, lengthOfTime, flickerRateMin, flickerRateMax, scaleMin, scaleMax
  for (var t = 0; t < sparkleLoops; t++) {
    effectSparkle( attachArr[0].parentObj.children, beginSparkleTime + (sparkleLoopTime) * t, sparkleLoopTime, 0.05, 0.1, 0.01, 1.04);
  }


  //for (var el = 0; el < attachArr[0].parentObj.children.length; el++) {
   
 
  behaviorScale(attachArr[0].parentObj.children, lengthOfTime - lengthOfTime/2, beginSparkleTime, {x:7.0,y:7.0,z:0.0}, 1.0, 1);
  
   //}


 
  for (var aag = 0; aag < attachArr[1].parentObj.children.length; aag++) {

    var side = Math.floor(Math.sqrt(attachArr[1].parentObj.children.length));
    var offs = getOffsetsForIndexB(aag, 2.0, side, side);
    var grain = attachArr[1].parentObj.children[aag];

    console.log("grain = " + grain.position.x);

    behaviorTranslateTo(  
        new Array(grain), 
        1000, 
        beginTime + lengthOfTime - lengthOfTime / 16 ,
        new THREE.Vector3(offs.x,offs.y,0),
        grain, 
        0   
        );
  }

   
  for (var aag = 0; aag < attachArr[3].parentObj.children.length; aag++) {

    var side = Math.floor(Math.sqrt(attachArr[3].parentObj.children.length));
    var offs = getOffsetsForIndexB(aag, 2.0, side, side);
    var grain = attachArr[3].parentObj.children[aag];

    console.log("grain = " + grain.position.x);

    behaviorTranslateTo(  
        new Array(grain), 
        1000, 
        beginTime + lengthOfTime - lengthOfTime / 4,
        new THREE.Vector3(offs.x,offs.y,0),
        grain, 
        0   
        );
  }

  
  for (var aag = 0; aag < attachArr[4].parentObj.children.length; aag++) {

    var side = Math.floor(Math.sqrt(attachArr[4].parentObj.children.length));
    var offs = getOffsetsForIndexB(aag, 2.0, side, side);
    var grain = attachArr[4].parentObj.children[aag];

    console.log("grain = " + grain.position.x);

    behaviorTranslateTo(  
        new Array(grain), 
        1000, 
        beginTime + lengthOfTime - lengthOfTime / 4,
        new THREE.Vector3(offs.x,offs.y,0),
        grain, 
        0   
        );
  }





  var dartTimes = [
    2133.7200000000003,
    2345.73,
    2567.435,
    4017.4150000000004,
    4263.710000000001,
    4486.595,
    5364.055,
    11504.08,
    14253.845000000001,
    14542.175000000003,
    14850.420000000002,
    15174.255000000001,
    18326.320000000003,
    19624.445,
    20019.8,
    20392.000000000004,
    20592.34,
    20736.815,
    21037.53,
    21943.675000000003,
    22326.925000000003,
    22727.515,
    23176.160000000003,
    23816.125000000004,
    24439.140000000003,
    25426.250000000004,
    25614.295000000002,
    25808.440000000002,
    29312.18,
    32000,
    33000,
    34000,
    35000,
    38000,
    40000,
    41000,
    43000,
    45000,  


    ];




  var numDarts = dartTimes.length;

  var totalDartTime = 30000; 
  var lastBeginTime = beginTime + totalDartTime;

  effectDart(attachArr[1].parentObj.children, beginTime + lengthOfTime /2, lengthOfTime, dartTimes);

 effectDart(attachArr[3].parentObj.children, beginTime + lengthOfTime /2, lengthOfTime, dartTimes);

 effectDart(attachArr[4].parentObj.children, beginTime + lengthOfTime /2, lengthOfTime, dartTimes);



    })
 .start(beginTime);



}






Stage2.prototype = new Stage(); 
Stage2.prototype.constructor = Stage2;

function Stage2(name, timing) {
  Stage.call(this, name, timing); 
}

Stage2.prototype.action = function(beginTime, lengthOfTime) {


  var numTimes = 2;
  var lot = lengthOfTime / numTimes;
  var bt = beginTime;

  console.log("A orig lengthOfTime = " + lengthOfTime);  

  for (var i = 0; i < numTimes; i++) {
    //shimmer
    console.log("B orig lengthOfTime = " + lot);  

    effectShimmer(grains(), bt, lot, lot/4, Math.PI / 2);

    bt += lot;
  }

}






Stage5.prototype = new Stage(); 
Stage5.prototype.constructor = Stage5;

function Stage5(name, timing) {
  Stage.call(this, name, timing); 
}

Stage5.prototype.action = function(beginTime, lengthOfTime) {

  
    var even = grains().filter(filterEven);
    var odd = grains().filter(filterOdd);
  

  behaviorSineY( even, 
      lengthOfTime, 
      beginTime,
      Math.PI * 24,
      0.2
      );
      

   behaviorSineX( odd, 
      lengthOfTime, 
      beginTime,
      -Math.PI * 24 * 4,
      1.2
      );

   

 

   for (var i = 0; i < odd.length; i++) {

    var howMany = Math.floor(getRandomBetween(10,30));

     behaviorScaleSin( 
  new Array(odd[i]),
  lengthOfTime/howMany, 
  beginTime,
  new THREE.Vector3(1.0,1.0,0.0),
  Math.sin,
  -5.0,
  howMany
  );

   behaviorSineZ( 
      new Array(odd[i]),
      lengthOfTime/howMany, 
      beginTime,
      -Math.PI * 8,
      1.0,
      howMany
      );



   }

   
   for (var i = 0; i < even.length; i++) {

    var howMany = Math.floor(getRandomBetween(10,30));

     behaviorScaleSin( 
  new Array(even[i]),
  lengthOfTime/howMany, 
  beginTime,
  new THREE.Vector3(1.0,1.0,0.0),
  Math.sin,
  -5.0,
  howMany
  );

 behaviorSineZ( 
      new Array(even[i]),
      lengthOfTime/howMany, 
      beginTime,
      -Math.PI,
      1.0,
      howMany
      );
   }


  behaviorScaleSin( 
  even,
  lengthOfTime/8.0, 
  beginTime,
  new THREE.Vector3(1.0,1.0,0.0),
  Math.sin,
  -2.0,
  16
  );
 
  


  behaviorRotateZ(new Array(parent), 
      lengthOfTime, 
      beginTime,
      Math.PI * 24.0,
      1.0
      );
  

  effectShimmer(even, beginTime + lengthOfTime/100, lengthOfTime, lengthOfTime /10, (Math.PI / 180) * 45);

  effectShimmer(odd, beginTime + lengthOfTime/2, lengthOfTime, lengthOfTime /10, (Math.PI / 180) * 90);



}








StageTest2.prototype = new Stage(); 
StageTest2.prototype.constructor = StageTest2;

function StageTest2(name, timing) {
  Stage.call(this, name, timing); 
}

StageTest2.prototype.action = function(beginTime, lengthOfTime) {

  //watery moveTo... 
  var repeatTranslates = 3;
  var lot = lengthOfTime / (repeatTranslates); 

  for (var i = 0; i < repeatTranslates; i++) {

    var moveTo = {x:getRandomBetween(-1,1), y:getRandomBetween(-1,1), z:getRandomBetween(0,0)};


    var rspace = getRandomBetween(0.0,2.5);

    for (var g = 0; g < scene.children.length; g++) {

      if ( i >= repeatTranslates - 1) {
        rspace = 1.0;
      }

      var offs = getOffsetsForIndex(g,rspace);

      //var gMoveTo = {x:offs.x + moveTo.x, y:offs.y + moveTo.y, z:moveTo.z};
      var gMoveTo = {x:offs.x, y:offs.y, z:moveTo.z};

      var gLengthOfTime = getRandomBetween(lot-lot/2 ,lot-lot/4 ); 


      behaviorTranslateTo(new Array(scene.children[g]),
          gLengthOfTime, 
          beginTime + (lot * i),
          gMoveTo,
          0
          );


      behaviorSineY( new Array(scene.children[g]), 
          gLengthOfTime/4, 
          beginTime + (lot * i),
          Math.PI * 2,
          3   
          );

      if (g % 2 == 0) {
        behaviorSineX( new Array(scene.children[g]), 
            gLengthOfTime, 
            beginTime + (lot * i),
            Math.PI * 2,
            0   
            );
      }

    }

  }




  /*
     var filtered = scene.children.filter(filterEven);

     for (var g = 0; g < filtered.length; g++) {
     behaviorSineY( new Array(filtered[g])  , 
     lengthOfTime, 
     beginTime, 
     Math.PI * 2,
     0   
     );


     }
     */

  /*
     var repeatTranslates = 11;
     var lot = lengthOfTime / repeatTranslates+1; 
     behaviorTranslate(scene.children.filter(filterEven),
     lot, 
     beginTime,
     {x:1.0, y:0.0, z:-2.0},
     repeatTranslates
     );

     behaviorSineY(scene.children.filter(filterEven), 
     lot, 
     beginTime, 
     Math.PI * 2,
     repeatTranslates   
     );
     */

  //behaviorSineX(scene.children.filter(filterEven), lengthOfTime * 0.55, lengthOfTime * 0.25 );
}

