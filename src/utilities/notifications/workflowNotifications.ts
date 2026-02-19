import type {User, WorkflowItem} from '@/payload-types'

interface BaseNotification {
  workflowItem: WorkflowItem
  recipient: User
  triggeredBy: User
}

interface AssignedNotification extends BaseNotification {
  type: 'assigned'
}

interface StatusChangedNotification extends BaseNotification {
  type: 'status_changed'
  previousStatus?: string
  newStatus?: string
}

type WorkflowNotification = AssignedNotification | StatusChangedNotification

/**
 * Send a notification when a workflow item is assigned to a user
 *
 * TODO: Replace console.log with actual email/notification service
 */
export async function sendWorkflowNotification(notification: WorkflowNotification): Promise<void> {
  const { type, workflowItem, recipient, triggeredBy } = notification

  console.log('\n========== WORKFLOW NOTIFICATION ==========')
  console.log('Timestamp:', new Date().toISOString())
  console.log('Type:', type)
  console.log('Workflow Item ID:', workflowItem.id)
  console.log('Workflow Item Title:', workflowItem.title)
  console.log('Recipient:', recipient.email, `(${recipient.name})`)
  console.log('Triggered By:', triggeredBy.email, `(${triggeredBy.name})`)

  switch (type) {
    case 'assigned':
      console.log('Action: User was assigned to workflow item')
      console.log('Current Status:', workflowItem.status)
      console.log('\n📧 EMAIL PREVIEW:')
      console.log('To:', recipient.email)
      console.log('Subject:', `You've been assigned to: ${workflowItem.title}`)
      console.log('Body:')
      console.log(`  Hi ${recipient.name},`)
      console.log(`  `)
      console.log(`  ${triggeredBy.name} has assigned you to work on "${workflowItem.title}".`)
      console.log(`  Current status: ${workflowItem.status}`)
      if (workflowItem.description) {
        console.log(`  `)
        console.log(`  Description: ${workflowItem.description}`)
      }
      if (workflowItem.dueDate) {
        console.log(`  Due date: ${new Date(workflowItem.dueDate).toLocaleDateString()}`)
      }
      console.log(`  `)
      console.log(`  Click here to view: [Link to workflow item]`)
      break

    case 'status_changed':
      const statusNotification = notification as StatusChangedNotification
      console.log('Action: Status changed')
      console.log('Previous Status:', statusNotification.previousStatus)
      console.log('New Status:', statusNotification.newStatus)
      console.log('\n📧 EMAIL PREVIEW:')
      console.log('To:', recipient.email)
      console.log('Subject:', `Status updated: ${workflowItem.title}`)
      console.log('Body:')
      console.log(`  Hi ${recipient.name},`)
      console.log(`  `)
      console.log(`  ${triggeredBy.name} moved "${workflowItem.title}" from "${statusNotification.previousStatus}" to "${statusNotification.newStatus}".`)
      if (workflowItem.linkedPost) {
        const post = typeof workflowItem.linkedPost === 'object' ? workflowItem.linkedPost : null
        if (post) {
          console.log(`  `)
          console.log(`  Linked post: ${post.title || 'Untitled'}`)
        }
      }
      console.log(`  `)
      console.log(`  Click here to view: [Link to workflow item]`)
      break
  }

  console.log('\n==========================================\n')

  // TODO: Implement actual email sending
}

/**
 * Notify when a workflow item is moved in the Kanban board
 */
export async function notifyWorkflowMove(params: {
  workflowItem: WorkflowItem
  fromStatus: string
  toStatus: string
  movedBy: User
}): Promise<void> {
  const { workflowItem, fromStatus, toStatus, movedBy } = params

  console.log('\n========== WORKFLOW MOVE NOTIFICATION ==========')
  console.log('Timestamp:', new Date().toISOString())
  console.log('Workflow Item:', workflowItem.title)
  console.log('Moved By:', movedBy.email, `(${movedBy.name})`)
  console.log('From:', fromStatus)
  console.log('To:', toStatus)

  // Notify all assigned users
  if (workflowItem.assignedTo && Array.isArray(workflowItem.assignedTo)) {
    const assignedUsers = workflowItem.assignedTo
      .map(user => typeof user === 'object' ? user : null)
      .filter(Boolean) as User[]

    for (const assignedUser of assignedUsers) {
      if (assignedUser.id !== movedBy.id) {
        console.log(`  → Would notify: ${assignedUser.email}`)
      }
    }
  }

  // Notify creator if different from mover
  const creator = typeof workflowItem.createdBy === 'object' ? workflowItem.createdBy : null
  if (creator && creator.id !== movedBy.id) {
    console.log(`  → Would notify creator: ${creator.email}`)
  }

  console.log('===============================================\n')

  // TODO: Implement actual notifications
}

/**
 * Notify when a new workflow item is created
 */
export async function notifyWorkflowCreated(params: {
  workflowItem: WorkflowItem
  creator: User
}): Promise<void> {
  const { workflowItem, creator } = params

  console.log('\n========== NEW WORKFLOW ITEM ==========')
  console.log('Timestamp:', new Date().toISOString())
  console.log('Title:', workflowItem.title)
  console.log('Created By:', creator.email, `(${creator.name})`)
  console.log('Initial Status:', workflowItem.status)

  if (workflowItem.assignedTo && Array.isArray(workflowItem.assignedTo)) {
    const assignedUsers = workflowItem.assignedTo
      .map(user => typeof user === 'object' ? user : null)
      .filter(Boolean) as User[]

    console.log('Assigned To:', assignedUsers.map(u => u.email).join(', '))
  }

  console.log('======================================\n')

  // TODO: Implement actual notifications
}
