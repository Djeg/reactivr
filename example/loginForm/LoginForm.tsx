import { assoc, evolve, mergeLeft, not, objOf, pipe } from 'ramda'
import React from 'react'
import { useLifecycleAction } from '../../src/react/hooks'
import {
  action,
  eventTargetValue,
  reduce,
  useActionEvent,
  ViewComponent,
  when,
  produce,
} from '../../src'

/**
 * === INITIALIZATION ===
 */

/**
 * Contains the name of this module
 */
export const name = Symbol('loginForm')

/**
 * Contains the state of this module
 */
export const state = {
  username: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
  error: '',
  sending: false,
  displayed: false,
}

/**
 * Contains the state type
 */
export type State = typeof state

/**
 * === ACTIONS ===
 */

/**
 * Change the username field
 */
export const changeUsername = action(
  when('setUsername'),
  reduce<Partial<State['username']>, State>(value =>
    evolve({
      username: mergeLeft(value as any),
    }),
  ),
)

/**
 * Change the password field
 */
export const changePassword = action(
  when('setPassword'),
  reduce<Partial<State['password']>, State>(value =>
    evolve({
      password: mergeLeft(value as any),
    }),
  ),
)

/**
 * Change the error
 */
export const error = action(
  when('error'),
  reduce<string, State>(assoc('error')),
)

/**
 * Restore the sending state to fasle
 */
export const unsend = action(
  when('unsend'),
  reduce<undefined, State>(() => assoc('sending', false)),
)

/**
 * Send the login form
 */
export const send = action(
  when('send'),
  reduce<undefined, State>(() =>
    pipe(assoc('sending', true), assoc('error', '')),
  ),
  produce(({ dispatch }) => async () => {
    const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

    await wait(2000)

    dispatch(error('bad credentials'))
    dispatch(unsend())
  }),
)

/**
 * Toggle display boolean
 */
export const toggleDisplay = action(
  when('display'),
  reduce<undefined, State>(() =>
    evolve({
      displayed: not,
    }),
  ),
)

/**
 * === VIEW ===
 */

/**
 * Finaly return the view of this module
 */
export const View: ViewComponent<State> = ({
  username,
  password,
  error,
  sending,
}) => {
  useLifecycleAction(toggleDisplay(), toggleDisplay())

  const onUsernameChange = useActionEvent(
    eventTargetValue,
    objOf('value'),
    changeUsername,
  )

  const onPasswordChange = useActionEvent(
    eventTargetValue,
    objOf('value'),
    changePassword,
  )

  return (
    <form id="loginForm">
      <div className="form-control username">
        <label htmlFor="username">Username:</label>
        <input type="text" value={username.value} onChange={onUsernameChange} />
        {username.error && <p className="username-error">{username.error}</p>}
      </div>
      <div className="form-control password">
        <label htmlFor="password">Password:</label>
        <input type="text" value={password.value} onChange={onPasswordChange} />
        {password.error && <p className="password-error">{password.error}</p>}
      </div>
      {error && <p className="form-error">{error}</p>}
      {sending ? (
        <div className="loader"></div>
      ) : (
        <button type="submit" className="submit-btn">
          Envoyer
        </button>
      )}
    </form>
  )
}
