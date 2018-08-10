/*
 * This test suite is built for the canvas sequencer library utility.
 */

'use strict';

const lib = require('../src/canvas_sequencer.js');
const CanvasSequencer = lib.CanvasSequencer;
const CanvasAtom = lib.CanvasAtom;
const Blueprint = lib.Blueprint;

describe('CanvasAtom', () => {
  describe(CanvasAtom.METHOD, () => {
    describe('constructor(type, value, ...args)', () => {
      test('Returns a valid object of correct type', () => {
        const ca = new CanvasAtom(CanvasAtom.METHOD,'arc',1,2,3,0,Math.PI);
        expect(ca).toBeInstanceOf(CanvasAtom);
        expect(ca.type).toEqual(CanvasAtom.METHOD);
        expect(ca.value).toEqual('arc');
        expect(ca.args).toBeInstanceOf(Array);
        expect(ca.args).toEqual([1,2,3,0,Math.PI]);
      });
    });

    describe('execute(context)', () => {
      const ctx = {};
      ctx.arc = jest.fn();
      const ca = new CanvasAtom(CanvasAtom.METHOD,'arc',1,2,3,0,Math.PI);
      test('Executes its method on the context', () => {
        expect(() => ca.execute(ctx)).not.toThrow();
        expect(ctx.arc).toHaveBeenCalledTimes(1);
        expect(ctx.arc).toHaveBeenLastCalledWith(1,2,3,0,Math.PI);
      });
    });
  });

  describe(CanvasAtom.PROPERTY, () => {
    describe('constructor(type, value, ...args)', () => {
      test('Returns a valid object of correct type', () => {
        const ca = new CanvasAtom(CanvasAtom.PROPERTY,'font','12px serif');
        expect(ca).toBeInstanceOf(CanvasAtom);
        expect(ca.type).toEqual(CanvasAtom.PROPERTY);
        expect(ca.value).toEqual('font');
        expect(ca.args).toBeInstanceOf(Array);
        expect(ca.args).toEqual(['12px serif']);
      });
    });

    describe('execute(context)', () => {
      const ctx = {};
      ctx.font = '10px sans-serif';
      const ca = new CanvasAtom(CanvasAtom.PROPERTY,'font','12px serif');
      test('Assigns its property on the context', () => {
        expect(() => ca.execute(ctx)).not.toThrow();
        expect(ctx.font).toBe('12px serif');
      });
    });
  });
});

describe('CanvasSequencer', () => {
  describe('constructor()', () => {
    test('Returns an object of the correct type', () => {
      const cs = new CanvasSequencer();
      expect(cs).toBeInstanceOf(CanvasSequencer);
    });
  });

  describe(CanvasAtom.METHOD, () => {
    const cs = new CanvasSequencer();
    const seq = Object.getOwnPropertySymbols(cs)[0];
    test('Can have methods pushed into its sequence', () => {
      expect(() => cs.arc(0,1,2,3,Math.PI)).not.toThrow();
      expect(cs[seq][0]).toBeInstanceOf(CanvasAtom);
      expect(cs[seq][0].type).toBe(CanvasAtom.METHOD);
      expect(cs[seq][0].value).toBe('arc');
      expect(cs[seq][0].args).toEqual([0,1,2,3,Math.PI]);
    });

    test('Additional methods get pushed to end of sequence', () => {
      expect(() => cs.save()).not.toThrow();
      expect(cs[seq][1]).toBeInstanceOf(CanvasAtom);
      expect(cs[seq][1].type).toBe(CanvasAtom.METHOD);
      expect(cs[seq][1].value).toBe('save');
      expect(cs[seq][1].args).toEqual([]);
    });
  });

  describe(CanvasAtom.PROPERTY, () => {
    const cs = new CanvasSequencer();
    const seq = Object.getOwnPropertySymbols(cs)[0];
    test('Can have properties pushed into its sequence', () => {
      expect(() => cs.lineJoin = 'bevel').not.toThrow();
      expect(cs[seq][0]).toBeInstanceOf(CanvasAtom);
      expect(cs[seq][0].type).toBe(CanvasAtom.PROPERTY);
      expect(cs[seq][0].value).toBe('lineJoin');
      expect(cs[seq][0].args).toEqual(['bevel']);
    });

    test('Additional properties get pushed to end of sequence', () => {
      expect(() => cs.strokeStyle = 'blue').not.toThrow();
      expect(cs[seq][1]).toBeInstanceOf(CanvasAtom);
      expect(cs[seq][1].type).toBe(CanvasAtom.PROPERTY);
      expect(cs[seq][1].value).toBe('strokeStyle');
      expect(cs[seq][1].args).toEqual(['blue']);
    });
  });

  describe('execute(context)', () => {
    const cs = new CanvasSequencer();
    const ctx = {};
    ctx.arc = jest.fn();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'red';
    ctx.save = jest.fn();
    ctx.restore = jest.fn();
    cs.arc(0,1,2,3,Math.PI);
    cs.lineJoin = 'bevel';
    cs.strokeStyle = 'blue';
    cs.strokeStyle = 'green';

    test('Executes sequence in order', () => {
      expect(() => cs.execute(ctx)).not.toThrow();
      expect(ctx.arc).toHaveBeenCalledTimes(1);
      expect(ctx.arc).toHaveBeenCalledWith(0,1,2,3,Math.PI);
      expect(ctx.lineJoin).toBe('bevel');
      expect(ctx.strokeStyle).toBe('green');
    });
  });

  describe('toJSON()', () => {
    const cs = new CanvasSequencer();
    cs.fillStyle = 'blue';
    cs.fillRect(5,6,7,8);

    test('Produces a JSON parsable string', () => {
      const str = cs.toJSON();
      expect(typeof str).toBe('string');
      expect(() => JSON.parse(str)).not.toThrow();
      const obj = JSON.parse(str);
      expect(typeof obj).toBe('object');
    });
  });

  describe('.fromString(str)', () => {
    const cs = new CanvasSequencer();
    cs.fillStyle = 'blue';
    cs.fillRect(5,6,7,8);
    const str = cs.toJSON();
    
    test('Produces a CanvasSequencer object', () => {
      const seq = CanvasSequencer.fromString(str);
      expect(seq).toBeInstanceOf(CanvasSequencer);
    });

    test('Reproduces the original sequence', () => {
      const seq = CanvasSequencer.fromString(str);
      expect(seq).toEqual(cs);
    });
  });
});

