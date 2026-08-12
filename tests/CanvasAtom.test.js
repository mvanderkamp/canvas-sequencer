/*
 * Test the CanvasAtom.
 */

/* global jest, describe, test, expect */

'use strict';

const CanvasAtom = require('../src/CanvasAtom.js');

const METHOD = CanvasAtom.METHOD;
const PROPERTY = CanvasAtom.PROPERTY;

describe('CanvasAtom', () => {
  describe(METHOD, () => {
    const args = [1, 2, 3, 0, Math.PI];

    describe('constructor(type, inst, args)', () => {
      test('creates a method atom', () => {
        // Given
        const ca = new CanvasAtom(METHOD, 'arc', args);

        // Then
        expect(ca.type).toEqual(METHOD);
        expect(ca.inst).toEqual('arc');
        expect(ca.args).toBeInstanceOf(Array);
        expect(ca.args).toEqual(args);
      });
    });

    describe('execute(context)', () => {
      test('calls its method on the context', () => {
        // Given
        const ctx = { 'arc': jest.fn() };
        const ca = new CanvasAtom(METHOD, 'arc', args);

        // When
        ca.execute(ctx);

        // Then
        expect(ctx.arc).toHaveBeenCalledTimes(1);
        expect(ctx.arc).toHaveBeenLastCalledWith(...args);
      });

      test('throws when the context does not implement its method', () => {
        // Given
        const ca = new CanvasAtom(METHOD, 'arc', args);

        // Then
        expect(() => ca.execute({})).toThrow(TypeError);
      });
    });
  });

  describe(PROPERTY, () => {
    const args = ['12px serif'];

    describe('constructor(type, inst, args)', () => {
      test('creates a property atom', () => {
        // Given
        const ca = new CanvasAtom(PROPERTY, 'font', args);

        // Then
        expect(ca.type).toEqual(PROPERTY);
        expect(ca.inst).toEqual('font');
        expect(ca.args).toBeInstanceOf(Array);
        expect(ca.args).toEqual(args);
      });
    });

    describe('execute(context)', () => {
      test('assigns its property on the context', () => {
        // Given
        const ctx = { 'font': '10px sans-serif' };
        const ca = new CanvasAtom(PROPERTY, 'font', args);

        // When
        ca.execute(ctx);

        // Then
        expect(ctx.font).toBe(...args);
      });
    });
  });
});
