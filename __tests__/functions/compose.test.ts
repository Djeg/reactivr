import { compose } from '../../src/functions/compose'

it('compose functions', () => {
  const add = (x: number) => (y: number) => x + y
  const sub = (x: number) => (y: number) => y - x

  const r = compose(sub(2), add(4))(10)
  const r2 = compose(add(10), sub(2), add(4))(10)

  expect(r).toBe(12)
  expect(r2).toBe(22)
})
