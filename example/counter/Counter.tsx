import React from 'react'
import { action, reduce, ViewComponent, when } from '../../src/index'

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

export const View: ViewComponent<{}, typeof state> = ({ amount }) => (
  <div className="counter">
    <p>Counter : <span className="counter-amount">{amount}</span></p>
    <button className="counter-increment">+</button>
    <button className="counter-decrement">-</button>
  </div>
)
