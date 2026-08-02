export type CanvasAtomType = 'method' | 'property';

export interface SerializedCanvasAtom {
  type: CanvasAtomType;
  inst: string;
  args: unknown[];
}

export interface SerializedCanvasSequence {
  sequence: SerializedCanvasAtom[];
}

type ContextMethod<T> = T extends (...args: infer Args) => any ? (...args: Args) => void : never;

export interface CanvasSequenceMethods {
  addHitRegion(...args: any[]): void;
  arc: ContextMethod<CanvasRenderingContext2D['arc']>;
  arcTo: ContextMethod<CanvasRenderingContext2D['arcTo']>;
  beginPath: ContextMethod<CanvasRenderingContext2D['beginPath']>;
  bezierCurveTo: ContextMethod<CanvasRenderingContext2D['bezierCurveTo']>;
  clearHitRegions(...args: any[]): void;
  clearRect: ContextMethod<CanvasRenderingContext2D['clearRect']>;
  clip: ContextMethod<CanvasRenderingContext2D['clip']>;
  closePath: ContextMethod<CanvasRenderingContext2D['closePath']>;
  drawFocusIfNeeded(...args: any[]): void;
  drawImage: ContextMethod<CanvasRenderingContext2D['drawImage']>;
  ellipse: ContextMethod<CanvasRenderingContext2D['ellipse']>;
  fill: ContextMethod<CanvasRenderingContext2D['fill']>;
  fillRect: ContextMethod<CanvasRenderingContext2D['fillRect']>;
  fillText: ContextMethod<CanvasRenderingContext2D['fillText']>;
  lineTo: ContextMethod<CanvasRenderingContext2D['lineTo']>;
  moveTo: ContextMethod<CanvasRenderingContext2D['moveTo']>;
  putImageData: ContextMethod<CanvasRenderingContext2D['putImageData']>;
  quadraticCurveTo: ContextMethod<CanvasRenderingContext2D['quadraticCurveTo']>;
  rect: ContextMethod<CanvasRenderingContext2D['rect']>;
  reset(...args: any[]): void;
  removeHitRegion(...args: any[]): void;
  resetTransform: ContextMethod<CanvasRenderingContext2D['resetTransform']>;
  restore: ContextMethod<CanvasRenderingContext2D['restore']>;
  rotate: ContextMethod<CanvasRenderingContext2D['rotate']>;
  roundRect(...args: any[]): void;
  save: ContextMethod<CanvasRenderingContext2D['save']>;
  scale: ContextMethod<CanvasRenderingContext2D['scale']>;
  scrollPathIntoView(...args: any[]): void;
  setLineDash: ContextMethod<CanvasRenderingContext2D['setLineDash']>;
  setTransform: ContextMethod<CanvasRenderingContext2D['setTransform']>;
  stroke: ContextMethod<CanvasRenderingContext2D['stroke']>;
  strokeRect: ContextMethod<CanvasRenderingContext2D['strokeRect']>;
  strokeText: ContextMethod<CanvasRenderingContext2D['strokeText']>;
  transform: ContextMethod<CanvasRenderingContext2D['transform']>;
  translate: ContextMethod<CanvasRenderingContext2D['translate']>;
}

export interface CanvasSequenceProperties {
  direction: CanvasDirection;
  fillStyle: string | CanvasGradient | CanvasPattern;
  filter: string;
  font: string;
  fontKerning: string;
  fontStretch: string;
  fontVariantCaps: string;
  globalAlpha: number;
  globalCompositeOperation: GlobalCompositeOperation;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
  letterSpacing: string;
  lineCap: CanvasLineCap;
  lineDashOffset: number;
  lineJoin: CanvasLineJoin;
  lineWidth: number;
  miterLimit: number;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  textRendering: string;
  wordSpacing: string;
}

export class CanvasSequence {
  constructor(data?: SerializedCanvasSequence | null);
  execute(context: CanvasRenderingContext2D): void;
  toJSON(): SerializedCanvasSequence;
}

export interface CanvasSequence extends CanvasSequenceMethods, CanvasSequenceProperties {}

export class CanvasBlueprint extends CanvasSequence {
  build(values?: Record<string, unknown>): CanvasSequence;
  execute(): never;
}
