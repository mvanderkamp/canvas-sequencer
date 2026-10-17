/*
 * This test suite keeps the README's supported API table aligned with the
 * CanvasSequence instruction allowlists.
 */

/* global describe, test, expect */

'use strict';

const fs = require('fs');
const path = require('path');

const instructions = require('../src/CanvasInstructions.js');

function documentedInstructions() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  const readme = fs.readFileSync(readmePath, 'utf8');
  const table = readme.match(/### Supported API\n\n([\s\S]*?)\n## Limitations/u);

  if (!table) {
    throw new Error('README is missing the Supported API table.');
  }

  return table[1].split('\n').reduce((documented, row) => {
    const match = row.match(/^\| (Method|Writable property) \| `([A-Za-z]+)(\(\))?` \|$/u);
    if (match) {
      const type = match[1] === 'Method' ? 'METHODS' : 'PROPERTIES';
      documented[type].push(match[2]);
    }
    return documented;
  }, { 'METHODS': [], 'PROPERTIES': [] });
}

describe('README', () => {
  test('documents the supported CanvasSequence instructions', () => {
    expect(documentedInstructions()).toEqual(instructions);
  });
});
