import type {User, WorkflowItem} from '@/payload-types'

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
