import * as Counter from '../example/counter/Counter'
import { mergeStates, removeModule } from '../src/reducer'
import { StateCollector } from '../src/types'
import {
  stopModuleReducer,
  createActionContainerCollector,
  initRootState,
  startModuleReducer,
  createRootReducer,
} from '../src/reducer'

it('creates a root reducer', () => {
  const state = initRootState([Counter])
  const rootReducer = createRootReducer(
    createActionContainerCollector([Counter]),
  )

  const startAction = {
    name: Symbol('@start'),
    payload: Counter,
  }
  const stopAction = {
    name: Symbol('@stop'),
    payload: Counter,
  }
  const firstState = rootReducer(startAction)(state)
  const secondState = rootReducer(Counter.increment())(firstState)
  const thirdState = rootReducer(Counter.decrement())(secondState)
  const lastState = rootReducer(stopAction)(thirdState)

  expect(firstState).toEqual({
    [Counter.name]: {
      '@default': { amount: 0 },
    },
  })
  expect(secondState).toEqual({
    [Counter.name]: {
      '@default': { amount: 1 },
    },
  })
  expect(thirdState).toEqual({
    [Counter.name]: {
      '@default': { amount: 0 },
    },
  })
  expect(lastState).toEqual({
    [Counter.name]: {},
  })
})

it('creates the start and stop reducer', () => {
  let state = initRootState([Counter])

  let startAction = {
    name: Symbol('@start'),
    payload: Counter,
    id: '@test',
  }

  let stopAction = {
    name: Symbol('@stop'),
    payload: Counter,
    id: '@test',
  }

  let secondState = startModuleReducer(startAction)(state)

  expect(secondState[Counter.name]['@test']).toEqual(Counter.state)

  let thirdState = stopModuleReducer(stopAction)(secondState)

  expect(thirdState).not.toEqual(secondState)
  expect(thirdState[Counter.name]).toEqual({})
})

it('creates a root state on top of reactive modules', () => {
  let state = initRootState([Counter])

  expect(state[Counter.name]).toBeDefined()
  expect(state[Counter.name]).toEqual({})
})

it('creates an action container collector on top of a module', () => {
  let collector = createActionContainerCollector([Counter])

  expect(collector[Counter.decrement.actionUniqName]).toBeDefined()
  expect(collector[Counter.decrement.actionUniqName]).toBe(Counter.decrement)
  expect(collector[Counter.increment.actionUniqName]).toBeDefined()
  expect(collector[Counter.increment.actionUniqName]).toBe(Counter.increment)

  let [start, stop] = Object.getOwnPropertySymbols(collector)
    .filter(k => /(\(@start\)|\(@stop\))/.test(k.toString()))
    .map(k => collector[k])

  expect(start).toBeDefined()
  expect(stop).toBeDefined()

  expect(start.module).toEqual(Counter)
  expect(stop.module).toEqual(Counter)
})

it('can merge deeply two objects between them', () => {
  const s = Symbol('foo')
  const a = {
    [s]: {
      bar: {
        baz: 'foo',
      },
    },
  }

  const b = {
    [s]: {
      bar: {
        test: 'test',
      },
      foo: {
        test: 'test',
      },
    },
  }

  const c = mergeStates(a, b)

  expect(c).toEqual({
    [s]: {
      bar: {
        baz: 'foo',
      },
      foo: {
        test: 'test',
      },
    },
  })
})

it('can remove a module from a state collector', () => {
  const state = initRootState([Counter])
  const rootReducer = createRootReducer(
    createActionContainerCollector([Counter]),
  )

  const startAction = {
    name: Symbol('@start'),
    payload: Counter,
  }
  const firstState = rootReducer(startAction)(state)
  const finalState: StateCollector = removeModule(Counter, firstState)

  expect(finalState[Counter.name]).not.toBeDefined()
})
