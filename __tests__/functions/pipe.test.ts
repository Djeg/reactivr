import { pipe } from '../../src/functions/pipe'

it('can pipes many function between them', () => {
  const add = (x: number) => (y: number) => x + y
  const sub = (x: number) => (y: number) => y - x

  const r = pipe(add(4), sub(2))(10)
  const r2 = pipe(add(4), sub(2), add(10))(10)

  expect(r).toBe(12)
  expect(r2).toBe(22)
})
