import type { GameMode } from '../types';
import { constellationMode } from './constellation';
import { gestureMode } from './gesture';
import { compositionMode } from './composition';
import { poseMode } from './pose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modes: GameMode<any, any>[] = [
  constellationMode,
  gestureMode,
  compositionMode,
  poseMode,
];