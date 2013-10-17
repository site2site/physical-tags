#!/usr/bin/env node

//
// Detects triangles and quadrilaterals
//

// sourced from: https://github.com/peterbraden/node-opencv/tree/master/examples

var cv = require('opencv'),
  colors = require("colors"),
  Spacebrew = require('./sb-1.3.0').Spacebrew,
  sb,
  config = require("./machine"),
  fs = require("fs"),
  PNG = require("png").Png;


var files_location = "files/";
var filepath = "./" + files_location;
var hosted_path = "http://api.sitetosite.co/modules/physical-tags/" + files_location;


/**
*
* Spacebrew setup
*
**/
sb = new Spacebrew.Client( config.server, config.name, config.description );  // create spacebrew client object


// create the spacebrew subscription channels
sb.addPublish("config", "string", "");  // publish config for handshake
sb.addSubscribe("config", "boolean"); // subscription for config handshake


sb.addSubscribe("image", "binary.png");  // subscription for receiving image binary

sb.addPublish("src", "string", "");   // publish image url for handshake


sb.onBooleanMessage = onBooleanMessage; 
sb.onCustomMessage = onCustomMessage;
sb.onOpen = onOpen;

// connect to spacbrew
sb.connect();  

/**
 * Function that is called when Spacebrew connection is established
 */
function onOpen(){
  console.log( "Connected through Spacebrew as: " + sb.name() + "." );
}


function onCustomMessage( name, value, type ){

  switch(type){
    case "binary.png":
      if(name == "image"){
        console.log('png buffer recieved');

        var b64_buf = new Buffer(value, 'base64').toString('binary');
        var buf = new Buffer(b64_buf, 'binary');

        var filename = filepath + 'image.png';

        fs.writeFile(filename, buf, 'binary', function(err){
          console.log(filename + ' written');
          outputContours( filename );
        });

        
      }
  }
}

/**
 * onStringMessage Function that is called whenever new spacebrew string messages are received.
 *          It accepts two parameters:
 * @param  {String} name    Holds name of the subscription feed channel
 * @param  {String} value   Holds value received from the subscription feed
 */
function onBooleanMessage( name, value ){

  console.log("[onBooleanMessage] value: " + value + " name: " + name);

  switch(name){
    case "config":
      console.log([
          // Timestamp
          String(+new Date()).grey,
          // Message
          String("sending config").cyan
        ].join(" "));

      sb.send("config", "string", JSON.stringify( config ) );
      break;
  }
}


//openCV parameters
var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var minArea = 2000;

var BLUE = [0, 255, 0]; //B, G, R
var RED   = [0, 0, 255]; //B, G, R
var GREEN = [0, 255, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R


function outputContours( filename ){
  console.log("filename: " + filename);
  cv.readImage(filename, function(err, im) {

    var out = new cv.Matrix(im.height(), im.width());

    console.log("height: "+ im.height());

    // convert the image to grey scale
    im.convertGrayscale();

    //make a copy of the image called im_canny (not sure why?)
    im_canny = im.copy();

    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);

    //uses a for loop to find number of contours
    contours = im_canny.findContours();

    for(i = 0; i < contours.size(); i++) {

      if(contours.area(i) < minArea) continue;

      // arcLength tells you how long each face is, so that you can cut out any small shape
      var arcLength = contours.arcLength(i, true);
      contours.approxPolyDP(i, 0.01 * arcLength, true);

      // chooses a drawing color based on number of contours
      switch(contours.cornerCount(i)) {
        case 3:
          out.drawContour(contours, i, GREEN);
          break;
        case 4:
          out.drawContour(contours, i, RED);
          break;
        case 5:
          out.drawContour(contours,i, BLUE);
          break;
        default:
          out.drawContour(contours, i, WHITE);
      }
    }

    //saves image
    var timestamp_filename = new Date().getTime() + ".png"; 
    out.save(filepath + timestamp_filename);
    console.log('output saved');
    sb.send("src", "string", hosted_path + timestamp_filename);
  });
}

  

