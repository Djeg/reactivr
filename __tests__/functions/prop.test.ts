import { prop } from '../../src/functions/prop'

it('selects props of an object', () => {
  const user = {
    email: 'john@mail.com',
    comments: [{ id: 1, content: 'hello' }],
  }

  const email = prop('email')(user)

  expect(email).toBe('john@mail.com')

  const firstCommentContent = prop(['comments', 0, 'content'])(user)

  expect(firstCommentContent).toBe('hello')

  const none = prop(['foo', 'bar'])(user)

  expect(none).toBe(undefined)
})
