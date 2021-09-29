import { action, produce, reduce, when } from '../src/actions'

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
    produce(() => () => {
      'effect'
    }),
  )

  expect(creator.effects?.length).toBe(1)
})
