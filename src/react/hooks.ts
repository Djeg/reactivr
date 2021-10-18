import { useContext, useEffect, useState } from 'react'
import { DEFAULT_ID } from '../actions'
import { pipe } from '../functions/pipe'
import Store from '../store'
import {
  Action,
  ActionContainer,
  getLightSelectorModuleName,
  LightStoreSelector,
} from '../types'
import { StoreContext } from './Provider'
import { RenderModuleIdContext } from './Render'

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
 * Retrieve the dispatch function
 */
export const useDispatch = () => {
  const store = useStore()

  return <P = undefined>(action: Action<P>) => store.dispatch(action)
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
  const id = useModuleId()
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

    store.dispatch(action as Action<P>, id)
  }
}

/**
 * Create foreign action event handler,
 */
export function useForeignActionEvent<P = any, S extends {} = any, E = Element>(
  id: string,
  fn: ActionContainer<P, S>,
): (e: React.SyntheticEvent<E>) => void
export function useForeignActionEvent<P = any, S extends {} = any, E = Element>(
  id: string,
  fn1: (a: React.SyntheticEvent<E>) => P,
  fn2: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useForeignActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
>(
  id: string,
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => P,
  fn3: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useForeignActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
  B = any,
>(
  id: string,
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => B,
  fn3: (a: B) => P,
  fn4: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useForeignActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
  B = any,
  C = any,
>(
  id: string,
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => B,
  fn3: (a: B) => C,
  fn4: (a: C) => P,
  fn5: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useForeignActionEvent<
  P = any,
  S extends {} = any,
  E = Element,
  A = any,
  B = any,
  C = any,
  D = any,
>(
  id: string,
  fn1: (a: React.SyntheticEvent<E>) => A,
  fn2: (a: A) => B,
  fn3: (a: B) => C,
  fn4: (a: C) => D,
  fn5: (a: D) => P,
  fn6: ActionContainer<P, S>,
): (e: React.SyntheticEvent<Element>) => void
export function useForeignActionEvent<P = any, E = Element>(
  id: string,
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

    store.dispatch(action as Action<P>, id)
  }
}

/**
 * Select a state part by giving it a selector
 */
export function useSelector<R = any>(
  selector: LightStoreSelector<any, R>,
  id: string = DEFAULT_ID,
): R | undefined {
  const store = useStore()

  const [state, setState] = useState<R>(
    store.select(selector, id) as unknown as R,
  )

  useEffect(() => {
    let mod = getLightSelectorModuleName(selector)

    let listener = () => () => {
      setState(store.select(selector, id) as unknown as R)
    }

    store.addActionListener(mod, listener)

    return () => {
      store.removeActionListener(mod, listener)
    }
  }, [])

  return state
}

/**
 * Retrieve the current reactive module id
 */
export function useModuleId(): string {
  const id = useContext(RenderModuleIdContext)

  if (!id)
    throw new Error(`
      Unable to retrieve the module id.

      This error probably happens because
      you are using the "useModuleId" hooks
      outside of a reactive module. Make sure
      to have used in the correct reactive module.

      Sometimes you may want to dispatch an
      action of an other module. In that case
      use "useForeignActionEvent" or "useDispatch"
      hooks.
    `)

  return id
}

/**
 * Use an action that will be dispatch during the component
 * initialization
 */
export const useLifecycleAction = <P1 = undefined, P2 = undefined>(
  initAction: Action<P1>,
  destroyAction?: Action<P2>,
) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initAction)

    if (destroyAction)
      return () => {
        dispatch(destroyAction)
      }
  }, [])
}

/**
 * Allows a component to use an action that will be triggered
 * during the component first render.
 */
export const useInitAction = <S extends {} = any>(
  action: ActionContainer<undefined, S>,
) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(action())
  }, [])
}

/**
 * Allows a component to use an action that will be triggered
 * when the component will unmount
 */
export const useFinalAction = <S extends {} = any>(
  container: ActionContainer<undefined, S>,
) => {
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(container())
    }
  }, [])
}
