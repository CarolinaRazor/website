import type {CollectionAfterChangeHook} from 'payload'
import type {User, WorkflowItem} from '@/payload-types'
import {sendWorkflowNotification} from '@/utilities/notifications/workflowNotifications'

export const notifyWorkflowChange: CollectionAfterChangeHook<WorkflowItem> = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  try {
    console.log('🔔 notifyWorkflowChange hook triggered')
    console.log('Operation:', operation)
    console.log('Doc assignedTo:', doc.assignedTo)
    console.log('Doc assignedTo type:', typeof doc.assignedTo)

    // On create - notify assigned users
    if (operation === 'create') {
      if (doc.assignedTo && Array.isArray(doc.assignedTo) && doc.assignedTo.length > 0) {
        console.log('✅ Has assigned users, count:', doc.assignedTo.length)

        const assignedUserIds = doc.assignedTo.map(user =>
          typeof user === 'object' ? user.id : user
        ).filter(Boolean)

        console.log('Assigned user IDs:', assignedUserIds)

        const usersResult = await req.payload.find({
          collection: 'users',
          where: {
            id: {
              in: assignedUserIds,
            },
          },
        })

        const assignedUsers = usersResult.docs as User[]
        console.log('Fetched users:', assignedUsers.map(u => u.email))

        for (const assignedUser of assignedUsers) {
          console.log('📧 Sending notification to:', assignedUser.email)
          await sendWorkflowNotification({
            type: 'assigned',
            workflowItem: doc,
            recipient: assignedUser,
            triggeredBy: req.user as User,
          })
        }
      } else {
        console.log('❌ No assigned users to notify')
      }
      return doc
    }

    // On update - check for changes
    if (operation === 'update' && previousDoc) {
      // Status change
      if (doc.status !== previousDoc.status) {
        // Notify all assigned users about status change
        if (doc.assignedTo && Array.isArray(doc.assignedTo) && doc.assignedTo.length > 0) {
          const assignedUsers = doc.assignedTo.map(user =>
            typeof user === 'object' ? user : null
          ).filter(Boolean) as User[]

          for (const assignedUser of assignedUsers) {
            await sendWorkflowNotification({
              type: 'status_changed',
              workflowItem: doc,
              recipient: assignedUser,
              triggeredBy: req.user as User,
              previousStatus: previousDoc.status,
              newStatus: doc.status,
            })
          }
        }

        // Notify creator if they're not the one making the change
        const creator = typeof doc.createdBy === 'object' ? doc.createdBy : null
        if (creator && creator.id !== req.user?.id) {
          await sendWorkflowNotification({
            type: 'status_changed',
            workflowItem: doc,
            recipient: creator as User,
            triggeredBy: req.user as User,
            previousStatus: previousDoc.status,
            newStatus: doc.status,
          })
        }
      }

      // Assignment changes
      const previousAssignedIds = Array.isArray(previousDoc.assignedTo)
        ? previousDoc.assignedTo.map(u => typeof u === 'object' ? u.id : u)
        : []
      const currentAssignedIds = Array.isArray(doc.assignedTo)
        ? doc.assignedTo.map(u => typeof u === 'object' ? u.id : u)
        : []

      // Find newly assigned users
      const newlyAssigned = currentAssignedIds.filter(id => !previousAssignedIds.includes(id))

      if (newlyAssigned.length > 0) {
        console.log('🆕 Newly assigned users:', newlyAssigned)

        const usersResult = await req.payload.find({
          collection: 'users',
          where: {
            id: {
              in: newlyAssigned,
            },
          },
        })

        const assignedUsers = usersResult.docs as User[]
        console.log('Fetched newly assigned users:', assignedUsers.map(u => u.email))

        for (const assignedUser of assignedUsers) {
          console.log('📧 Sending assignment notification to:', assignedUser.email)
          await sendWorkflowNotification({
            type: 'assigned',
            workflowItem: doc,
            recipient: assignedUser,
            triggeredBy: req.user as User,
          })
        }
      }
    }
  } catch (error) {
    console.error('Error in notifyWorkflowChange hook:', error)
  }

  return doc
}
