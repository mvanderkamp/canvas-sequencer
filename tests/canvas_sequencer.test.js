/*
 * This test suite is built for the canvas sequencer library utility.
 */

'use strict';

const lib = require('../libs/canvas_sequencer.js');
const CanvasSequencer = lib.CanvasSequencer;
const CanvasAtom = lib.CanvasAtom;

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
    ctx.save = jest.fn();
    ctx.strokeStyle = 'red';
    cs.arc(0,1,2,3,Math.PI);
    cs.lineJoin = 'bevel';
    cs.save();
    cs.strokeStyle = 'blue';
    cs.strokeStyle = 'green';

    test('Executes sequence in order', () => {
      expect(() => cs.execute(ctx)).not.toThrow();
      expect(ctx.arc).toHaveBeenCalledTimes(1);
      expect(ctx.arc).toHaveBeenCalledWith(0,1,2,3,Math.PI);
      expect(ctx.save).toHaveBeenCalledTimes(1);
      expect(ctx.save).toHaveBeenCalledWith();
      expect(ctx.lineJoin).toBe('bevel');
      expect(ctx.strokeStyle).toBe('green');
    });

  });
});





