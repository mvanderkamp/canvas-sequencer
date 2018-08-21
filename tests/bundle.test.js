/*
 * Quick test file for the bundle.
 */

const { CanvasSequencer, CanvasBlueprint } = require('../bundle.js');

test('Classes are available', () => {
  expect( CanvasSequencer ).toBeInstanceOf(Function);
  expect( CanvasBlueprint ).toBeInstanceOf(Function);
});

