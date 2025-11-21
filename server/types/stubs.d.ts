// Temporary stubs to satisfy type checker in environment
// NOTE: Remove once proper Node type resolution is working.

declare namespace NodeJS {
  interface Process {}
}

declare class EventEmitter {}

type BufferEncoding = string;
// Using 'any' to silence type errors; replace with real Buffer type if TS adopted.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Buffer extends Uint8Array {}