describe('Blueprint', () => {
  describe('constructor()', () => {
    test('Constructs a blueprint', () => {
      expect(() => new Blueprint()).not.toThrow();
      expect(new Blueprint()).toBeInstanceOf(Blueprint);
    });
  });

  describe('execute()', () => {
    test('Throws an exception, blueprints cannot be executed!', () => {
      expect(() => new Blueprint().execute()).toThrow();
    });
  });

  describe('sequencing', () => {
    test('Can define sequences on the blueprint', () => {
      const bp = new Blueprint();
      expect(() => {
        bp.lineWidth = 2;
        bp.moveTo(42,70);
        bp.fillText('{{x}}',5,6);
        bp.fillText('y',7,8);
        bp.fillRect('{x}','{y}',30,40);
      }).not.toThrow();
    });
  }); 
  
  describe('build(values)', () => {
    const bp = new Blueprint();
    bp.lineWidth = 2;
    bp.moveTo(42,70);
    bp.fillText('{{x}}',5,6);
    bp.strokeText('y',7,8);
    bp.fillRect('{x}','{y}',30,40);
    bp.font = '2.5em monospace';
    bp.lineWidth = 8;

    const values = { x: 250, y: 99 };
    const ctx = {
      save: jest.fn(),
      restore: jest.fn(),
      fillRect: jest.fn(),
      moveTo: jest.fn(),
      lineWidth: 1,
      font: '16px serif',
      fillText: jest.fn(),
      strokeText: jest.fn(),
    };

    test('Produces a CanvasSequencer', () => {
      expect(bp.build()).toBeInstanceOf(CanvasSequencer);
    });

    test('Produced CanvasSequencer can be executed', () => {
      expect(() => bp.build(values).execute(ctx)).not.toThrow();
    });

    test('Instructions are executed in the correct sequence', () => {
      expect(ctx.lineWidth).toBe(8);
      expect(ctx.moveTo).toHaveBeenCalledTimes(1);
      expect(ctx.fillText).toHaveBeenCalledTimes(1);
      expect(ctx.fillRect).toHaveBeenCalledTimes(1);
      expect(ctx.strokeText).toHaveBeenCalledTimes(1);
      expect(ctx.font).toBe('2.5em monospace');
    });

    test('Non-string arguments are passed through', () => {
      expect(ctx.moveTo).toHaveBeenLastCalledWith(42,70);
    });

    test('Plain string arguments are passed through', () => {
      expect(ctx.strokeText).toHaveBeenLastCalledWith('y',7,8);
    });

    test('Double tag markers at start or end are reduced to single', () => {
      expect(ctx.fillText).toHaveBeenLastCalledWith('{x}',5,6);
    });

    test('Tags are replaced with values passed to build()', () => {
      expect(ctx.fillRect).toHaveBeenLastCalledWith(250,99,30,40);
    });

    test('Can be rebuilt correctly', () => {
      const values = { x: 101, y: 42 };
      expect(() => bp.build(values).execute(ctx)).not.toThrow();
      expect(ctx.fillRect).toHaveBeenLastCalledWith(101,42,30,40);
    });
  });
});

