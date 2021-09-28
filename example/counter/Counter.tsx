import React from 'react'
import { action, reduce, selector, useActionEvent, ViewComponent, when } from '../../src'

export const name = Symbol('counter')

export const state = {
  amount: 0,
}

export const increment = action(
  when('increment'),
  reduce<undefined, typeof state>(() => state => ({
    ...state,
    amount: state.amount + 1,
  })),
)

export const decrement = action(
  when('decrement'),
  reduce<undefined, typeof state>(() => state => ({
    ...state,
    amount: state.amount - 1,
  })),
)

export const View: ViewComponent<{}, typeof state> = ({ amount }) => {
  const onIncrement = useActionEvent(increment)
  const onDecrement = useActionEvent(decrement)

  return (
    <div className="counter">
      <p>Counter : <span className="counter-amount">{amount}</span></p>
      <button className="counter-increment" onClick={onIncrement}>+</button>
      <button className="counter-decrement" onClick={onDecrement}>-</button>
    </div>
  )
}

const select = selector<typeof state>(name)

export const selectAmount = select<number>(({ amount }) => amount)
