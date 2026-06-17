/**
 * Normalizes binary upload input into a `Blob` suitable for `FormData`.
 *
 * Accepts an existing `Blob` (returned as-is, avoiding a wasteful copy) or a
 * `Uint8Array` (which includes Node's `Buffer`). Using `Uint8Array` instead of
 * `Buffer` keeps the public API browser-compatible while remaining a superset
 * of what callers previously passed.
 *
 * @internal
 */
export function toBlob(input: Blob | Uint8Array): Blob {
  // A Uint8Array is always a valid BlobPart at runtime; the cast works around a
  // structural-typing quirk where `Uint8Array<ArrayBufferLike>` is not assignable
  // to the DOM `BlobPart` (which expects an `ArrayBuffer`-backed view).
  return input instanceof Blob ? input : new Blob([input as BlobPart]);
}
