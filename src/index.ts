import { action, when, reduce, produce } from './actions'
import { Provider } from './component/Provider'
import { Render } from './component/Render'
import { ViewComponent } from './types'
import {
  useActionEvent,
  useDispatch,
  useForeignState,
  useForeignStateId,
  useModuleState,
} from './component/hooks'

export {
  action,
  when,
  reduce,
  produce,
  Provider,
  Render,
  useActionEvent,
  useDispatch,
  useForeignState,
  useForeignStateId,
  useModuleState,
  ViewComponent,
}
