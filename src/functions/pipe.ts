/**
 * This is a function that pipe many function
 * between them
 */
export function pipe<A = any, R = any>(fn: (a: A) => R): (a: A) => R
export function pipe<A = any, R1 = any, R2 = any>(
  fn1: (a: A) => R1,
  fn2: (a: R1) => R2,
): (a: A) => R2
export function pipe<A = any, R1 = any, R2 = any, R3 = any>(
  fn1: (a: A) => R1,
  fn2: (a: R1) => R2,
  fn3: (a: R2) => R3,
): (a: A) => R3
export function pipe<A = any, R1 = any, R2 = any, R3 = any, R4 = any>(
  fn1: (a: A) => R1,
  fn2: (a: R1) => R2,
  fn3: (a: R2) => R3,
  fn4: (a: R3) => R4,
): (a: A) => R4
export function pipe<A = any, R1 = any, R2 = any, R3 = any, R4 = any, R5 = any>(
  fn1: (a: A) => R1,
  fn2: (a: R1) => R2,
  fn3: (a: R2) => R3,
  fn4: (a: R3) => R4,
  fn5: (a: R4) => R5,
): (a: A) => R5
export function pipe<
  A = any,
  R1 = any,
  R2 = any,
  R3 = any,
  R4 = any,
  R5 = any,
  R6 = any,
>(
  fn1: (a: A) => R1,
  fn2: (a: R1) => R2,
  fn3: (a: R2) => R3,
  fn4: (a: R3) => R4,
  fn5: (a: R4) => R5,
  fn6: (a: R5) => R6,
): (a: A) => R6
export function pipe<A = any, R = any>(...fns: Function[]) {
  return (arg: A) => fns.reduce((acc, fn) => fn(acc), arg) as unknown as R
}
