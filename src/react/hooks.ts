import { useContext } from 'react'
import { pipe } from '../functions/pipe'
import Store from '../store'
import {
  ActionContainer,
  Action,
  SelectorContainer,
  ReactiveModule,
} from '../types'
import { StoreContext } from './Provider'
import { DEFAULT_ID } from '../actions'

// @TODO Add a hook that retrieve the current module ID (perhaps by using
// a ModuleIdContext ?)
// @TODO Add a hook that exexute an action during the component initialization
// @TODO Add a hook that execute an action during the component destruction

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
): (e: React.SyntheticEvent<E>) => void
export function useActionEvent<P = any, S extends {} = any, E = Element>(
  fn1: (a: React.SyntheticEvent<E>) => P,
  fn2: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
>(
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => P,
  fn3: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
  B = any,
>(
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => B,
  fn3: (a: B) => P,
  fn4: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
  B = any,
  C = any,
>(
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => B,
  fn3: (a: B) => C,
  fn4: (a: C) => P,
  fn5: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
  B = any,
  C = any,
  D = any,
>(
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => B,
  fn3: (a: B) => C,
  fn4: (a: C) => D,
  fn5: (a: D) => P,
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

/**
 * Select a state part by giving it a selector
 */
export function useSelector<R = any>(
  selector: SelectorContainer<any, R>,
  id: string = DEFAULT_ID,
): R | undefined {
  const store = useStore()

  const result = store.select<R>(selector, id)

  return result
}

/**
 * Select an entire module state
 */
export function useModule<S extends {} = any>(
  mod: ReactiveModule<any, any, S>,
  id: string = DEFAULT_ID,
): S | undefined {
  const store = useStore()

  const data = store.selectModule<S>(mod, id)

  return data
}
