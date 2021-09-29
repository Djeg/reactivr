import React from 'react'
import { action, reduce, selector, useActionEvent, ViewComponent, when } from '../../src'
import { produce } from '../../src/actions';

export const name = Symbol('counter')

export const state = {
  amount: 0,
  hasReachedFour: false,
}

export const increment = action(
  when('increment'),
  reduce<undefined, typeof state>(() => state => ({
    ...state,
    amount: state.amount + 1,
  })),
  produce<undefined, typeof state>(({ dispatch }) => async ({ id }) => {
    dispatch(reachedFour(), id)
  }),
)

export const decrement = action(
  when('decrement'),
  reduce<undefined, typeof state>(() => state => ({
    ...state,
    amount: state.amount - 1,
  })),
)

export const reachedFour = action(
  when('reachedFoud'),
  reduce<undefined, typeof state>(() => state => ({
    ...state,
    hasReachedFour: state.amount >= 4,
  }))
)

export const View: ViewComponent<{}, typeof state> = ({ amount, hasReachedFour }) => {
  const onIncrement = useActionEvent(increment)
  const onDecrement = useActionEvent(decrement)

  return (
    <div className="counter">
      <p>Counter : <span className="counter-amount">{amount}</span></p>
      <button className="counter-increment" onClick={onIncrement}>+</button>
      <button className="counter-decrement" onClick={onDecrement}>-</button>
      {hasReachedFour && <p className="reached-four">It has reached four !</p>}
    </div>
  )
}

const select = selector<typeof state>(name)

export const selectAmount = select<number>(({ amount }) => amount)
