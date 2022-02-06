/*
 * Access point for npm.
 */ 'use strict';
var $663f930907ca9f24$exports = {};
/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
 *
 * This file provides the definition of the CanvasSequence class.
 */ 'use strict';
var $9a8fdc9f7382f5d6$exports = {};
/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
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
 */ const $9a8fdc9f7382f5d6$var$TYPES = {
    /** @const */ METHOD: 'method',
    /** @const */ PROPERTY: 'property'
};
/**
 * Internal common constructor definition for Canvas Atoms.
 *
 * @param {string} inst - The canvas context instruction.
 * @param {*[]} args - The arguments to the instruction.
 */ class $9a8fdc9f7382f5d6$var$Atom {
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
 */ class $9a8fdc9f7382f5d6$var$MethodCanvasAtom extends $9a8fdc9f7382f5d6$var$Atom {
    constructor(inst, args){
        super(inst, args);
        /**
     * The type of atom.
     *
     * @private
     * @type {string}
     */ this.type = $9a8fdc9f7382f5d6$var$TYPES.METHOD;
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
 */ class $9a8fdc9f7382f5d6$var$PropertyCanvasAtom extends $9a8fdc9f7382f5d6$var$Atom {
    constructor(inst, args){
        super(inst, args);
        this.type = $9a8fdc9f7382f5d6$var$TYPES.PROPERTY;
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
 */ const $9a8fdc9f7382f5d6$var$atomOf = {
    [$9a8fdc9f7382f5d6$var$TYPES.METHOD]: $9a8fdc9f7382f5d6$var$MethodCanvasAtom,
    [$9a8fdc9f7382f5d6$var$TYPES.PROPERTY]: $9a8fdc9f7382f5d6$var$PropertyCanvasAtom
};
/**
 * The exposed CanvasAtom class. Results in the instantiation of either a
 * MethodCanvasAtom or a PropertyCanvasAtom, depending on the given type.
 *
 * @param {string} type - Either CanvasAtom.METHOD or CanvasAtom.PROPERTY.
 * @param {string} inst - The canvas context instruction.
 * @param {*[]} args - The arguments to the instruction.
 */ class $9a8fdc9f7382f5d6$var$CanvasAtom {
    constructor(type, inst, args){
        return new $9a8fdc9f7382f5d6$var$atomOf[type](inst, args);
    }
}
/*
 * Define the types once locally, but make them available externally as
 * immutable properties on the class.
 */ Object.entries($9a8fdc9f7382f5d6$var$TYPES).forEach(([p, v])=>{
    Object.defineProperty($9a8fdc9f7382f5d6$var$CanvasAtom, p, {
        value: v,
        configurable: false,
        enumerable: true,
        writable: false
    });
});
$9a8fdc9f7382f5d6$exports = $9a8fdc9f7382f5d6$var$CanvasAtom;


const $663f930907ca9f24$var$locals = Object.freeze({
    METHODS: [
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
        'removeHitRegion',
        'resetTransform',
        'restore',
        'rotate',
        'save',
        'scale',
        'scrollPathIntoView',
        'setLineDash',
        'setTransform',
        'stroke',
        'strokeRect',
        'strokeText',
        'transform',
        'translate', 
    ],
    PROPERTIES: [
        'direction',
        'fillStyle',
        'filter',
        'font',
        'globalAlpha',
        'globalCompositeOperation',
        'imageSmoothingEnabled',
        'imageSmoothingQuality',
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
    ]
});
// Mark properties as intended for internal use.
const $663f930907ca9f24$var$symbols = Object.freeze({
    sequence: Symbol.for('sequence'),
    push: Symbol.for('push'),
    fromJSON: Symbol.for('fromJSON')
});
/**
 * A CanvasSequence is a linear collection of CanvasAtoms, capable of being
 * executed on a CanvasRenderingContext2D.
 *
 * @param {CanvasSequence} [data=null] - An unrevived (i.e. freshly transmitted)
 * CanvasSequence. If present, the constructor revives the sequence. Note that
 * an already revived CanvasSequence cannot be used as the argument here.
 */ class $663f930907ca9f24$var$CanvasSequence {
    constructor(data = null){
        /**
     * The CanvasAtoms that form the sequence.
     *
     * @private
     * @type {CanvasAtom[]}
     */ this[$663f930907ca9f24$var$symbols.sequence] = [];
        // If data is present, assume it is a CanvasSequence that needs reviving.
        if (data) this[$663f930907ca9f24$var$symbols.fromJSON](data);
    }
    /**
   * Revive the sequence from transmitted JSON data.
   *
   * @private
   * @param {CanvasSequence} [data={}]
   */ [$663f930907ca9f24$var$symbols.fromJSON](data = {
        sequence: []
    }) {
        data.sequence.forEach(({ type: type , inst: inst , args: args  })=>{
            this[$663f930907ca9f24$var$symbols.push](type, inst, args);
        });
    }
    /**
   * Push a new CanvasAtom onto the end of the sequence.
   *
   * @private
   * @param {string} type - The type of CanvasAtom to push.
   * @param {string} inst - The canvas context instruction.
   * @param {*[]} args - The arguments to the canvas context instruction.
   */ [$663f930907ca9f24$var$symbols.push](type, inst, args) {
        this[$663f930907ca9f24$var$symbols.sequence].push(new $9a8fdc9f7382f5d6$exports(type, inst, args));
    }
    /**
   * Execute the sequence on the given context.
   *
   * @param {CanvasRenderingContext2D} context
   */ execute(context) {
        context.save();
        this[$663f930907ca9f24$var$symbols.sequence].forEach((a)=>a.execute(context)
        );
        context.restore();
    }
    /**
   * Export a JSON serialized version of the sequence, ready for transmission.
   *
   * @return {CanvasSequence} In JSON serialized form.
   */ toJSON() {
        return {
            sequence: this[$663f930907ca9f24$var$symbols.sequence]
        };
    }
}
$663f930907ca9f24$var$locals.METHODS.forEach((m)=>{
    Object.defineProperty($663f930907ca9f24$var$CanvasSequence.prototype, m, {
        value: function pushMethodCall(...args) {
            this[$663f930907ca9f24$var$symbols.push]($9a8fdc9f7382f5d6$exports.METHOD, m, args);
        },
        writable: false,
        enumerable: true,
        configurable: false
    });
});
$663f930907ca9f24$var$locals.PROPERTIES.forEach((p)=>{
    Object.defineProperty($663f930907ca9f24$var$CanvasSequence.prototype, p, {
        get () {
            throw `Invalid canvas sequencer interaction, cannot get ${p}.`;
        },
        set (v) {
            this[$663f930907ca9f24$var$symbols.push]($9a8fdc9f7382f5d6$exports.PROPERTY, p, [
                v
            ]);
        },
        enumerable: true,
        configurable: false
    });
});
$663f930907ca9f24$exports = $663f930907ca9f24$var$CanvasSequence;


var $4fabbdeef1f2d4ae$exports = {};
/*
 * Author: Michael van der Kamp
 * Date: July/August, 2018
 *
 * Thie file provides the definition of the CanvasBlueprint class.
 *
 * A CanvasBlueprint is similar to a plain CanvasSequence, except that it
 * accepts tag strings as arguments, and before it can be executed it  needs to
 * be 'built' with an object defining which values should replace the tags.
 */ 'use strict';

// Mark properties as intended for internal use.
const $4fabbdeef1f2d4ae$var$symbols = Object.freeze({
    sequence: Symbol.for('sequence'),
    push: Symbol.for('push')
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
 */ function $4fabbdeef1f2d4ae$var$replaceTags(str, values) {
    const tag = str.replace(/^\{|\}$/gu, '');
    if (tag !== str) return values.hasOwnProperty(tag) ? values[tag] : tag;
    return str;
}
/**
 * A CanvasBlueprint is a rebuildable CanvasSequence. It accepts tagged
 * arguments. When built, tags will be replaced using properties from a provided
 * object.
 *
 * @extends CanvasSequence
 */ class $4fabbdeef1f2d4ae$var$CanvasBlueprint extends $663f930907ca9f24$exports {
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
   */ build(values = {
    }) {
        const seq = new $663f930907ca9f24$exports();
        this[$4fabbdeef1f2d4ae$var$symbols.sequence].forEach(({ type: type , inst: inst , args: args  })=>{
            const realArgs = args.map((v)=>{
                return typeof v === 'string' ? $4fabbdeef1f2d4ae$var$replaceTags(v, values) : v;
            });
            seq[$4fabbdeef1f2d4ae$var$symbols.push](type, inst, realArgs);
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
$4fabbdeef1f2d4ae$exports = $4fabbdeef1f2d4ae$var$CanvasBlueprint;


module.exports = {
    CanvasSequence: $663f930907ca9f24$exports,
    CanvasBlueprint: $4fabbdeef1f2d4ae$exports
};


//# sourceMappingURL=index.js.map
