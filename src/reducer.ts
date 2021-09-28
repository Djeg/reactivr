import { action, when } from './actions'
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

    if (action.name.toString() === Symbol('@start').toString()) {
      return startModuleReducer(action)(state)
    }

    if (action.name.toString() === Symbol('@stop').toString()) {
      return stopModuleReducer(action)(state)
    }

    if (!container) return state

    if (!container.module) return state

    if (!container.module.name) return state

    let actionId = action.id ?? '@default'
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
 * Start a given reactive module
 */
export const startModuleReducer: GlobalReducer<
  any,
  Action<ReactiveModule<any, any, any>>
> = action => state => {
  let newState = { ...state }

  newState[action.payload.name] = {
    ...(newState[action.payload.name] || {}),
    [action.id ?? '@default']: action.payload.state,
  }

  return newState
}

/**
 * Stop a given reactive module
 */
export const stopModuleReducer: GlobalReducer<
  any,
  Action<ReactiveModule<any, any, any>>
> = action => state => {
  let newState = { ...state }

  newState[action.payload.name] = Object.entries(newState[action.payload.name])
    .filter(([name]) => name !== (action.id ?? '@default'))
    .reduce((acc, [name, v]) => ({ ...acc, [name]: v }), {})

  return newState
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
  let hasStart = false
  let hasStop = false

  for (let mod of modules) {
    let { name, state, View, ...actionCreators } = mod

    for (let item of Object.values(actionCreators || {})) {
      let creator = item as unknown as ActionContainer<P, S>
      creator.module = mod
      collector[creator.actionUniqName] = creator

      if (/\(@start\)/.test(creator.actionUniqName.toString())) {
        hasStart = true
      }

      if (/\(@stop\)/.test(creator.actionUniqName.toString())) {
        hasStop = true
      }
    }

    if (!hasStart) {
      mod.start = action<typeof mod, any>(when('@start'))
      mod.start.module = mod as any

      collector[mod.start.actionUniqName] = mod.start as any
    }

    if (!hasStop) {
      mod.stop = action<typeof mod, any>(when('@stop'))
      mod.stop.module = mod as any

      collector[mod.stop.actionUniqName] = mod.stop as any
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
