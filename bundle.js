(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.canvasSequencer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * Access point for npm.
 */

const CanvasSequencer = require('./src/CanvasSequencer.js');
const CanvasBlueprint = require('./src/CanvasBlueprint.js');

module.exports = { CanvasSequencer, CanvasBlueprint };


},{"./src/CanvasBlueprint.js":3,"./src/CanvasSequencer.js":4}],2:[function(require,module,exports){
/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
 * 
 * This file defines the low level 'CanvasAtom' for use by a CanvasSequencer.
 *
 * A CanvasAtom is a unit of execution in a CanvasSequence. It comes in two
 * flavours: one for describing a method call, one for describing a property
 * assignment.
 */

'use strict';

const TYPES = Object.freeze({
  METHOD:   'method',
  PROPERTY: 'property',
});

/*
 * Internal common constructor definition.
 */
class Atom {
  constructor(inst, args) {
    this.inst = inst;
    this.args = args;
  }
}

/*
 * Each flavour needs its own execute() definition, and needs to specify its
 * type in its constructor.
 */
class MethodCanvasAtom extends Atom {
  constructor(inst, args) {
    super(inst, args);
    this.type = TYPES.METHOD;
  }

  execute(context) {
    context[this.inst](...this.args);
  }
}

class PropertyCanvasAtom extends Atom {
  constructor(inst, args) {
    super(inst, args);
    this.type = TYPES.PROPERTY;
  }

  execute(context) {
    context[this.inst] = this.args[0];
  }
}

/*
 * This object is for demultiplexing types in the CanvasAtom constructor.
 * Defined outside the constructor so it doesn't need to be redefined every
 * time a new atom is constructed. Defined outside the class so that it is not
 * externally exposed.
 */
const atomOf = {
  [TYPES.METHOD]:   MethodCanvasAtom,
  [TYPES.PROPERTY]: PropertyCanvasAtom,
};

/*
 * The CanvasAtom is the class that will be exposed.
 * I'm not sure I like the way this is structured, but at least it's better
 * than 'switch'ing on the type every time execute() is called. This way, we
 * only have to 'switch' once.
 */
class CanvasAtom {
  constructor(type, inst, ...args) {
    return new atomOf[type](inst, args);
  }
}

/*
 * Define the types once locally, but make them available externally as
 * immutable properties on the class.
 */
Object.entries(TYPES).forEach( ([p,v]) => {
  Object.defineProperty( CanvasAtom, p, {
    value: v,
    configurable: false,
    enumerable: true,
    writable: false,
  });
});

module.exports = CanvasAtom;


},{}],3:[function(require,module,exports){
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


},{"./CanvasSequencer.js":4}],4:[function(require,module,exports){
/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
 * 
 * This file provides the definition of the CanvasSequencer class.
 *
 * A CanvasSequencer is a linear collection of CanvasAtoms, capable of being
 * executed on a CanvasRenderingContext2D.
 */

'use strict';

const CanvasAtom = require('./CanvasAtom.js');

const locals = Object.freeze({
  METHODS: [
    'arc',
    'arcTo',
    'beginPath',
    'bezierCurveTo',
    'clearRect',
    'clip',
    'closePath',
    'drawFocusIfNeeded',
    'drawImage',
    'ellipse',
    'fill',
    'fillRect',
    'fillText',
    'lineTo',
    'moveTo',
    'putImageData',
    'quadraticCurveTo',
    'rect',
    'resetTransform',
    'restore',
    'rotate',
    'save',
    'scale',
    'setLineDash',
    'setTransform',
    'stroke',
    'strokeRect',
    'strokeText',
    'transform',
    'translate',
  ],

  PROPERTIES: [
    'fillStyle',
    'filter',
    'font',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'strokeStyle',
    'textAlign',
    'textBaseline',
  ],
});

const symbols = Object.freeze({
  sequence: Symbol.for('sequence'),
  push: Symbol.for('push'),
});

class CanvasSequencer {
  constructor() {
    this[symbols.sequence] = [];
  }

  [symbols.push](...args) {
    this[symbols.sequence].push(new CanvasAtom(...args));
  }

  execute(context) {
    context.save();
    this[symbols.sequence].forEach( a => a.execute(context) );
    context.restore();
  }

  toJSON() {
    return JSON.stringify({ sequence: this[symbols.sequence] });
  }
}

CanvasSequencer.fromString = function(str = null) {
  const obj = JSON.parse(str);
  if (obj && (obj.sequence instanceof Array)) {
    const seq = new CanvasSequencer();
    obj.sequence.forEach( ({ type, inst, args }) => {
      seq[symbols.push](type, inst, ...args);
    });
    return seq;
  }
  return null;
}

locals.METHODS.forEach( m => {
  Object.defineProperty( CanvasSequencer.prototype, m, {
    value: function pushMethodCall(...args) {
      this[symbols.push](CanvasAtom.METHOD, m, ...args);
    }, 
    writable: false,
    enumerable: true,
    configurable: false,
  });
});

locals.PROPERTIES.forEach( p => {
  Object.defineProperty( CanvasSequencer.prototype, p, {
    get() { throw `Invalid canvas sequencer interaction, cannot get ${p}.` },
    set(v) { this[symbols.push](CanvasAtom.PROPERTY, p, v) },
    enumerable: true,
    configurable: false,
  });
});

module.exports = CanvasSequencer;


},{"./CanvasAtom.js":2}]},{},[1])(1)
});
