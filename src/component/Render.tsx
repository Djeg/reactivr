import React from 'react'
import { ReactiveModule, ViewComponent } from '../types';
import { useModuleState } from './hooks';

/**
 * Define the props that a Render component
 * accepts
 */
type RenderProps<Props extends {} = {}, State extends {} = {}> = Props & {
  state: ReactiveModule<Props, any, State>
  id?: string
  children?: React.ReactNode
}

/**
 * Allow a reactive component to be render
 * on the screen
 */
export const Render = <Props extends {} = {}, State extends {} = {}>({ state, children, id, ...restProps }: RenderProps<Props, State>) => {
  const View  = state.View as ViewComponent<Props, State>
  const stateProps = useModuleState<Props, State>(state, id || '@default')

  let props = (restProps as unknown) as Props

  if (children) {
    return (
      <View {...props} {...stateProps}>{children}</View>
    )
  }

  return (
    <View {...props} {...stateProps} />
  )
}
