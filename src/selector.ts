import { DEFAULT_ID } from './actions'
import {
  Selector,
  SelectorSubject,
  SelectorContainer,
  StateCollector,
  getSubjectSelectorName,
} from './types'

/**
 * Creates a selector
 */
export const selector =
  <S extends {} = {}>(subject: SelectorSubject<S>) =>
  <R = any>(selector: Selector<S, R>) => {
    const container: any = (a: any) => selector(a)

    container.__kind__ = 'selector'
    container.subject = subject

    return container as SelectorContainer<S, R>
  }

/**
 * Select a state part by giving to this function
 * a selector and a state
 */
export const select =
  <S extends {} = {}, R = any>(
    selector: SelectorContainer<S, R>,
    id: string = DEFAULT_ID,
  ) =>
  (state: StateCollector<S>): R | undefined => {
    const moduleName = getSubjectSelectorName(selector.subject)
    const stateContainer = state[moduleName]

    if (!stateContainer) return undefined

    const statePart = stateContainer[id]

    if (!statePart) return undefined

    return selector(statePart as S) as R
  }
