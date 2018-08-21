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

