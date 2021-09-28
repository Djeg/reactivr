import * as Counter from '../example/counter/Counter'
import { initModuleReducer, initRootState } from '../src/reducer'
import { select } from '../src/selector'

it('can easily select state part of modules', () => {
  const state = initModuleReducer(Counter)(initRootState([Counter]))

  const amount = select(Counter.selectAmount)(state)

  expect(amount).toBe(0)
})

it('can easily select a state part of an identified module', () => {
  const state = initModuleReducer(Counter, 'test')(initRootState([Counter]))

  const amount = select(Counter.selectAmount, 'test')(state)

  expect(amount).toBe(0)
})
