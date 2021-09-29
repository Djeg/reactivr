import { propOr } from '../../src/functions/propOr'

it("can access to a property or it's default value", () => {
  const user = {
    email: 'john@mail.com',
    comments: [{ id: 1, content: 'hello' }],
  }

  const commentContent = propOr('default', ['comments', 0, 'content'])(user)
  const secondComment = propOr('default', ['comments', 1, 'content'])(user)

  expect(commentContent).toBe('hello')
  expect(secondComment).toBe('default')
})
