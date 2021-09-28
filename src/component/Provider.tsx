import React, { useEffect, useState } from 'react'
import { ActionContainer, Action, GlobalReducer, Dispatch } from '../types';
import {
  ActionContainerCollector,
  StateCollector,
  ReactiveModule,
} from '../types'

/**
 * This context contains the action container collector
 * and allows the developper to add has many actions
 * he want's into his app.
 */
export const ActionCollectorContext = React.createContext<
  ActionContainerCollector<any, any>
>({})

/**
 * This context contains all the state of all components
 */
export const StateContext = React.createContext<[StateCollector, Dispatch]>([{}, () => null])

/**
 * This is the shape of the provider props
 */
export type ProviderProps = {
  modules: ReactiveModule<any, any, any>[],
  children: React.ReactNode,
}

/**
 * Contains the rootReducer and the dispatch function
 */
export type ReducerContainer<P = undefined, S extends {} = {}> = {
  rootReducer: GlobalReducer<S, Action<P>>
  dispatch: Dispatch<P>
}

/**
 * This is the provider wich is used to add has many
 * reactive components a developper wants to.
 */
export const Provider = ({ modules, children }: ProviderProps) => {
  const [actions, setActions] = useState({})
  const [states, setStates] = useState({})
  const [rootReducer, setRootReducer] = useState<GlobalReducer<any, Action<any>>>(function defaultRootReducer() {
    return () => ({})
  })
  const [dispatch, setDispatch] = useState<Dispatch<any>>(() => null)

  useEffect(() => {
    let acts = { ...actions }
    let sts = { ...states }

    for (let module of modules) {
      acts = { ...acts, ...parseModuleActionCollector(module) }
      sts = { ...sts, ...parseModuleStateCollector(module) }
    }

    setActions(acts)
    setStates(sts)

    let root = createRootReducer(acts as ActionContainerCollector<any, any>)

    setRootReducer(root)

    let newDispatch = createDispatch({
      actions: acts as ActionContainerCollector,
      states: states as StateCollector,
      reducer: root,
      setStates: setStates,
    })

    setDispatch(newDispatch)
  }, [])

  //useEffect(() => {
  //  setRootReducer(createRootReducer(actions as ActionContainerCollector<any, any>))
  //}, [states, actions])

  //useEffect(() => {
  //  console.warn(rootReducer, states, actions)
  //  setDispatch(createDispatch({
  //    actions: actions as ActionContainerCollector,
  //    states: states as StateCollector,
  //    reducer: rootReducer,
  //    setStates: setStates,
  //  }))
  //}, [rootReducer])

  return (
    <ActionCollectorContext.Provider value={actions}>
      <StateContext.Provider value={[states, dispatch]}>
        {children}
      </StateContext.Provider>
    </ActionCollectorContext.Provider>
  )
}

/**
 * Parse a ReactiveModule into a ActionContainerCollector
 */
function parseModuleActionCollector(module: ReactiveModule<any, any, any>) {
  const { name, View, state, ...creators } = module
  const actions: ActionContainerCollector<any, any> = {}

  for (let [ name, container ] of Object.entries(creators as ActionContainer<any, any>[])) {
    actions[container.actionUniqName] = container
  }

  return actions
}

/**
 * Parse a ReactiveModule into a StateCollector
 */
function parseModuleStateCollector(module: ReactiveModule<any, any, any>) {
  const { state, name } = module

  return {
    [name]: {
      '@default': state,
    }
  }
}

/**
 * Allows to create a root reducer on top of modules and states collector
 */
function createRootReducer<P = undefined>(actions: ActionContainerCollector) {
  return function actionReducer(action: Action<P>) {
    return function stateReducer(states: StateCollector) {
      if (!actions[action.name]) {
        return states
      }

      const container = actions[action.name] as ActionContainer<P, typeof states>

      let selectedStateMap = states[action.name]

      if (!selectedStateMap) {
        return states
      }

      let actionId = '@default'
      let selectedState = selectedStateMap[actionId]

      if (!selectedState) {
        return states
      }

      let newState = { ...selectedState }

      for (let reducer of container.reducers || []) {
        newState = reducer(action.payload)(newState) || newState
      }

      return {
        ...states,
        [action.name]: {
          ...states[action.name],
          [actionId]: {
            ...states[action.name][actionId],
            ...newState,
          }
        }
      }
    }
  }
}

/**
 * This is the option sent to the dispatch creation
 */
type DispatchOption = {
  actions: ActionContainerCollector,
  states: StateCollector
  reducer: GlobalReducer
  setStates: (states: StateCollector) => void
}

/**
 * Creates a dispatch function on top of action container
 * collector, states collector and root reducer
 */
function createDispatch({
  actions,
  states,
  reducer,
  setStates,
}: DispatchOption) {
  const dispatch: Dispatch<any> = (action) => {
    if (!action) return

    setStates(reducer(action)(states))

    const container = actions[action.name]

    if (!container)
      return

    const effs = container.effects || []

    for (let eff of effs) {
      eff()
    }
  }

  return dispatch
}
