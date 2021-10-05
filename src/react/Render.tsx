import React, { useEffect, useState } from 'react'
import { ReactiveModule } from '../types'
import { useStore } from './hooks'
import { DEFAULT_ID } from '../actions'

/**
 * Define the shape of a Render Props
 */
export type RenderProps<P extends {} = {}> = P & {
  state: ReactiveModule<P, any, any>
  stateId?: string
  children?: React.ReactNode
}

/**
 * This context is used in order to retrieve
 * the module id of a reactive module
 */
export const RenderModuleIdContext = React.createContext<string>('')

/**
 * Allow to render a reactive module
 */
export const Render = ({
  state,
  stateId,
  children,
  ...restProps
}: RenderProps) => {
  const [initialized, setInitialized] = useState<boolean>(false)
  const [moduleState, setModuleState] = useState<typeof state.state>(
    state.state,
  )
  const store = useStore()
  const moduleId = stateId ?? DEFAULT_ID

  useEffect(() => {
    store.initModule(state, moduleId)

    const retrievedState = store.selectModule<typeof state.state>(
      state,
      moduleId,
    )

    if (undefined === retrievedState)
      throw new Error(`
        Unable to retrieve the state of ${state.name.toString()} (${moduleId}).

        This is probably due to a missing reference into
        your Provider. Make sure you add the module ${state.name.toString()}
        inside the props "modules" of your Provider. You can
        also verify that the specified module id (${moduleId})
        is correct.
      `)

    setModuleState(retrievedState)
    setInitialized(true)

    const actionListener = () => () => {
      const newState = store.selectModule<typeof state.state>(state, moduleId)

      setModuleState(newState)
    }

    store.addActionListener(state, actionListener)

    return () => {
      setInitialized(false)
      store.removeActionListener(state, actionListener)
      store.destroyModule(state, moduleId)
    }
  }, [state])

  if (!initialized) return null

  return (
    <RenderModuleIdContext.Provider value={moduleId}>
      <state.View {...restProps} {...moduleState}>
        {children}
      </state.View>
    </RenderModuleIdContext.Provider>
  )
}
