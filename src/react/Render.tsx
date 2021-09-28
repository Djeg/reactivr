import React, { useEffect, useState } from 'react';
import { ReactiveModule } from '../types';
import { useStore } from './hooks';

/**
 * Define the shape of a Render Props
 */
export type RenderProps<P extends {} = {}> = P & {
  state: ReactiveModule<P, any, any>,
  id?: string
  children?: React.ReactNode,
}

/**
 * Allow to render a reactive module
 */
export const Render = ({
  state,
  id,
  children,
  ...restProps
}: RenderProps) => {
  const [initialized, setInitialized] = useState<boolean>(false)
  const [moduleState, setModuleState] = useState<typeof state.state>(state.state)
  const store = useStore()

  useEffect(() => {
    store.initModule(state)

    const retrievedState = store.selectModule<typeof state.state>(state, id)

    if (undefined === retrievedState)
      throw new Error(`
        Unable to retrieve the state of ${state.name.toString()}.

        This is probably due to a missing reference into
        your Provider. Make sure you add the module ${state.name.toString()}
        inside the props "modules" of your Provider.
      `)

    setModuleState(retrievedState)
    setInitialized(true)

    return () => {
      setInitialized(false)
      store.destroyModule(state)
    }
  }, [state])

  if (!initialized) return null

  return (
    <state.View {...restProps} {...moduleState}>
      {children}
    </state.View>
  )
}
