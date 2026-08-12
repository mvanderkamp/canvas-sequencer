/*
 * This test suite is built for the CanvasSequence class.
 */

/* global jest, describe, test, expect */

'use strict';

const CanvasSequence = require('../src/CanvasSequence.js');
const CanvasAtom = require('../src/CanvasAtom.js');

describe('CanvasSequence', () => {
  describe('constructor()', () => {
    test('creates a CanvasSequence', () => {
      // When
      const cs = new CanvasSequence();

      // Then
      expect(cs).toBeInstanceOf(CanvasSequence);
    });
  });

  describe('Instruction types', () => {
    describe(CanvasAtom.METHOD, () => {
      test('records a method call', () => {
        // Given
        const cs = new CanvasSequence();
        const seq = Symbol.for('sequence');

        // When
        cs.arc(0, 1, 2, 3, Math.PI);

        // Then
        expect(cs[seq][0].type).toBe(CanvasAtom.METHOD);
        expect(cs[seq][0].inst).toBe('arc');
        expect(cs[seq][0].args).toEqual([0, 1, 2, 3, Math.PI]);
      });

      test('appends a method after existing instructions', () => {
        // Given
        const cs = new CanvasSequence();
        const seq = Symbol.for('sequence');
        cs.arc(0, 1, 2, 3, Math.PI);

        // When
        cs.save();

        // Then
        expect(cs[seq][1].type).toBe(CanvasAtom.METHOD);
        expect(cs[seq][1].inst).toBe('save');
        expect(cs[seq][1].args).toEqual([]);
      });
    });

    describe(CanvasAtom.PROPERTY, () => {
      test('records a property assignment', () => {
        // Given
        const cs = new CanvasSequence();
        const seq = Symbol.for('sequence');

        // When
        cs.lineJoin = 'bevel';

        // Then
        expect(cs[seq][0].type).toBe(CanvasAtom.PROPERTY);
        expect(cs[seq][0].inst).toBe('lineJoin');
        expect(cs[seq][0].args).toEqual(['bevel']);
      });

      test('appends a property after existing instructions', () => {
        // Given
        const cs = new CanvasSequence();
        const seq = Symbol.for('sequence');
        cs.lineJoin = 'bevel';

        // When
        cs.strokeStyle = 'blue';

        // Then
        expect(cs[seq][1].type).toBe(CanvasAtom.PROPERTY);
        expect(cs[seq][1].inst).toBe('strokeStyle');
        expect(cs[seq][1].args).toEqual(['blue']);
      });

      test('throws when reading a property', () => {
        // Given
        const cs = new CanvasSequence();

        // Then
        expect(() => cs.strokeStyle).toThrow();
      });
    });
  });

  describe('execute(context)', () => {
    test('executes instructions in order', () => {
      // Given
      const cs = new CanvasSequence();
      const ctx = {
        'arc': jest.fn(),
        'lineJoin': 'round',
        'strokeStyle': 'red',
        'save': jest.fn(),
        'restore': jest.fn(),
      };
      cs.arc(0, 1, 2, 3, Math.PI);
      cs.lineJoin = 'bevel';
      cs.strokeStyle = 'blue';
      cs.strokeStyle = 'green';

      // When
      cs.execute(ctx);

      // Then
      expect(ctx.arc).toHaveBeenCalledTimes(1);
      expect(ctx.arc).toHaveBeenCalledWith(0, 1, 2, 3, Math.PI);
      expect(ctx.lineJoin).toBe('bevel');
      expect(ctx.strokeStyle).toBe('green');
    });

    test('throws when the context cannot save the canvas state', () => {
      // Given
      const sequence = new CanvasSequence();

      // Then
      expect(() => sequence.execute({})).toThrow(TypeError);
    });
  });

  describe('toJSON()', () => {
    test('produces JSON-serializable data', () => {
      // Given
      const cs = new CanvasSequence();
      cs.fillStyle = 'blue';
      cs.fillRect(5, 6, 7, 8);

      // When
      const data = cs.toJSON();

      // Then
      expect(typeof data).toBe('object');
      const tojson = JSON.stringify(data);
      const fromjson = JSON.parse(tojson);
      expect(typeof fromjson).toBe('object');
      expect(fromjson.sequence).toBeInstanceOf(Array);
    });
  });

  describe('[@@fromJSON](data)', () => {
    const fromJSON = Symbol.for('fromJSON');
    const sequence = Symbol.for('sequence');

    test('reproduces the original sequence', () => {
      // Given
      const cs = new CanvasSequence();
      cs.fillStyle = 'blue';
      cs.fillRect(5, 6, 7, 8);
      const data = cs.toJSON();
      const seq = new CanvasSequence();

      // When
      seq[fromJSON](data);

      // Then
      expect(seq).toEqual(cs);
    });

    test('leaves the sequence empty when no data is provided', () => {
      // Given
      const seq = new CanvasSequence();

      // When
      seq[fromJSON]();

      // Then
      expect(seq[sequence]).toHaveLength(0);
    });

    test('rejects malformed data without a sequence array', () => {
      // Given
      const seq = new CanvasSequence();

      // Then
      expect(() => seq[fromJSON]({})).toThrow(TypeError);
      expect(() => seq[fromJSON]({ 'sequence': null })).toThrow(TypeError);
    });
  });
});
