/**
 * Do a prevent default an a react SyntheticEvent
 */
export function eventPreventDefault<E = Element>(
  e: React.SyntheticEvent<E>,
): React.SyntheticEvent<E> {
  e.preventDefault()

  return e
}

/**
 * Do a stop propagation on a react SyntheticEvent
 */
export function eventStopPropagation<E = Element>(
  e: React.SyntheticEvent<E>,
): React.SyntheticEvent<E> {
  e.stopPropagation()

  return e
}

/**
 * Add the ability of an element to own a value
 */
export type ValueElement = Element & {
  value: string
}

/**
 * Retrieve the event target value
 */
export function eventTargetValue<E extends ValueElement = ValueElement>(
  e: React.SyntheticEvent<E>,
): string {
  return e.currentTarget.value || ''
}
