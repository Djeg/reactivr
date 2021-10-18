import * as React from 'react'
import { useSelector } from '../../src'
import * as Menu from './Menu'

/**
 * This component represent a header
 */
export default function Header() {
  const { open } = useSelector(Menu)

  return (
    <header>
      <button>{open ? 'close' : 'open'}</button>
    </header>
  )
}
