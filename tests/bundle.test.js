/*
 * Quick test file for the bundle.
 */

const { CanvasSequence, CanvasBlueprint } = require('../dist/index.js');

test('Classes are available', () => {
  expect( CanvasSequence ).toBeInstanceOf(Function);
  expect( CanvasBlueprint ).toBeInstanceOf(Function);
});

