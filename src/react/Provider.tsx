import React, { useEffect, useState } from 'react'
import Store from '../store';
import { ReactiveModule } from '../types';

/**
 * Contains the application store
 * inside a context
 */
export const StoreContext = React.createContext<Store>(new Store([]))

/**
 * This is the shape of the provider
 * props
 */
export type ProviderProps = {
  modules: ReactiveModule<any, any, any>[],
  children?: React.ReactNode
}

/**
 * Create the store provider
 */
export const Provider = ({ modules, children }: ProviderProps) => {
  const [store, setStore] = useState<Store<any> | undefined>(undefined)

  useEffect(() => {
    setStore(new Store(modules))
  }, [modules])

  if (undefined === store) return null

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}
