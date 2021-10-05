import React from 'react'
import { createStore, Provider, Render } from '../../src'
import * as Counter from './Counter'

const store = createStore({
  modules: [Counter],
})

export default function App() {
  return (
    <Provider store={store}>
      <Render state={Counter} />
    </Provider>
  )
}
