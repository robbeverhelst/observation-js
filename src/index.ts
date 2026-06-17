export * from './core/client';
export * from './core/errors';
export * from './lib';

// Re-export every public type from the barrel so the surface can't silently
// drift from a hand-maintained list (which had already gone stale).
export type * from './types';
// `Lookups` exists both as a resource class (./lib) and a response interface
// (./types). The explicit re-export resolves the star-export ambiguity, keeping
// the interface on the type side and the class on the value side (as before).
export type { Lookups } from './types';
