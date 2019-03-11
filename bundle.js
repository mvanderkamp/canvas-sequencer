(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.canvasSequencer = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
 * Access point for npm.
 */

const CanvasSequence = require('./src/CanvasSequence.js');
const CanvasBlueprint = require('./src/CanvasBlueprint.js');

module.exports = { CanvasSequence, CanvasBlueprint };


},{"./src/CanvasBlueprint.js":3,"./src/CanvasSequence.js":4}],2:[function(require,module,exports){
/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
 * 
 * This file defines the low level 'CanvasAtom' for use by a CanvasSequence.
 *
 * A CanvasAtom is a unit of execution in a CanvasSequence. It comes in two
 * flavours: one for describing a method call, one for describing a property
 * assignment.
 */

'use strict';

/**
 * The types of CanvasAtoms that are available.
 *
 * @enum {string}
 * @readonly
 * @lends CanvasAtom
 */
const TYPES = {
  /** @const */ METHOD:   'method',
  /** @const */ PROPERTY: 'property',
};

/**
 * Internal common constructor definition for Canvas Atoms.
 */
class Atom {
  /**
   * @param {string} inst - The canvas context instruction.
   * @param {mixed[]} args - The arguments to the instruction.
   */
  constructor(inst, args) {
    /**
     * The canvas context instruction.
     *
     * @private
     * @type {string}
     */
    this.inst = inst;

    /**
     * The arguments to the instruction.
     *
     * @private
     * @type {mixed[]}
     */
    this.args = args;
  }
}

/**
 * A MethodCanvasAtom is used for canvas context methods. The arguments will be
 * treated as an actual array, all of which will be passed to the method when
 * the atom is executed.
 *
 * @extends Atom
 */
class MethodCanvasAtom extends Atom {
  constructor(inst, args) {
    super(inst, args);

    /**
     * The type of atom.
     *
     * @private
     * @type {string}
     */
    this.type = TYPES.METHOD;
  }

  /**
   * Execute the atom on the given context.
   *
   * @param {CanvasRenderingContext2D} context
   */
  execute(context) {
    context[this.inst](...this.args);
  }
}

/**
 * A PropertyCanvasAtom is used for canvas context properties (a.k.a. fields).
 * Only the first argument will be used, and will be the value assigned to the
 * field.
 *
 * @extends Atom
 */
class PropertyCanvasAtom extends Atom {
  constructor(inst, args) {
    super(inst, args);
    this.type = TYPES.PROPERTY;
  }

  /**
   * Execute the atom on the given context.
   *
   * @param {CanvasRenderingContext2D} context
   */
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

/**
 * The exposed CanvasAtom class. Results in the instantiation of either a
 * MethodCanvasAtom or a PropertyCanvasAtom, depending on the given type.
 */
class CanvasAtom {
  /**
   * @param {string} type - Either CanvasAtom.METHOD or CanvasAtom.PROPERTY.
   * @param {string} inst - The canvas context instruction.
   * @param {mixed[]} args - The arguments to the instruction.
   */
  constructor(type, inst, ...args) {
    return new atomOf[type](inst, args);
  }
}

/*
 * Define the types once locally, but make them available externally as
 * immutable properties on the class.
 */
Object.entries(TYPES).forEach(([p,v]) => {
  Object.defineProperty(CanvasAtom, p, {
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
 * A CanvasBlueprint is similar to a plain CanvasSequence, except that it
 * accepts tag strings as arguments, and before it can be executed it  needs to
 * be 'built' with an object defining which values should replace the tags.
 */

'use strict';

const CanvasSequence = require('./CanvasSequence.js');

// Mark properties as intended for internal use.
const symbols = Object.freeze({
  sequence: Symbol.for('sequence'),
  push: Symbol.for('push'),
});

/**
 * Replace tags in the given string with correlated value in values.
 *
 * Rules:
 * - Strings not surrounded by curly braces {} will be returned.
 * - Strings surrounded by curly braces but not corresponding to a property on
 *   'values' will result in a string without the curly braces being returned.
 * - Strings surrounded by curly braces, with the inner string corresponding to
 *   a property on 'values' will result in the corresponding value being
 *   returned.
 *
 * @inner
 * @private
 *
 * @param {string} str
 * @param {object} values
 *
 * @return {string|mixed} Either the original string if no replacement was
 * performed, or the appropriate value.
 */
function replaceTags(str, values) {
  const tag = str.replace(/^{|}$/g, '');
  if (tag !== str) {
    return values.hasOwnProperty(tag) ? values[tag] : tag;
  }
  return str;
}

/**
 * A CanvasBlueprint is a rebuildable CanvasSequence. It accepts tagged
 * arguments. When built, tags will be replaced using properties from a provided
 * object.
 *
 * @extends CanvasSequence
 */
class CanvasBlueprint extends CanvasSequence {
  /** Build the blueprint using the provided values.
   *
   * Rules: 
   * - Strings not surrounded by curly braces {} will be returned.
   * - Strings surrounded by curly braces but not corresponding to a property on
   *   'values' will result in a string without the curly braces being returned.
   * - Strings surrounded by curly braces, with the inner string corresponding
   *   to a property on 'values' will result in the corresponding value being
   *   returned.
   *
   * @param {object} values - The values with which to construct the sequence.
   *
   * @return {CanvasSequence} The constructed sequence.
   */
  build(values = {}) {
    const seq = new CanvasSequence();
    this[symbols.sequence].forEach( ({ type, inst, args }) => {
      const realArgs = args.map( v => {
        return (typeof v === 'string') ? replaceTags(v, values) : v;
      });
      seq[symbols.push](type, inst, ...realArgs);
    });
    return seq;
  }

  /**
   * CanvasBlueprints cannot be directly executed!
   *
   * @throws TypeError
   */
  execute() {
    throw new TypeError('Cannot execute a blueprint.');
  }
}

module.exports = CanvasBlueprint;


},{"./CanvasSequence.js":4}],4:[function(require,module,exports){
/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
 * 
 * This file provides the definition of the CanvasSequence class.
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

// Mark properties as intended for internal use.
const symbols = Object.freeze({
  sequence: Symbol.for('sequence'),
  push: Symbol.for('push'),
  fromJSON: Symbol.for('fromJSON'),
});

/**
 * A CanvasSequence is a linear collection of CanvasAtoms, capable of being
 * executed on a CanvasRenderingContext2D.
 */
class CanvasSequence {
  /**
   * @param {CanvasSequence} [data=null] - An unrevived (i.e. freshly
   * transmitted) CanvasSequence. If present, the constructor revives the
   * sequence. Note that an already revived CanvasSequence cannot be used as the
   * argument here.
   */
  constructor(data = null) {
    /**
     * The CanvasAtoms that form the sequence.
     *
     * @private
     * @type {CanvasAtom[]}
     */
    this[symbols.sequence] = [];

    // If data is present, assume it is a CanvasSequence that needs reviving.
    if (data) this[symbols.fromJSON](data);
  }

  /**
   * Revive the sequence from transmitted JSON data.
   *
   * @private
   * @param {CanvasSequence} [data={}]
   */
  [symbols.fromJSON](data = {}) {
    data.sequence.forEach( ({ type, inst, args }) => {
      this[symbols.push](type, inst, ...args);
    });
  }

  /**
   * Push a new CanvasAtom onto the end of the sequence.
   *
   * @private
   * @param {...mixed} args - The arguments to the CanvasAtom constructor.
   */
  [symbols.push](...args) {
    this[symbols.sequence].push(new CanvasAtom(...args));
  }

  /**
   * Execute the sequence on the given context.
   *
   * @param {CanvasRenderingContext2D} context
   */
  execute(context) {
    context.save();
    this[symbols.sequence].forEach( a => a.execute(context) );
    context.restore();
  }

  /**
   * Export a JSON serialized version of the sequence, ready for transmission.
   *
   * @return {CanvasSequence} In JSON serialized form.
   */
  toJSON() {
    return { sequence: this[symbols.sequence] };
  }
}

locals.METHODS.forEach( m => {
  Object.defineProperty( CanvasSequence.prototype, m, {
    value: function pushMethodCall(...args) {
      this[symbols.push](CanvasAtom.METHOD, m, ...args);
    }, 
    writable: false,
    enumerable: true,
    configurable: false,
  });
});

locals.PROPERTIES.forEach( p => {
  Object.defineProperty( CanvasSequence.prototype, p, {
    get() { throw `Invalid canvas sequencer interaction, cannot get ${p}.` },
    set(v) { this[symbols.push](CanvasAtom.PROPERTY, p, v) },
    enumerable: true,
    configurable: false,
  });
});

module.exports = CanvasSequence;


},{"./CanvasAtom.js":2}]},{},[1])(1)
});
