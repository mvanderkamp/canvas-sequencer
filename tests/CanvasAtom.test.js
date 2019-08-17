/*
 * Test the CanvasAtom.
 */

/* global jest, describe, test, expect */

'use strict';

const CanvasAtom = require('../src/CanvasAtom.js');

const M = CanvasAtom.METHOD;

describe('CanvasAtom', () => {
  describe(M, () => {
    describe('constructor(type, inst, ...args)', () => {
      test('Returns a valid object of correct type', () => {
        const ca = new CanvasAtom(M, 'arc', 1, 2, 3, 0, Math.PI);
        expect(ca.type).toEqual(M);
        expect(ca.inst).toEqual('arc');
        expect(ca.args).toBeInstanceOf(Array);
        expect(ca.args).toEqual([1, 2, 3, 0, Math.PI]);
      });
    });

    describe('execute(context)', () => {
      const ctx = {};
      ctx.arc = jest.fn();
      const ca = new CanvasAtom(M, 'arc', 1, 2, 3, 0, Math.PI);
      test('Executes its method on the context', () => {
        expect(() => ca.execute(ctx)).not.toThrow();
        expect(ctx.arc).toHaveBeenCalledTimes(1);
        expect(ctx.arc).toHaveBeenLastCalledWith(1, 2, 3, 0, Math.PI);
      });
    });
  });

  describe(CanvasAtom.PROPERTY, () => {
    describe('constructor(type, inst, ...args)', () => {
      test('Returns a valid object of correct type', () => {
        const ca = new CanvasAtom(CanvasAtom.PROPERTY, 'font', '12px serif');
        expect(ca.type).toEqual(CanvasAtom.PROPERTY);
        expect(ca.inst).toEqual('font');
        expect(ca.args).toBeInstanceOf(Array);
        expect(ca.args).toEqual(['12px serif']);
      });
    });

    describe('execute(context)', () => {
      const ctx = {};
      ctx.font = '10px sans-serif';
      const ca = new CanvasAtom(CanvasAtom.PROPERTY, 'font', '12px serif');
      test('Assigns its property on the context', () => {
        expect(() => ca.execute(ctx)).not.toThrow();
        expect(ctx.font).toBe('12px serif');
      });
    });
  });
});

