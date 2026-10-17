var $a34aeb482b4675f0$exports = {};
/*
 * Access point for npm.
 */ 'use strict';
var $b8747ca94d510f97$exports = {};
/*
 * Author: Michael van der Kamp
 *
 * This file provides the definition of the CanvasSequence class.
 */ 'use strict';
var $db78e0b58fd8a4be$exports = {};
/*
 * Author: Michael van der Kamp
 *
 * This file defines the low level 'CanvasAtom' for use by a CanvasSequence.
 *
 * A CanvasAtom is a unit of execution in a CanvasSequence. It comes in two
 * flavours: one for describing a method call, one for describing a property
 * assignment.
 */ 'use strict';
/**
 * The types of CanvasAtoms that are available.
 *
 * @enum {string}
 * @readonly
 * @lends CanvasAtom
 */ const $db78e0b58fd8a4be$var$TYPES = {
    /** @const */ 'METHOD': 'method',
    /** @const */ 'PROPERTY': 'property'
};
/**
 * Internal common constructor definition for Canvas Atoms.
 *
 * @param {string} inst - The canvas context instruction.
 * @param {*[]} args - The arguments to the instruction.
 */ class $db78e0b58fd8a4be$var$Atom {
    constructor(inst, args){
        /**
     * The canvas context instruction.
     *
     * @private
     * @type {string}
     */ this.inst = inst;
        /**
     * The arguments to the instruction.
     *
     * @private
     * @type {*[]}
     */ this.args = args;
    }
}
/**
 * A MethodCanvasAtom is used for canvas context methods. The arguments will be
 * treated as an actual array, all of which will be passed to the method when
 * the atom is executed.
 *
 * @extends Atom
 */ class $db78e0b58fd8a4be$var$MethodCanvasAtom extends $db78e0b58fd8a4be$var$Atom {
    constructor(inst, args){
        super(inst, args);
        /**
     * The type of atom.
     *
     * @private
     * @type {string}
     */ this.type = $db78e0b58fd8a4be$var$TYPES.METHOD;
    }
    /**
   * Execute the atom on the given context.
   *
   * @param {CanvasRenderingContext2D} context
   */ execute(context) {
        context[this.inst](...this.args);
    }
}
/**
 * A PropertyCanvasAtom is used for canvas context properties (a.k.a. fields).
 * Only the first argument will be used, and will be the value assigned to the
 * field.
 *
 * @extends Atom
 */ class $db78e0b58fd8a4be$var$PropertyCanvasAtom extends $db78e0b58fd8a4be$var$Atom {
    constructor(inst, args){
        super(inst, args);
        this.type = $db78e0b58fd8a4be$var$TYPES.PROPERTY;
    }
    /**
   * Execute the atom on the given context.
   *
   * @param {CanvasRenderingContext2D} context
   */ execute(context) {
        context[this.inst] = this.args[0];
    }
}
/*
 * This object is for demultiplexing types in the CanvasAtom constructor.
 * Defined outside the constructor so it doesn't need to be redefined every
 * time a new atom is constructed. Defined outside the class so that it is not
 * externally exposed.
 */ const $db78e0b58fd8a4be$var$atomOf = {
    [$db78e0b58fd8a4be$var$TYPES.METHOD]: $db78e0b58fd8a4be$var$MethodCanvasAtom,
    [$db78e0b58fd8a4be$var$TYPES.PROPERTY]: $db78e0b58fd8a4be$var$PropertyCanvasAtom
};
/**
 * The exposed CanvasAtom class. Results in the instantiation of either a
 * MethodCanvasAtom or a PropertyCanvasAtom, depending on the given type.
 *
 * @param {string} type - Either CanvasAtom.METHOD or CanvasAtom.PROPERTY.
 * @param {string} inst - The canvas context instruction.
 * @param {*[]} args - The arguments to the instruction.
 */ class $db78e0b58fd8a4be$var$CanvasAtom {
    constructor(type, inst, args){
        return new $db78e0b58fd8a4be$var$atomOf[type](inst, args);
    }
}
/*
 * Define the types once locally, but make them available externally as
 * immutable properties on the class.
 */ Object.entries($db78e0b58fd8a4be$var$TYPES).forEach(([p, v])=>{
    Object.defineProperty($db78e0b58fd8a4be$var$CanvasAtom, p, {
        'value': v,
        'configurable': false,
        'enumerable': true,
        'writable': false
    });
});
$db78e0b58fd8a4be$exports = $db78e0b58fd8a4be$var$CanvasAtom;


var $6af0a5af345fec82$exports = {};
/*
 * Author: Michael van der Kamp
 *
 * This file defines the CanvasRenderingContext2D instructions supported by
 * CanvasSequence.
 */ 'use strict';
$6af0a5af345fec82$exports = Object.freeze({
    'METHODS': Object.freeze([
        'addHitRegion',
        'arc',
        'arcTo',
        'beginPath',
        'bezierCurveTo',
        'clearHitRegions',
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
        'reset',
        'removeHitRegion',
        'resetTransform',
        'restore',
        'rotate',
        'roundRect',
        'save',
        'scale',
        'scrollPathIntoView',
        'setLineDash',
        'setTransform',
        'stroke',
        'strokeRect',
        'strokeText',
        'transform',
        'translate'
    ]),
    'PROPERTIES': Object.freeze([
        'direction',
        'fillStyle',
        'filter',
        'font',
        'fontKerning',
        'fontStretch',
        'fontVariantCaps',
        'globalAlpha',
        'globalCompositeOperation',
        'imageSmoothingEnabled',
        'imageSmoothingQuality',
        'letterSpacing',
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
        'textRendering',
        'wordSpacing'
    ])
});


