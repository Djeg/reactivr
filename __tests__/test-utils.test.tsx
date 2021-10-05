import { act } from 'react-dom/test-utils'
import * as Counter from '../example/counter/Counter'
import { createTestingStore } from '../src/test-utils'

it('can creates a testing store', async () => {
  const { actions, store } = createTestingStore({
    modules: [Counter],
  })

  expect(actions).toBeDefined()
  expect(store).toBeDefined()

  await store.dispatch(Counter.increment())

  expect(actions.last()).toEqual(Counter.increment())

  expect(actions.has(Counter.increment)).toBe(true)
  expect(actions.getLast(Counter.increment)).toEqual(Counter.increment())
})
