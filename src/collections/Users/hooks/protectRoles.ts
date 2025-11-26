import type {FieldHook} from 'payload'
import type {User} from '@/payload-types'

export const protectRoles: FieldHook<{id: string} & User> = ({req, data}) => {
  const isAdmin = req.user?.roles?.includes('admin')
  const id = req.user?.id
  // console.log("id: " + id)

  if (!isAdmin) {
    return ['user']
  }

  const userRoles = new Set(data?.roles || [])
  userRoles.add('user')
  return [...userRoles.values()]
}
