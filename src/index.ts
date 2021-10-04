import { action, produce, reduce, when } from './actions'
import { simpleEffectRunner } from './effect'
import { compose } from './functions/compose'
import { pipe } from './functions/pipe'
import {
  eventPreventDefault,
  eventStopPropagation,
  eventTargetValue,
} from './react/helpers'
import { useActionEvent, useModule, useSelector, useStore } from './react/hooks'
import { Provider, StoreContext } from './react/Provider'
import { Render } from './react/Render'
import { selector } from './selector'
import { createStore } from './store'
import { SimpleEffect, ViewComponent } from './types'

export {
  action,
  SimpleEffect,
  simpleEffectRunner,
  when,
  reduce,
  produce,
  ViewComponent,
  selector,
  Provider,
  StoreContext,
  createStore,
  Render,
  useActionEvent,
  useStore,
  pipe,
  compose,
  useSelector,
  useModule,
  eventStopPropagation,
  eventPreventDefault,
  eventTargetValue,
}
