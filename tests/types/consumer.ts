import { CanvasBlueprint, CanvasSequence } from '../..';

const sequence = new CanvasSequence();
const blueprint = new CanvasBlueprint();

sequence.execute({} as CanvasRenderingContext2D);
blueprint.build({ value: 1 });
