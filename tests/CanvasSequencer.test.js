/*
 * This test suite is built for the CanvasSequencer class.
 */

'use strict';

const CanvasSequencer = require('../src/CanvasSequencer.js');
const CanvasAtom = require('../src/CanvasAtom.js');

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
      expect(cs[seq][0].type).toBe(CanvasAtom.METHOD);
      expect(cs[seq][0].inst).toBe('arc');
      expect(cs[seq][0].args).toEqual([0,1,2,3,Math.PI]);
    });

    test('Additional methods get pushed to end of sequence', () => {
      expect(() => cs.save()).not.toThrow();
      expect(cs[seq][1].type).toBe(CanvasAtom.METHOD);
      expect(cs[seq][1].inst).toBe('save');
      expect(cs[seq][1].args).toEqual([]);
    });
  });

  describe(CanvasAtom.PROPERTY, () => {
    const cs = new CanvasSequencer();
    const seq = Object.getOwnPropertySymbols(cs)[0];
    test('Can have properties pushed into its sequence', () => {
      expect(() => cs.lineJoin = 'bevel').not.toThrow();
      expect(cs[seq][0].type).toBe(CanvasAtom.PROPERTY);
      expect(cs[seq][0].inst).toBe('lineJoin');
      expect(cs[seq][0].args).toEqual(['bevel']);
    });

    test('Additional properties get pushed to end of sequence', () => {
      expect(() => cs.strokeStyle = 'blue').not.toThrow();
      expect(cs[seq][1].type).toBe(CanvasAtom.PROPERTY);
      expect(cs[seq][1].inst).toBe('strokeStyle');
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


