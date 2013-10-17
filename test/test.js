#!/usr/bin/env node

//
// Detects triangles and quadrilaterals
//

// sourced from: https://github.com/peterbraden/node-opencv/tree/master/examples

var cv = require('opencv'),
  fs = require("fs"),
  PNG = require("png").Png,
  PNGdecoder = require('png-js');


var image_path = "./";
/*
var image = new PNGdecoder("test.png");

image.decode(function (pixels) {
    console.log(pixels);
});

*/

fs.readFile(image_path + "test.png", function(err, data) {
  console.log(data);
  

  var base64data = data.toString('base64');
  console.log('1. sending base 64 with length' + base64data.length);
  
  
  

  var b64_buf = new Buffer(base64data, 'base64').toString('binary');
  var buf = new Buffer(b64_buf, 'binary');
  console.log('2. base64 buffer created');
  console.log(buf);




  //var png = new PNG(buf, 640, 480, 'rgb');
  //console.log('3. png created');

  //var png_image = png.encodeSync();
  //console.log('4. png_image created from encode');

  //fs.writeFileSync('./copy.png', png_image.toString('binary'), 'binary');
  
  fs.writeFileSync('./copy.png', buf, 'binary');

  console.log('5. file written');
  
});











var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var minArea = 2000;

var BLUE = [0, 255, 0]; //B, G, R
var RED   = [0, 0, 255]; //B, G, R
var GREEN = [0, 255, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R

/*
cv.readImage('../test/square2.jpg', function(err, im) {

  var out = new cv.Matrix(im.height(), im.width());

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
  out.save('../test/out.png');
});
*/