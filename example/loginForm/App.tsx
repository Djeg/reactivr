import React from 'react'
import { createStore, Provider, Render } from '../../src'
import * as LoginForm from './LoginForm'

const store = createStore({
  modules: [LoginForm],
})

export default function App() {
  return (
    <Provider store={store}>
      <Render state={LoginForm} />
    </Provider>
  )
}
