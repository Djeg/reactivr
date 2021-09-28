import * as Counter from '../example/counter/Counter'
import Store from '../src/store'

let store: Store<any>

beforeEach(() => {
  store = new Store([Counter])
})

it('can build a set of modules into a state', () => {
  expect(store.getState()).toEqual({
    [Counter.name]: {},
  })
})

it('can start and store a module easily', () => {
  store.initModule(Counter, 'test')

  expect(store.getState()).toEqual({
    [Counter.name]: {
      test: Counter.state,
    },
  })

  store.destroyModule(Counter, 'test')

  expect(store.getState()).toEqual({
    [Counter.name]: {},
  })
})

it('can dispatch any action', () => {
  store.initModule(Counter)
  store.dispatch(Counter.increment())

  expect(store.getState()).toEqual({
    [Counter.name]: {
      '@default': {
        amount: 1,
      },
    },
  })
})

it('can unregister a given module', () => {
  store.unregister(Counter)

  expect(store.getState()).toEqual({})
})
