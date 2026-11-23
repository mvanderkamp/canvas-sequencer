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

test('legacy package subpaths remain available', () => {
  expect(require('canvas-sequencer/package.json').name).toBe('canvas-sequencer');
  expect(require('canvas-sequencer/index')).toEqual(require('../index.js'));
  expect(require('canvas-sequencer/index.js')).toEqual(require('../index.js'));
  expect(require('canvas-sequencer/dist/index')).toEqual(require('../dist'));
  expect(require('canvas-sequencer/dist/index.js')).toEqual(require('../dist'));

  for (const name of [
    'CanvasAtom',
    'CanvasBlueprint',
    'CanvasInstructions',
    'CanvasSequence',
  ]) {
    expect(require(`canvas-sequencer/src/${name}`)).toBe(
      require(`../src/${name}.js`),
    );
    expect(require(`canvas-sequencer/src/${name}.js`)).toBe(
      require(`../src/${name}.js`),
    );
  }
});

test('ESM entry exports the named API without a default export', () => {
  const { execFileSync } = require('node:child_process');
  const path = require('node:path');

  const script = [
    'import * as api from \'canvas-sequencer\';',
    'if (typeof api.CanvasSequence !== \'function\') process.exit(1);',
    'if (typeof api.CanvasBlueprint !== \'function\') process.exit(1);',
    'if (\'default\' in api) process.exit(1);',
  ].join('\n');

  expect(
    execFileSync(process.execPath, ['--input-type=module', '--eval', script], {
      'cwd': path.join(__dirname, '..'),
      'encoding': 'utf8',
    }),
  ).toBe('');
});
