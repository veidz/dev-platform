// Central types and validation schemas will live here
// Placeholder to validate build pipeline

export type Brand<K, T> = K & { __brand: T }
