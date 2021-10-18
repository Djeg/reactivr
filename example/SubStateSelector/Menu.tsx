import * as React from 'react'
import { action, reduce, when, ViewComponent } from '../../src'

/**
 * The name of the state
 */
export const name = Symbol('menu')

/**
 * The initial state
 */
export const state = {
  open: false,
}

export type State = typeof state

/**
 * Toggle the menu
 */
export const toggle = action(
  when('toggle'),
  reduce<undefined, State>(() => state => ({
    ...state,
    open: !state.open,
  })),
)

/**
 * The menu view
 */
export const View: ViewComponent<State> = ({ open }) => {
  return <nav id="menu" className={open ? 'is-open' : ''}></nav>
}
