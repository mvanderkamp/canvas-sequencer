/*
 * Author: Michael van der Kamp
 * Date: July, 2018
 * 
 * This file provides a basic implementation of a canvas sequencer library. The
 * purpose of this library is to provide a class which can store and distribute
 * sequences of canvas context instructions. Currently it is configured to only
 * work with a CanvasRenderingContext2D instance, but these capabilities could
 * be expanded to work on other contexts.
 */

'use strict';

const CanvasAtom = require('./CanvasAtom.js');
const CanvasSequencer = require('./CanvasSequencer.js');
const CanvasBlueprint = require('./CanvasBlueprint.js');

if (typeof exports !== 'undefined') {
  exports.CanvasSequencer = CanvasSequencer;
  exports.CanvasAtom = CanvasAtom;
  exports.Blueprint = Blueprint;
}

