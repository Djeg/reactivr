import { DEFAULT_ID } from './actions'
import {
  Action,
  ActionContainer,
  ActionContainerCollector,
  GlobalReducer,
  ReactiveModule,
  StateCollector,
} from './types'

/**
 * Reduce a given action
 */
export function createRootReducer<
  S extends StateCollector = StateCollector<any>,
  A extends Action<any> = Action<any>,
>(actions: ActionContainerCollector<any, S>) {
  const reducer: GlobalReducer<S, A> = action => state => {
    let container = actions[action.name]

    if (!container) return state

    if (!container.module) return state

    if (!container.module.name) return state

    let actionId = action.id ?? DEFAULT_ID
    let stateContainer = state[container.module.name] ?? {}
    let statePart = stateContainer[actionId]

    if (!statePart) return state

    let newStatePart = container.reducers?.reduce((acc, reducer) => {
      let a = { ...acc }
      let s = reducer(action.payload)(a)

      return s || a
    }, statePart)

    return {
      ...state,
      [container.module.name]: {
        ...state[container.module.name],
        [actionId]: {
          ...state[container.module.name][actionId],
          ...newStatePart,
        },
      },
    }
  }

  return reducer
}

/**
 * Initialize a given reactive module
 */
export const initModuleReducer =
  <S extends {} = {}>(mod: ReactiveModule<any, any, any>, id?: string) =>
  (state: S) => {
    let newState: any = { ...state }

    newState[mod.name] = {
      ...(newState[mod.name] || {}),
      [id ?? DEFAULT_ID]: mod.state,
    }

    return newState as S
  }

/**
 * Destroy a given reactive module
 */
export const destroyModuleReducer =
  <S extends {} = {}>(mod: ReactiveModule<any, any, any>, id?: string) =>
  (state: S) => {
    let newState: any = { ...state }

    newState[mod.name] = Object.entries(newState[mod.name])
      .filter(([name]) => name !== (id ?? DEFAULT_ID))
      .reduce((acc, [name, v]) => ({ ...acc, [name]: v }), {})

    return newState as S
  }

/**
 * Initialize a root state on top of ReactiveModules
 */
export function initRootState<S extends {} = {}>(
  modules: ReactiveModule<any, any, S>[],
): StateCollector<S> {
  let rootState: StateCollector<S> = {}

  for (let mod of modules) {
    let { name } = mod

    rootState[name] = {}
  }

  return rootState
}

/**
 * Creates an action container collector on
 * top of reactive modules. It doesn't collect
 * starting and stoping actions
 */
export function createActionContainerCollector<
  Props extends {} = {},
  P = any,
  S extends {} = {},
>(modules: ReactiveModule<Props, P, S>[]): ActionContainerCollector<P, S> {
  let collector: ActionContainerCollector<P, S> = {}

  for (let mod of modules) {
    let { name, state, View, ...actionCreators } = mod

    for (let item of Object.values(actionCreators || {})) {
      if (!isActionContainer(item)) continue

      let creator = item as unknown as ActionContainer<P, S>
      creator.module = mod
      collector[creator.actionUniqName] = creator
    }
  }

  return collector
}

/**
 * Merge deeply two states between them
 */
export function mergeStates(
  origin: StateCollector<any>,
  destination: StateCollector<any>,
) {
  let newState: any = { ...origin }

  for (let moduleName of Object.getOwnPropertySymbols(destination)) {
    if (!newState[moduleName]) {
      newState[moduleName] = destination[moduleName]

      continue
    }

    for (let actionName in destination[moduleName]) {
      if (newState[moduleName][actionName]) {
        continue
      }

      newState[moduleName][actionName] = destination[moduleName][actionName]
    }
  }

  return newState
}

/**
 * Remove a module from a state collector
 */
export function removeModule(
  mod: ReactiveModule<any, any, any>,
  state: StateCollector<any>,
): StateCollector<any> {
  return Object.getOwnPropertySymbols(state)
    .filter(k => k !== mod.name)
    .map(k => [k, state[k]])
    .reduce((acc, [k, v]) => ({ ...acc, [k as symbol]: v }), {})
}

/**
 * Test if a member is an action container
 */
export function isActionContainer(
  container: ActionContainer<any, any> | any,
): container is ActionContainer<any, any> {
  return (
    'function' === typeof container && undefined !== container.actionUniqName
  )
}
