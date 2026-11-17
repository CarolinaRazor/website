import type {CollectionAfterChangeHook} from 'payload'
import type {WorkflowItem} from '@/payload-types'

const getRelationshipID = (value: number | { id: number } | null | undefined): number | undefined =>
  typeof value === 'object' && value !== null ? value.id : value ?? undefined

const getAssignmentState = (assignedTo: WorkflowItem['assignedTo']): string[] =>
  (assignedTo || [])
    .map(({ user, role }) => `${getRelationshipID(user)}:${role}`)
    .sort()

const getAuthorIDs = (assignedTo: WorkflowItem['assignedTo']): number[] =>
  (assignedTo || [])
    .filter(({ role }) => role === 'author')
    .map(({ user }) => getRelationshipID(user))
    .filter((id): id is number => id !== undefined)

export const syncAssignedAuthorsToPost: CollectionAfterChangeHook<WorkflowItem> = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const linkedPostID = getRelationshipID(doc.linkedPost)
  if (linkedPostID === undefined) return doc

  const assignmentsChanged =
    operation === 'create' ||
    !previousDoc ||
    JSON.stringify(getAssignmentState(doc.assignedTo)) !==
      JSON.stringify(getAssignmentState(previousDoc.assignedTo))
  const linkedPostChanged =
    operation === 'create' ||
    !previousDoc ||
    linkedPostID !== getRelationshipID(previousDoc.linkedPost)

  if (!assignmentsChanged && !linkedPostChanged) return doc

  const assignedAuthorIDs = getAuthorIDs(doc.assignedTo)
  if (assignedAuthorIDs.length === 0) return doc

  const post = await req.payload.findByID({
    collection: 'posts',
    id: linkedPostID,
    draft: true,
    depth: 0,
    req,
  })

  const existingAuthorIDs = (post.authors || [])
    .map(author => getRelationshipID(author))
    .filter((id): id is number => id !== undefined)
  const authorsToAdd = assignedAuthorIDs.filter(id => !existingAuthorIDs.includes(id))

  if (authorsToAdd.length > 0) {
    await req.payload.update({
      collection: 'posts',
      id: linkedPostID,
      data: {
        authors: [...existingAuthorIDs, ...authorsToAdd],
      },
      draft: true,
      depth: 0,
      req,
    })
  }

  return doc
}
