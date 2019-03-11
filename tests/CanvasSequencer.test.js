/*
 * This test suite is built for the CanvasSequence class.
 */

'use strict';

const CanvasSequence = require('../src/CanvasSequence.js');
const CanvasAtom = require('../src/CanvasAtom.js');

describe('CanvasSequence', () => {
  describe('constructor()', () => {
    test('Returns an object of the correct type', () => {
      const cs = new CanvasSequence();
      expect(cs).toBeInstanceOf(CanvasSequence);
    });
  });

  describe('Instruction types', () => {
    describe(CanvasAtom.METHOD, () => {
      const cs = new CanvasSequence();
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
      const cs = new CanvasSequence();
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
  });

  describe('execute(context)', () => {
    const cs = new CanvasSequence();
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
    const cs = new CanvasSequence();
    cs.fillStyle = 'blue';
    cs.fillRect(5,6,7,8);

    test('Produces a JSON serializable object', () => {
      const data = cs.toJSON();
      let tojson, fromjson
      expect(typeof data).toBe('object');
      expect(() => tojson = JSON.stringify(data)).not.toThrow();
      expect(() => fromjson = JSON.parse(tojson)).not.toThrow();
      expect(typeof fromjson).toBe('object');
      expect(fromjson.sequence).toBeInstanceOf(Array);
    });
  });

  describe('[symbols.fromJSON](data)', () => {
    const cs = new CanvasSequence();
    cs.fillStyle = 'blue';
    cs.fillRect(5,6,7,8);
    const data = cs.toJSON();

    test('Produces a CanvasSequence object', () => {
      const seq = new CanvasSequence(data);
      expect(seq).toBeInstanceOf(CanvasSequence);
    });

    test('Reproduces the original sequence', () => {
      const seq = new CanvasSequence(data);
      expect(seq).toEqual(cs);
    });
  });
});


