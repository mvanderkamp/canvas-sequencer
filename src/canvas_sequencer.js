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

/*
 * A CanvasAtom is a unit of execution in a CanvasSequence. It comes in two
 * flavours: one for describing a method call, one for describing a property
 * assignment.
 */
const CanvasAtom = (function defineCanvasAtom() {
  const locals = Object.freeze({
    METHOD: 'method',
    PROPERTY: 'property',
  });

  /*
   * Internal common constructor definition.
   */
  class Atom {
    constructor(type, value, args) {
      this.type = type;
      this.value = value;
      this.args = args;
    }
  }

  /*
   * Each flavour needs its own execute() definition.
   */
  class MethodCanvasAtom extends Atom {
    execute(context) {
      context[this.value](...this.args);
    }
  }

  class PropertyCanvasAtom extends Atom {
    execute(context) {
      context[this.value] = this.args[0];
    }
  }

  /*
   * The CanvasAtom is the class that will be exposed.
   * I'm not sure I like the way this is structured, but at least it's better
   * than 'switch'ing on the type every time execute() is called. This way, we
   * only have to 'switch' once.
   */
  class CanvasAtom {
    constructor(type, value, ...args) {
      switch (type) {
        case locals.METHOD: 
          return new MethodCanvasAtom(type, value, args);
          break;
        case locals.PROPERTY:
          return new PropertyCanvasAtom(type, value, args);
          break;
      }
    }
  }

  Object.entries(locals).forEach( ([p,v]) => {
    Object.defineProperty( CanvasAtom, p, {
      value: v,
      configurable: false,
      enumerable: true,
      writable: false,
    });
  });

  return CanvasAtom;
})();

const CanvasSequencer = (function defineCanvasSequencer() {
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
      obj.sequence.forEach( a => {
        const [type, property, args] = Object.values(a);
        seq[symbols.push](type, property, ...args);
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

  return CanvasSequencer;
})();

const Blueprint = (function defineBlueprint() {
  const symbols = Object.freeze({
    sequence: Symbol.for('sequence'),
    push: Symbol.for('push'),
  });

  class Blueprint extends CanvasSequencer {
    constructor() {
      super();
    }

    build(values = {}) {
      const seq = new CanvasSequencer();
      this[symbols.sequence].forEach( a => {
        const [type, value, args] = Object.values(a);
        const realArgs = args.map( v => {
          let retval = v;
          if (typeof v === 'string') {
            const tag = v.replace(/^{|}$/g, '');
            if (tag !== v) {
              retval = values.hasOwnProperty(tag) ? values[tag] : tag;
            }
          }
          return retval;
        });
        seq[symbols.push](type, value, ...realArgs);
      });
      return seq;
    }

    execute() {
      throw 'Cannot execute a blueprint.';
    }
  }

  Blueprint.fromString = function(str = null) {
    const obj = JSON.parse(str);
    if (obj && (obj.sequence instanceof Array)) {
      const seq = new Blueprint();
      obj.sequence.forEach( a => {
        const [type, property, args] = Object.values(a);
        seq[symbols.push](type, property, ...args);
      });
      return seq;
    }
    return null;
  }

  return Blueprint;
})();

if (typeof exports !== 'undefined') {
  exports.CanvasSequencer = CanvasSequencer;
  exports.CanvasAtom = CanvasAtom;
  exports.Blueprint = Blueprint;
}

