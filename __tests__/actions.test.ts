import * as Counter from '../example/counter/Counter'
import {
  action,
  isStartAction,
  isStartActionName,
  isStopAction,
  isStopActionName,
  produce,
  reduce,
  START,
  STOP,
  when,
  whenStart,
  whenStop,
} from '../src/actions'
import { ReactiveModule } from '../src/types'

it('creates an empty action creator', () => {
  const creator = action()

  expect(creator()).toEqual({
    name: expect.any(Symbol),
    payload: undefined,
  })

  expect(`${creator}`).toEqual(creator.actionName)
  expect(creator.actionUniqName).toBeDefined()
  expect(creator.reducers).toEqual([])
  expect(creator.effects).toEqual([])
})

it('creates an action creator with a name using when', () => {
  const creator = action<string>(when('test'))
  const data = creator('foo')

  expect(data.name).toBe(creator.actionUniqName)
  expect(data.payload).toBe('foo')
  expect(`${creator}`).toBe('test')
})

it('creates an starting action', () => {
  const creator = action<ReactiveModule<any, any, any>>(whenStart())
  const data = creator(Counter as ReactiveModule<any, any, any>)

  expect(data.name).toBe(creator.actionUniqName)
  expect(isStartAction(data)).toBe(true)
  expect(data.payload).toEqual(Counter)
})

it('creates an stoping action', () => {
  const creator = action<ReactiveModule<any, any, any>>(whenStop())
  const data = creator(Counter as ReactiveModule<any, any, any>)

  expect(data.name).toBe(creator.actionUniqName)
  expect(isStopAction(data)).toBe(true)
  expect(data.payload).toEqual(Counter)
})

it('creates an action creator with an action reducer', () => {
  const state = {
    amount: 0,
  }
  const creator = action<number, typeof state>(
    when('changeAmount'),
    reduce(amount => state => ({
      amount,
    })),
  )

  expect(`${creator}`).toBe('changeAmount')
  expect(creator(10)).toEqual({
    name: creator.actionUniqName,
    payload: 10,
  })

  expect(creator.reducers?.length).toBe(1)

  const re = creator.reducers?.[0]

  expect(re).toBeDefined()

  if (!re) return

  const newState = re(10)(state)

  expect(newState).toEqual({
    amount: 10,
  })
})

it('can attaches effects on an action', () => {
  const creator = action(
    when('something'),
    produce(() => 'effect'),
  )

  expect(creator.effects?.length).toBe(1)

  const ef = creator.effects?.[0]

  if (!ef) return

  expect(ef()).toEqual('effect')
})

it('can detect start and stop actions', () => {
  const a1 = {
    name: Symbol('foo'),
    payload: undefined,
  }
  const a2 = {
    name: START,
    payload: undefined,
  }
  const a3 = {
    name: STOP,
    payload: undefined,
  }

  expect(isStartAction(a1)).toBe(false)
  expect(isStartAction(a2)).toBe(true)
  expect(isStartAction(a3)).toBe(false)

  expect(isStopAction(a1)).toBe(false)
  expect(isStopAction(a2)).toBe(false)
  expect(isStopAction(a3)).toBe(true)

  expect(isStartActionName(START)).toBe(true)
  expect(isStartActionName(STOP)).toBe(false)
  expect(isStopActionName(STOP)).toBe(true)
  expect(isStopActionName(START)).toBe(false)
})
