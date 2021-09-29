/**
 * Add the ability to compose functions
 * between them. It's the same thing has
 * pipe but starting from the right
 */
export function compose<A = any, R = any>(fn: (a: A) => R): (a: A) => R
export function compose<A = any, R1 = any, R2 = any>(
  fn1: (a: R1) => R2,
  fn2: (a: A) => R1,
): (a: A) => R2
export function compose<A = any, R1 = any, R2 = any, R3 = any>(
  fn1: (a: R2) => R3,
  fn2: (a: R1) => R2,
  fn3: (a: A) => R1,
): (a: A) => R3
export function compose<A = any, R1 = any, R2 = any, R3 = any, R4 = any>(
  fn1: (a: R3) => R4,
  fn2: (a: R2) => R3,
  fn3: (a: R1) => R2,
  fn4: (a: A) => R1,
): (a: A) => R4
export function compose<
  A = any,
  R1 = any,
  R2 = any,
  R3 = any,
  R4 = any,
  R5 = any,
>(
  fn1: (a: R4) => R5,
  fn2: (a: R3) => R4,
  fn3: (a: R2) => R3,
  fn4: (a: R1) => R2,
  fn5: (a: A) => R1,
): (a: A) => R5
export function compose<
  A = any,
  R1 = any,
  R2 = any,
  R3 = any,
  R4 = any,
  R5 = any,
  R6 = any,
>(
  fn1: (a: R5) => R6,
  fn2: (a: R4) => R5,
  fn3: (a: R3) => R4,
  fn4: (a: R2) => R3,
  fn5: (a: R1) => R2,
  fn6: (a: A) => R1,
): (a: A) => R6
export function compose<A = any, R = any>(...fns: Function[]): (a: A) => R {
  return (a: A) => fns.reverse().reduce((acc, fn) => fn(acc), a) as unknown as R
}
