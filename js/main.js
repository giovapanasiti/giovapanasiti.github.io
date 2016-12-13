    document.addEventListener("DOMContentLoaded", function() {
      if (document.body.clientWidth>320) {
        initBeaconMap();
        //initiate click event listeners on the canvases
        var anchors = document.getElementsByTagName("body");
        for (var i = 0; i < anchors.length; i++) {
          var current = anchors[i];
          current.addEventListener('click', clickHandler, false);
        }
      }

    });


    var beacons = [],                                                                     //array of beacons
    beaconCount = 110,                                                                     //number of beacons to deploy
    webStrandLength = 200,   //the longest length a strand will connect two beacons
    locatorAlpha=1,
    locatorSize=1
    width = screen.width + webStrandLength,
    height = screen.height + webStrandLength,
    c = document.getElementById("connectMap"),
    c2 = document.getElementById("locatorMap");
    c.width = screen.width + webStrandLength;
    c2.width = screen.width + webStrandLength;
    c.height = screen.height + webStrandLength;
    c2.height = screen.height + webStrandLength;
    var mouseX=-100;
    var mouseY=-100;

    (function() {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
            window.requestAnimationFrame = requestAnimationFrame;
    })();



    function initBeaconMap() {
      for (var i = 0; i < beaconCount; i++) {
        var x = Math.floor(Math.random() * width),
            y = Math.floor(Math.random() * height),
            size = (Math.random() * 1.0) + 0.5,
            slope = (Math.random()* 6) - 3,
            direction = Math.round(Math.random()),
            opac = (Math.random() * 100) / 100,
            fillRate = (Math.random() * 0.006) + 0.0045,
            speed = (Math.random() * .125)+.125,
            glow = Math.round(Math.random());

        beacons.push({
          slope: slope,
          size: size,
          x: x,
          y: y,
          direction: direction,
          opac: opac,
          fillRate: fillRate,
          speed: speed,
          glow: glow
        });
      }
      fireBeacons();
    };


    function fireBeacons() {
        var ctx=c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);

        for (var i = 0; i < beaconCount; i++) {

          var beacon = beacons[i];


          if (beacon.opac>=1){
            beacon.glow = 0;
            beacon.opac = 1;
          }
          else if (beacon.opac<=0){
            beacon.glow=1;
            beacon.opac=0;
          }


            //if beacon opacity hits one, start decrementing the opacity
          if (beacon.glow==1) {
            beacon.opac+= beacon.fillRate;
            if ( beacon.opac>1) beacon.opac=1;
          }//similarly, if opacity hits zero, start incrementing
          else {
            beacon.opac-= beacon.fillRate;
            if (beacon.opac<0) beacon.opac=0;
          }



          beacon.y += beacon.slope * beacon.speed;
          if (beacon.direction == 1) beacon.x = beacon.x + 1.1*beacon.speed;
          else beacon.x = beacon.x - 1.1*beacon.speed;

          ctx.beginPath();
          ctx.arc(beacon.x,beacon.y,beacon.size,0,2*Math.PI);
          ctx.fillStyle = 'rgba(240,240,240,'+beacon.opac+')';
          ctx.strokeStyle='rgba(240,240,240,'+beacon.opac+')';
          ctx.fill();
          ctx.stroke();


          if (beacon.x < -5 || beacon.x >= width + 5 || beacon.y < -5 || beacon.y >= height + 5 )
          {
            var decide = Math.round(Math.random());
            beacon.size = (Math.random() * 1.0) + 0.5;
            beacon.slope = (Math.random() * 6) - 3;
            beacon.direction = Math.round(Math.random());
            beacon.speed = (Math.random() * .1)+.1;
            if (beacon.slope >= 0) {
              if (beacon.direction == 0) { //top or right
                if (decide==1) {
                  //right wall
                  beacon.x = width + 3;
                  beacon.y = (Math.random() * (height-30))+15;
                }
                else{
                  //top wall
                  beacon.x = (Math.random() * (width-30))+15;
                  beacon.y = -3;
                }
              }
              else {  //top or left
                if (decide==1) {
                  //left wall
                  beacon.x = -3;
                  beacon.y = (Math.random() * (height-30))+15;
                }
                else{
                  //top wall
                  beacon.x = (Math.random() * (width-30))+15;
                  beacon.y = -3;
                }
              }
            }
            else if (beacon.slope<0) {
              if (beacon.direction == 0) { //bottom or right
                if (decide==1) {
                  //right wall
                  beacon.x = width + 3;
                  beacon.y = (Math.random() * (height-30))+15;
                }
                else{
                  //bottom wall
                  beacon.x = (Math.random() * (width-30))+15;
                  beacon.y = height + 3;
                }
              }
              else { //bottom or left
                if (decide==1) {
                  //left wall
                  beacon.x = -3;
                  beacon.y = (Math.random() * (height-30))+15;
                }
                else{
                  //bottom wall
                  beacon.x = (Math.random() * (width-30))+15;
                  beacon.y = height + 3;
                }
              }
            }
          }

          if (Math.abs(beacon.x-mouseX) < webStrandLength/2 && Math.abs(beacon.y-mouseY) < webStrandLength/2) {

          for (var j = i; j < beaconCount; j++) {
            // if (Math.abs(beacon.x-beacons[j].x)<webStrandLength && Math.abs(beacon.y-beacons[j].y)<webStrandLength && i!=j)
            // {
              // ctx.beginPath();
              // if ((Math.abs(beacon.x-mouseX) < webStrandLength/2 && Math.abs(beacon.y-mouseY) < webStrandLength/2) || (Math.abs(beacons[j].x-mouseX) < webStrandLength/2 && Math.abs(beacons[j].y-mouseY) < webStrandLength/2)) {
                var diffx = Math.abs(beacon.x-beacons[j].x),
                diffy = Math.abs(beacon.y-beacons[j].y),
                max = (diffx>diffy) ? diffx : diffy,
                opac = (webStrandLength-max)/webStrandLength;
                ctx.beginPath();
                ctx.strokeStyle='rgba(255,255,244,'+opac/2+')';
                ctx.lineWidth='.8';
                ctx.moveTo(beacons[j].x,beacons[j].y);
                ctx.lineTo(beacon.x,beacon.y);
                ctx.stroke();
              // }
              // else {
              //   ctx.strokeStyle="rgba(250,250,250, " + opac/2 + ")";
              //   ctx.lineWidth=".3";
              // }
              // ctx.moveTo(beacons[j].x,beacons[j].y);
              // ctx.lineTo(beacon.x,beacon.y);
              // ctx.stroke();
            // }
          }
          }
        }
        requestAnimationFrame(fireBeacons);
    };



    //initiate kickoff locator function
    var clickHandler = function() {
      requestAnimationFrame(animateLocator);
    };

    //locator animation
    function animateLocator(time){
      var ctx=c2.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      for (var i = 0; i < beaconCount; i++) {
        var beacon = beacons[i];
        ctx.beginPath();
        ctx.globalAlpha = locatorAlpha;
        ctx.arc(beacon.x,beacon.y,locatorSize,0,2*Math.PI);
        ctx.strokeStyle = 'rgba(247,179,127,'+locatorAlpha+')';
        ctx.fillStyle = 'rgba(240,240,240,0)';
        ctx.fill();
        ctx.stroke();
        locatorAlpha-=0.0008;
        locatorSize+=0.008;
      }
      //keep doing the animation while the opacity > 0
      if (locatorAlpha>0) requestAnimationFrame(animateLocator);
      //don't call back the animation once opacity <= 0
      else {
        locatorAlpha=1;
        locatorSize=1;
        ctx.clearRect(0, 0, c.width, c.height);
      }
    }

    window.addEventListener('resize', function(){
      if (document.body.clientWidth>250) {
        width = document.body.clientWidth,
        height = document.body.clientHeight;
        c.width = document.body.clientWidth;
        c2.width = document.body.clientWidth;
        c.height = document.body.clientHeight;
        c2.height = document.body.clientHeight;
      }
    }, true);

    function highlightBeacon(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }



