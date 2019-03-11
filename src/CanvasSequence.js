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

