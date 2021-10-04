import React from 'react'
import Store from '../store'

/**
 * Contains the application store
 * inside a context
 */
export const StoreContext = React.createContext<Store>(new Store())

/**
 * This is the shape of the provider
 * props
 */
export type ProviderProps = {
  store: Store<any>
  children?: React.ReactNode
}

/**
 * Create the store provider
 */
export const Provider = ({ store, children }: ProviderProps) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
