import type {Access} from 'payload'
import {checkRole} from './checkRole'

const sauthor: Access = ({req: {user}}) => {
  if (user) {
    if (checkRole(['admin','sauthor'], user)) {
      return true
    }
  }

  return false
}

export default sauthor
