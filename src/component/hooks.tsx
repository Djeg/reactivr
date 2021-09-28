import { Props, useContext } from 'react'
import { ReactiveModule, ActionContainerCollector, ActionContainer, Action, StateCollector } from '../types';
import { StateContext } from './Provider'

/**
 * Allow to select the state of a given module
 */
export function useModuleState<P = undefined, S extends {} = {}>(module: ReactiveModule<P, undefined, S>, id: string = '@default') {
  const [states] = useContext(StateContext)

  if (!states[module.name])
    return {} as S

  const stateMap = states[module.name]

  if (!stateMap[id])
    return {} as S

  return stateMap[id] as S
}

/**
 * Allows to select a foreign state
 */
export function useForeignState<ReturnType = any, State extends {} = {}>(module: ReactiveModule, selector?: (state: State) => ReturnType): ReturnType {
  const state = useModuleState(module) as State | ReturnType

  if (selector)
    return selector(state as State)

  return state as ReturnType
}

/**
 * Allows to select a foreign state with
 * a given id
 */
export function useForeignStateId<ReturnType = any, State extends {} = {}>(id: string, module: ReactiveModule, selector?: (state: State) => ReturnType): ReturnType {
  const state = useModuleState(module, id) as State | ReturnType

  if (selector)
    return selector(state as State)

  return state as ReturnType
}

/**
 * Allows to dispatch a given action
 */
export function useActionEvent<P = undefined>(action: Action<P>) {
  const [_, dispatch] = useContext(StateContext)

  return () => {
    console.warn(action)
    dispatch(action)
  }
}

/**
 * Allows to retrieve a dispatch
 */
export function useDispatch() {
  const [_, dispatch] = useContext(StateContext)

  return dispatch
}
