import React from 'react'
import { Provider, Render } from '../../src'
import * as LoginForm from './LoginForm'

export default function App() {
  return (
    <Provider modules={[LoginForm]}>
      <Render state={LoginForm} />
    </Provider>
  )
}
