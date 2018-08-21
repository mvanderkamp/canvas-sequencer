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
  fromString: Symbol.for('fromString'),
});

class CanvasSequencer {
  constructor(str = null) {
    this[symbols.sequence] = [];
    if (str) this[symbols.fromString](str);
  }

  [symbols.fromString](str) {
    const data = JSON.parse(str);
    if (data && (data.sequence instanceof Array)) {
      data.sequence.forEach( ({ type, inst, args }) => {
        this[symbols.push](type, inst, ...args);
      });
    }
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

