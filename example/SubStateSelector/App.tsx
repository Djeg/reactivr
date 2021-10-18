import React from 'react'
import { createStore, Provider, Render } from '../../src'
import * as Menu from './Menu'
import Header from './Header'

const defaultStore = createStore({
  modules: [Menu],
})

export default function App({ store = defaultStore }) {
  return (
    <Provider store={store}>
      <Header />
      <Render state={Menu} />
    </Provider>
  )
}
