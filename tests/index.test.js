/*
 * Test file for the index.
 */

const { CanvasSequencer, CanvasBlueprint } = require('../index.js');

test('Classes are available', () => {
  expect( CanvasSequencer ).toBeInstanceOf(Function);
  expect( CanvasBlueprint ).toBeInstanceOf(Function);
});

