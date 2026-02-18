import type {Access} from 'payload'
import {checkRole} from '@/collections/Users/access/checkRole'

const updatePost: Access = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  if (checkRole(['admin','sauthor', 'seditor'], user)) {
    return true
  }

  if (checkRole(['author', 'editor'], user)) {
    return {
      _status: {
        not_equals: 'published',
      },
    }
  }

  return false
}

export default updatePost
