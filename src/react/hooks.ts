import { useContext } from 'react'
import { pipe } from '../functions/pipe'
import Store from '../store'
import { ActionContainer, Action } from '../types'
import { StoreContext } from './Provider'

/**
 * Retrieve the store
 */
export const useStore = (): Store => {
  const store = useContext(StoreContext)

  if (undefined === store)
    throw new Error(`
      Unable to retrieve a @reactivr store.

      This is probably due to a common mistakes,
      make sure you have used the Provider in the
      root of your application.
    `)

  return store
}

/**
 * Create an action event handler
 */
export function useActionEvent<P = any, S extends {} = any, E = Element>(
  fn: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<P = any, S extends {} = any, E = Element>(
  fn1: (a: React.SyntheticEvent<E>) => P,
  fn2: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<P = any, S extends {} = any, E = Element>(
  fn1: <B = any>(a: React.SyntheticEvent<E>) => B,
  fn2: <A = any>(a: A) => P,
  fn3: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<P = any, S extends {} = any, E = Element>(
  fn1: <B = any>(a: React.SyntheticEvent<E>) => B,
  fn2: <A = any, B = any>(a: A) => B,
  fn3: <A = any>(a: A) => P,
  fn4: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<P = any, S extends {} = any, E = Element>(
  fn1: <B = any>(a: React.SyntheticEvent<E>) => B,
  fn2: <A = any, B = any>(a: A) => B,
  fn3: <A = any, B = any>(a: A) => B,
  fn4: <A = any>(a: A) => P,
  fn5: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<P = any, S extends {} = any, E = Element>(
  fn1: <B = any>(a: React.SyntheticEvent<E>) => B,
  fn2: <A = any, B = any>(a: A) => B,
  fn3: <A = any, B = any>(a: A) => B,
  fn4: <A = any, B = any>(a: A) => B,
  fn5: <A = any>(a: A) => P,
  fn6: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<P = any, E = Element>(
  ...fns: Function[]
): (e: React.SyntheticEvent<E>) => void {
  const store = useStore()

  return (e: React.SyntheticEvent<E>) => {
    const action: any = pipe.apply(null, fns as any)(e)

    if (
      !action ||
      'object' !== typeof action ||
      'symbol' !== typeof action.name
    )
      throw Error(`
        useActionEvent does not return a valid action.

        It's probably coming from the fact that you forget to
        attach an action creator at the end of the
        useActionEvent function. You can also verify
        that you are not calling the action but you are
        passing the action as a reference like this :

        useActionEvent(MyModule.action)

        and not :

        useActionEvent(MyModule.action())
      `)

    store.dispatch(action as Action<P>)
  }
}
