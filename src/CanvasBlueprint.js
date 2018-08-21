/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
 * 
 * Thie file provides the definition of the CanvasBlueprint class.
 *
 * A CanvasBlueprint is similar to a plain CanvasSequencer, except that it
 * accepts tag strings as arguments, and before it can be executed it  needs to
 * be 'built' with an object defining which values should replace the tags.
 */

'use strict';

const CanvasSequencer = require('./CanvasSequencer.js');

const symbols = Object.freeze({
  sequence: Symbol.for('sequence'),
  push: Symbol.for('push'),
});

/*
 * Local function for replacing tags with values.
 */
function replaceTags(str, values) {
  const tag = str.replace(/^{|}$/g, '');
  if (tag !== str) {
    return values.hasOwnProperty(tag) ? values[tag] : tag;
  }
  return str;
}

class CanvasBlueprint extends CanvasSequencer {
  build(values = {}) {
    const seq = new CanvasSequencer();
    this[symbols.sequence].forEach( ({ type, inst, args }) => {
      const realArgs = args.map( v => {
        return (typeof v === 'string') ? replaceTags(v, values) : v;
      });
      seq[symbols.push](type, inst, ...realArgs);
    });
    return seq;
  }

  execute() {
    throw 'Cannot execute a blueprint.';
  }
}

CanvasBlueprint.fromString = function(str = null) {
  const obj = JSON.parse(str);
  if (obj && (obj.sequence instanceof Array)) {
    const seq = new CanvasBlueprint();
    obj.sequence.forEach( ({ type, inst, args }) => {
      seq[symbols.push](type, inst, ...args);
    });
    return seq;
  }
  return null;
}

module.exports = CanvasBlueprint;