// Mark properties as intended for internal use.
const $b8747ca94d510f97$var$symbols = Object.freeze({
    'sequence': Symbol.for('sequence'),
    'push': Symbol.for('push'),
    'fromJSON': Symbol.for('fromJSON')
});
/**
 * A CanvasSequence is a linear collection of CanvasAtoms, capable of being
 * executed on a CanvasRenderingContext2D.
 *
 * @param {CanvasSequence} [data=null] - An unrevived (i.e. freshly transmitted)
 * CanvasSequence. If present, the constructor revives the sequence. Note that
 * an already revived CanvasSequence cannot be used as the argument here.
 */ class $b8747ca94d510f97$var$CanvasSequence {
    constructor(data = null){
        /**
     * The CanvasAtoms that form the sequence.
     *
     * @private
     * @type {CanvasAtom[]}
     */ this[$b8747ca94d510f97$var$symbols.sequence] = [];
        // If data is present, assume it is a CanvasSequence that needs reviving.
        if (data) this[$b8747ca94d510f97$var$symbols.fromJSON](data);
    }
    /**
   * Revive the sequence from transmitted JSON data.
   *
   * @private
   * @param {CanvasSequence} [data={}]
   */ [$b8747ca94d510f97$var$symbols.fromJSON](data = {
        'sequence': []
    }) {
        data.sequence.forEach(({ type: type, inst: inst, args: args })=>{
            this[$b8747ca94d510f97$var$symbols.push](type, inst, args);
        });
    }
    /**
   * Push a new CanvasAtom onto the end of the sequence.
   *
   * @private
   * @param {string} type - The type of CanvasAtom to push.
   * @param {string} inst - The canvas context instruction.
   * @param {*[]} args - The arguments to the canvas context instruction.
   */ [$b8747ca94d510f97$var$symbols.push](type, inst, args) {
        this[$b8747ca94d510f97$var$symbols.sequence].push(new $db78e0b58fd8a4be$exports(type, inst, args));
    }
    /**
   * Execute the sequence on the given context.
   *
   * @param {CanvasRenderingContext2D} context
   */ execute(context) {
        context.save();
        this[$b8747ca94d510f97$var$symbols.sequence].forEach((a)=>a.execute(context));
        context.restore();
    }
    /**
   * Export a JSON serialized version of the sequence, ready for transmission.
   *
   * @return {CanvasSequence} In JSON serialized form.
   */ toJSON() {
        return {
            'sequence': this[$b8747ca94d510f97$var$symbols.sequence]
        };
    }
}
$6af0a5af345fec82$exports.METHODS.forEach((m)=>{
    Object.defineProperty($b8747ca94d510f97$var$CanvasSequence.prototype, m, {
        'value': function pushMethodCall(...args) {
            this[$b8747ca94d510f97$var$symbols.push]($db78e0b58fd8a4be$exports.METHOD, m, args);
        },
        'writable': false,
        'enumerable': true,
        'configurable': false
    });
});
$6af0a5af345fec82$exports.PROPERTIES.forEach((p)=>{
    Object.defineProperty($b8747ca94d510f97$var$CanvasSequence.prototype, p, {
        get () {
            throw `Invalid canvas sequencer interaction, cannot get ${p}.`;
        },
        set (v) {
            this[$b8747ca94d510f97$var$symbols.push]($db78e0b58fd8a4be$exports.PROPERTY, p, [
                v
            ]);
        },
        'enumerable': true,
        'configurable': false
    });
});
$b8747ca94d510f97$exports = $b8747ca94d510f97$var$CanvasSequence;


var $ae1fef0ce871a4a6$exports = {};
/*
 * Author: Michael van der Kamp
 *
 * This file provides the definition of the CanvasBlueprint class.
 *
 * A CanvasBlueprint is similar to a plain CanvasSequence, except that it
 * accepts tag strings as arguments, and before it can be executed it  needs to
 * be 'built' with an object defining which values should replace the tags.
 */ 'use strict';

// Mark properties as intended for internal use.
const $ae1fef0ce871a4a6$var$symbols = Object.freeze({
    'sequence': Symbol.for('sequence'),
    'push': Symbol.for('push')
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
 */ function $ae1fef0ce871a4a6$var$replaceTags(str, values) {
    const tag = str.replace(/^\{|\}$/gu, '');
    if (tag !== str) return Object.hasOwn(values, tag) ? values[tag] : tag;
    return str;
}
/**
 * A CanvasBlueprint is a rebuildable CanvasSequence. It accepts tagged
 * arguments. When built, tags will be replaced using properties from a provided
 * object.
 *
 * @extends CanvasSequence
 */ class $ae1fef0ce871a4a6$var$CanvasBlueprint extends $b8747ca94d510f97$exports {
    /**
   * Build the blueprint using the provided values.
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
   */ build(values = {}) {
        const seq = new $b8747ca94d510f97$exports();
        this[$ae1fef0ce871a4a6$var$symbols.sequence].forEach(({ type: type, inst: inst, args: args })=>{
            const realArgs = args.map((v)=>{
                return typeof v === 'string' ? $ae1fef0ce871a4a6$var$replaceTags(v, values) : v;
            });
            seq[$ae1fef0ce871a4a6$var$symbols.push](type, inst, realArgs);
        });
        return seq;
    }
    /**
   * CanvasBlueprints cannot be directly executed!
   *
   * @throws TypeError
   */ execute() {
        throw new TypeError('Cannot execute a blueprint.');
    }
}
$ae1fef0ce871a4a6$exports = $ae1fef0ce871a4a6$var$CanvasBlueprint;


$a34aeb482b4675f0$exports = {
    CanvasSequence: $b8747ca94d510f97$exports,
    CanvasBlueprint: $ae1fef0ce871a4a6$exports
};


export {$a34aeb482b4675f0$exports as default};
