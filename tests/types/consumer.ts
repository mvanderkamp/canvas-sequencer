import { CanvasBlueprint, CanvasSequence } from 'canvas-sequencer';

const sequence = new CanvasSequence();
const blueprint = new CanvasBlueprint();

sequence.execute({} as CanvasRenderingContext2D);
blueprint.build({ value: 1 });
