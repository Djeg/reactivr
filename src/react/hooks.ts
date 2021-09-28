import { useContext } from 'react'
import Store from '../store'
import { StoreContext } from './Provider'

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
