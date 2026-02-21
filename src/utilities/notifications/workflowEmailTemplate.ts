import type {User, WorkflowItem} from '@/payload-types'

interface WorkflowAssignedEmailParams {
  workflowItem: WorkflowItem
  recipient: User
  triggeredBy: User
  workflowItemUrl: string
}

export const getWorkflowAssignedEmailHtml = ({
  workflowItem,
  recipient,
  triggeredBy,
  workflowItemUrl,
}: WorkflowAssignedEmailParams): string => {
  const linkedPost =
    workflowItem.linkedPost && typeof workflowItem.linkedPost === 'object'
      ? workflowItem.linkedPost
      : null

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You've Been Assigned to a Workflow Item</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with logo -->
          <tr>
            <td style="background: #42A5F5; padding: 40px 20px; text-align: center;">
              <img src="https://www.liberatorch.com/logo_tagline_white.gif" alt="Liberatorch" style="max-width: 250px; height: auto; display: block; margin: 0 auto;" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">
                You've Been Assigned!
              </h1>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Hi ${recipient.name || 'there'},
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                <strong>${triggeredBy.name || triggeredBy.email}</strong> has assigned you to work on a new workflow item.
              </p>

              <!-- Workflow Item Details Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #42A5F5; padding: 20px; margin: 0 0 30px; border-radius: 4px;">
                <h2 style="margin: 0 0 15px; font-size: 20px; font-weight: 600; color: #1a1a1a;">
                  ${workflowItem.title}
                </h2>

                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a; width: 100px;">
                      <strong>Status:</strong>
                    </td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">
                      <span style="background-color: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 12px; font-weight: 500;">
                        ${workflowItem.status || 'Not Set'}
                      </span>
                    </td>
                  </tr>
                  ${
                    workflowItem.dueDate
                      ? `
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">
                      <strong>Due Date:</strong>
                    </td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">
                      ${new Date(workflowItem.dueDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                  `
                      : ''
                  }
                  ${
                    linkedPost
                      ? `
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #6a6a6a;">
                      <strong>Linked Post:</strong>
                    </td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">
                      ${linkedPost.title || 'Untitled Post'}
                    </td>
                  </tr>
                  `
                      : ''
                  }
                </table>

                ${
                  workflowItem.description
                    ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                  <strong style="font-size: 14px; color: #6a6a6a;">Description:</strong>
                  <p style="margin: 10px 0 0; font-size: 14px; line-height: 1.6; color: #4a4a4a;">
                    ${workflowItem.description}
                  </p>
                </div>
                `
                    : ''
                }
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${workflowItemUrl}" style="display: inline-block; padding: 16px 40px; background: #42A5F5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      View Workflow Item
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; font-size: 14px; line-height: 1.6; color: #6a6a6a;">
                Or copy and paste this link into your browser:
              </p>

              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #60a5fa; word-break: break-all;">
                ${workflowItemUrl}
              </p>

              <div style="border-top: 1px solid #e5e5e5; padding-top: 30px; margin-top: 30px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9a9a9a;">
                  This notification was sent because you were assigned to a workflow item. If you believe this was sent in error, please contact your team administrator.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #60a5fa; text-align: center; border-top: 1px solid #e5e5e5;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="https://www.liberatorch.com/favicon_white.gif" alt="LiberatorCH Icon" style="width: 32px; height: 32px; margin-bottom: 15px;" />
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #ffffff; line-height: 1.5;">
                    This notification was sent to <strong style="color: #ffffff;">${recipient.email}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 12px; color: #ffffff; padding-top: 10px;">
                    © ${new Date().getFullYear()} LiberatorCH. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Email Client Notice -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; margin-top: 20px;">
          <tr>
            <td style="text-align: center; font-size: 12px; color: #666666; line-height: 1.5;">
              You're receiving this because you were assigned to a workflow item on LiberatorCH.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export const getWorkflowAssignedEmailText = ({
  workflowItem,
  recipient,
  triggeredBy,
  workflowItemUrl,
}: WorkflowAssignedEmailParams): string => {
  const linkedPost =
    workflowItem.linkedPost && typeof workflowItem.linkedPost === 'object'
      ? workflowItem.linkedPost
      : null

  let text = `
══════════════════════════════════════════
   📋 YOU'VE BEEN ASSIGNED!
══════════════════════════════════════════

Hi ${recipient.name || 'there'},

${triggeredBy.name || triggeredBy.email} has assigned you to work on a new workflow item.

──────────────────────────────────────────
WORKFLOW ITEM DETAILS
──────────────────────────────────────────

Title: ${workflowItem.title}
Status: ${workflowItem.status || 'Not Set'}
`

  if (workflowItem.dueDate) {
    text += `Due Date: ${new Date(workflowItem.dueDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}\n`
  }

  if (linkedPost) {
    text += `Linked Post: ${linkedPost.title || 'Untitled Post'}\n`
  }

  if (workflowItem.description) {
    text += `\nDescription:\n${workflowItem.description}\n`
  }

  text += `
──────────────────────────────────────────

View the workflow item here:
${workflowItemUrl}

This notification was sent to: ${recipient.email}

© ${new Date().getFullYear()} LiberatorCH. All rights reserved.
  `.trim()

  return text
}
