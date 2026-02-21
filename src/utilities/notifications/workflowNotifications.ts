import type {User, WorkflowItem} from '@/payload-types'
import {getPayload} from 'payload'
import config from '@payload-config'
import {getServerSideURL} from '@/utilities/getURL'
import {getWorkflowAssignedEmailHtml, getWorkflowAssignedEmailText} from './workflowEmailTemplate'

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
 */
export async function sendWorkflowNotification(notification: WorkflowNotification): Promise<void> {
  const { type, workflowItem, recipient, triggeredBy } = notification

  // Generate the URL to the workflow item
  const workflowItemUrl = `${getServerSideURL()}/admin/collections/workflow-items/${workflowItem.id}`

  switch (type) {
    case 'assigned':
      console.log('\n========== SENDING WORKFLOW ASSIGNMENT EMAIL ==========')
      console.log('Timestamp:', new Date().toISOString())
      console.log('Workflow Item:', workflowItem.title)
      console.log('Recipient:', recipient.email, `(${recipient.name})`)
      console.log('Triggered By:', triggeredBy.email, `(${triggeredBy.name})`)

      try {
        const payload = await getPayload({ config })

        await payload.sendEmail({
          from: process.env.NOTIFS_FROM_ADDRESS ?? '',
          name: process.env.NOTIFS_FROM_NAME ?? '',
          to: recipient.email,
          subject: `You've been assigned to: ${workflowItem.title}`,
          html: getWorkflowAssignedEmailHtml({
            workflowItem,
            recipient,
            triggeredBy,
            workflowItemUrl,
          }),
          text: getWorkflowAssignedEmailText({
            workflowItem,
            recipient,
            triggeredBy,
            workflowItemUrl,
          }),
        })

        console.log('Email sent successfully to:', recipient.email)
      } catch (error) {
        console.error('Failed to send workflow assignment email:', error)
        throw error
      }

      console.log('=====================================================\n')
      break

    case 'status_changed':
      const statusNotification = notification as StatusChangedNotification
      console.log('\n========== WORKFLOW STATUS CHANGE NOTIFICATION ==========')
      console.log('Timestamp:', new Date().toISOString())
      console.log('Workflow Item:', workflowItem.title)
      console.log('Recipient:', recipient.email, `(${recipient.name})`)
      console.log('Triggered By:', triggeredBy.email, `(${triggeredBy.name})`)
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
      console.log(`  Click here to view: ${workflowItemUrl}`)
      console.log('\n========================================================\n')

      // TODO: Implement actual email sending for status changes
      break
  }
}

