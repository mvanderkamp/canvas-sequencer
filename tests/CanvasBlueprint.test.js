/*
 * This test suite is built for the CanvasBlueprint class.
 */

/* global jest, describe, test, expect */

'use strict';

const CanvasBlueprint = require('../src/CanvasBlueprint.js');
const CanvasSequence = require('../src/CanvasSequence.js');

describe('CanvasBlueprint', () => {
  describe('constructor()', () => {
    test('creates a CanvasBlueprint', () => {
      // When
      const blueprint = new CanvasBlueprint();

      // Then
      expect(blueprint).toBeInstanceOf(CanvasBlueprint);
    });
  });

  describe('execute()', () => {
    test('throws because blueprints cannot be executed', () => {
      // Given
      const blueprint = new CanvasBlueprint();

      // Then
      expect(() => blueprint.execute()).toThrow();
    });
  });

  describe('sequencing', () => {
    test('records tagged and untagged instructions', () => {
      // Given
      const bp = new CanvasBlueprint();

      // When
      bp.lineWidth = 2;
      bp.moveTo(42, 70);
      bp.fillText('{{x}}', 5, 6);
      bp.fillText('y', 7, 8);
      bp.fillRect('{x}', '{y}', 30, 40);

      // Then
      expect(bp.toJSON().sequence).toHaveLength(5);
    });
  });

  describe('build(values)', () => {
    function createBlueprint() {
      const bp = new CanvasBlueprint();
      bp.lineWidth = 2;
      bp.moveTo(42, 70);
      bp.fillText('{{x}}', 5, 6);
      bp.strokeText('y', 7, 8);
      bp.fillRect('{x}', '{y}', 30, 40);
      bp.font = '2.5em monospace';
      bp.lineWidth = 8;
      return bp;
    }

    function createContext() {
      return {
        'save': jest.fn(),
        'restore': jest.fn(),
        'fillRect': jest.fn(),
        'moveTo': jest.fn(),
        'lineWidth': 1,
        'font': '16px serif',
        'fillText': jest.fn(),
        'strokeText': jest.fn(),
      };
    }

    test('builds a CanvasSequence', () => {
      // Given
      const blueprint = createBlueprint();

      // When
      const sequence = blueprint.build();

      // Then
      expect(sequence).toBeInstanceOf(CanvasSequence);
    });

    test('builds an executable CanvasSequence', () => {
      // Given
      const blueprint = createBlueprint();
      const ctx = createContext();

      // When
      const sequence = blueprint.build({ 'x': 250, 'y': 99 });
      sequence.execute(ctx);

      // Then
      expect(ctx.restore).toHaveBeenCalledTimes(1);
    });

    test('executes instructions in sequence', () => {
      // Given
      const blueprint = createBlueprint();
      const ctx = createContext();

      // When
      blueprint.build({ 'x': 250, 'y': 99 }).execute(ctx);

      // Then
      expect(ctx.lineWidth).toBe(8);
      expect(ctx.moveTo).toHaveBeenCalledTimes(1);
      expect(ctx.fillText).toHaveBeenCalledTimes(1);
      expect(ctx.fillRect).toHaveBeenCalledTimes(1);
      expect(ctx.strokeText).toHaveBeenCalledTimes(1);
      expect(ctx.font).toBe('2.5em monospace');
    });

    test('passes non-string arguments through', () => {
      // Given
      const blueprint = createBlueprint();
      const ctx = createContext();

      // When
      blueprint.build({ 'x': 250, 'y': 99 }).execute(ctx);

      // Then
      expect(ctx.moveTo).toHaveBeenLastCalledWith(42, 70);
    });

    test('passes plain string arguments through', () => {
      // Given
      const blueprint = createBlueprint();
      const ctx = createContext();

      // When
      blueprint.build({ 'x': 250, 'y': 99 }).execute(ctx);

      // Then
      expect(ctx.strokeText).toHaveBeenLastCalledWith('y', 7, 8);
    });

    test('reduces escaped tag markers to a single marker', () => {
      // Given
      const blueprint = createBlueprint();
      const ctx = createContext();

      // When
      blueprint.build({ 'x': 250, 'y': 99 }).execute(ctx);

      // Then
      expect(ctx.fillText).toHaveBeenLastCalledWith('{x}', 5, 6);
    });

    test('replaces tags with values passed to build', () => {
      // Given
      const blueprint = createBlueprint();
      const values = { 'x': 250, 'y': 99 };
      const ctx = createContext();

      // When
      blueprint.build(values).execute(ctx);

      // Then
      expect(ctx.fillRect).toHaveBeenLastCalledWith(values.x, values.y, 30, 40);
    });

    test('can be rebuilt with different values', () => {
      // Given
      const blueprint = createBlueprint();
      const values = { 'x': 101, 'y': 42 };
      const ctx = createContext();

      // When
      blueprint.build(values).execute(ctx);

      // Then
      expect(ctx.fillRect).toHaveBeenLastCalledWith(values.x, values.y, 30, 40);
    });

    test('removes markers from tags with missing values', () => {
      // Given
      const blueprint = createBlueprint();
      const ctx = createContext();

      // When
      blueprint.build().execute(ctx);

      // Then
      expect(ctx.fillRect).toHaveBeenLastCalledWith('x', 'y', 30, 40);
    });
  });

  describe('toJSON()', () => {
    test('produces JSON-serializable data', () => {
      // Given
      const bp = new CanvasBlueprint();
      bp.fillStyle = 'blue';
      bp.fillRect(5, '{y}', 7, 8);

      // When
      const data = bp.toJSON();

      // Then
      expect(typeof data).toBe('object');
      const tojson = JSON.stringify(data);
      const fromjson = JSON.parse(tojson);
      expect(typeof fromjson).toBe('object');
      expect(fromjson.sequence).toBeInstanceOf(Array);
    });
  });

  describe('[symbols.fromJSON](data)', () => {
    test('revives a CanvasBlueprint object', () => {
      // Given
      const bp = new CanvasBlueprint();
      bp.fillStyle = 'blue';
      bp.fillRect(5, '{y}', 7, 8);
      const data = bp.toJSON();

      // When
      const seq = new CanvasBlueprint(data);

      // Then
      expect(seq).toBeInstanceOf(CanvasBlueprint);
    });

    test('reproduces the original sequence', () => {
      // Given
      const bp = new CanvasBlueprint();
      bp.fillStyle = 'blue';
      bp.fillRect(5, '{y}', 7, 8);
      const data = bp.toJSON();

      // When
      const seq = new CanvasBlueprint(data);

      // Then
      expect(seq).toEqual(bp);
    });
  });
});
