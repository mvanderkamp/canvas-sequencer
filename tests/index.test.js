/*
 * Test file for the index.
 */

/* global test, expect */

'use strict';

const { CanvasSequence, CanvasBlueprint } = require('../index.js');

test('Classes are available', () => {
  expect(CanvasSequence).toBeInstanceOf(Function);
  expect(CanvasBlueprint).toBeInstanceOf(Function);
});

