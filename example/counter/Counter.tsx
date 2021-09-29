import {
  add,
  compose,
  evolve,
  gte,
  ifElse,
  prop,
  subtract,
  __,
  assoc,
} from 'ramda'
import React from 'react'
import {
  action,
  Effect,
  reduce,
  selector,
  useActionEvent,
  ViewComponent,
  when,
} from '../../src'
import { produce } from '../../src/actions'

/**
 * === INITIALIZATION ===
 */

/**
 * Contains the name of the counter module
 */
export const name = Symbol('counter')

/**
 * Contains the state of this module
 */
export const state = {
  amount: 0,
  hasReachedFour: false,
}

/**
 * Contains the state type
 */
export type State = typeof state

/**
 * === EFFECTS ===
 */

/**
 * Trigger the reached four checking
 */
export const checkReachedFourEff: Effect =
  ({ dispatch }) =>
  ({ id }) => {
    dispatch(reachedFour(), id)
  }

/**
 * === ACTIONS ===
 */

/**
 * Increment the counter by one
 */
export const increment = action(
  when('increment'),
  reduce<undefined, State>(() =>
    evolve({
      amount: add(1),
    }),
  ),
  produce(checkReachedFourEff),
)

/**
 * Decrement the counter by one
 */
export const decrement = action(
  when('decrement'),
  reduce<undefined, State>(() =>
    evolve({
      amount: subtract(__, 1),
    }),
  ),
  produce(checkReachedFourEff),
)

/**
 * Test if the amoutn has reached four
 */
export const reachedFour = action(
  when('reachedFoud'),
  reduce<undefined, State>(() =>
    ifElse(
      compose(gte(4), prop('amount')),
      assoc('hasReachedFour', true),
      assoc('hasReachedFour', false),
    ),
  ),
)

/**
 * === SELECTORS ===
 */

/**
 * Create a root selector
 */
const select = selector<typeof state>(name)

/**
 * Select the counter amount
 */
export const selectAmount = select<number>(prop('amount'))

/**
 * === VIEW ===
 */

/**
 * Display a counter on the screen
 */
export const View: ViewComponent<State> = ({ amount, hasReachedFour }) => {
  const onIncrement = useActionEvent(increment)
  const onDecrement = useActionEvent(decrement)

  return (
    <div className="counter">
      <p>
        Counter : <span className="counter-amount">{amount}</span>
      </p>
      <button className="counter-increment" onClick={onIncrement}>
        +
      </button>
      <button className="counter-decrement" onClick={onDecrement}>
        -
      </button>
      {hasReachedFour && <p className="reached-four">It has reached four !</p>}
    </div>
  )
}
