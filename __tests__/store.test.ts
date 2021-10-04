import * as Counter from '../example/counter/Counter'
import Store from '../src/store'

let store: Store<any>

beforeEach(() => {
  store = new Store({
    modules: [Counter],
    extensions: [],
  })
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

it('can dispatch any action', async () => {
  store.initModule(Counter)
  await store.dispatch(Counter.increment())

  expect(store.getState()).toEqual({
    [Counter.name]: {
      '@default': {
        amount: 1,
        hasReachedFour: false,
      },
    },
  })
})

it('can select a state part', () => {
  store.initModule(Counter)

  const amount = store.select(Counter.selectAmount)

  expect(amount).toBe(0)
})

it('can unregister / register a given module', () => {
  store.unregister(Counter)

  expect(store.getState()).toEqual({})

  store.register(Counter)

  expect(store.getState()).toEqual({
    [Counter.name]: {},
  })
})

it('contains action listeners', async () => {
  let called = [false, false]
  let counter = 0
  let actions: any[] = [null, null]

  let l1 = () => (a: any) => {
    counter += 1
    called[0] = true

    if (/increment/.test(a.name.toString())) actions[0] = a
  }

  let l2 = () => async (a: any) => {
    counter += 1
    called[1] = true

    if (/decrement/.test(a.name.toString())) actions[1] = a
  }

  store.initModule(Counter)

  store.addActionListener(l1)
  store.addActionListener(l2)

  await store.dispatch(Counter.increment())
  await store.dispatch(Counter.decrement())

  expect(called[0]).toBe(true)
  expect(called[1]).toBe(true)

  expect(actions.length).toBe(2)
  expect(actions[0]).toEqual(Counter.increment())
  expect(actions[1]).toEqual(Counter.decrement())

  expect(counter).toBe(4)

  store.removeActionListener(l1)
  store.removeActionListener(l2)

  await store.dispatch(Counter.increment())

  expect(counter).toBe(4)
})

it('can test the existence of actions', () => {
  expect(store.hasActionContainer(Counter.increment.actionUniqName)).toBe(true)
  expect(store.hasActionContainer(Counter.increment())).toBe(true)
  expect(store.getActionContainer(Counter.increment())).toBe(Counter.increment)

  expect(store.hasActionContainer(Symbol('none'))).toBe(false)
})
