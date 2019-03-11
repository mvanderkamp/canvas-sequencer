/*
 * Test file for the index.
 */

const { CanvasSequence, CanvasBlueprint } = require('../index.js');

test('Classes are available', () => {
  expect( CanvasSequence ).toBeInstanceOf(Function);
  expect( CanvasBlueprint ).toBeInstanceOf(Function);
});

