import type {Access} from 'payload'
import {checkRole} from './checkRole'

const seditor: Access = ({req: {user}}) => {
  if (user) {
    if (checkRole(['admin','seditor'], user)) {
      return true
    }
  }

  return false
}

export default seditor
