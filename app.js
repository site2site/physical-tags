#!/usr/bin/env node

//
// Detects triangles and quadrilaterals
//

// sourced from: https://github.com/peterbraden/node-opencv/tree/master/examples

var cv = require('opencv');

var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var minArea = 2000;

var BLUE = [0, 255, 0]; //B, G, R
var RED   = [0, 0, 255]; //B, G, R
var GREEN = [0, 255, 0]; //B, G, R
var WHITE = [255, 255, 255]; //B, G, R


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