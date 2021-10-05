import Store, { createStore, StoreOptions } from '../store'
import { ActionCollector } from './action-collector'
import { ReactiveModule, Action, SelectorContainer } from '../types'

/**
 * Create a testing store wich doesn't contains any extensions
 * by default but only a action collector
 */
export const createTestingStore = (
  options: Partial<StoreOptions<any, any>> = {},
): { store: Store<any>; actions: ActionCollector } => {
  let actions = new ActionCollector()

  let store = createStore({
    ...options,
    extensions: [...(options.extensions ?? []), actions.getExtension()],
  })

  return {
    store,
    actions,
  }
}
