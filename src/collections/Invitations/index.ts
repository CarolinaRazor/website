import type {CollectionConfig} from 'payload'
import crypto from 'crypto';
import admin from "@/collections/Users/access/admin";
import {nobody} from "@/collections/Users/access/nobody";
import {getServerSideURL} from "@/utilities/getURL";

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  admin: {group: 'Users'},
  access: {
    create: admin,
    delete: admin,
    read: admin,
    update: nobody
  },
  auth: false,
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'token', type: 'text', admin:{hidden:true}},
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.token = crypto.randomBytes(32).toString('hex');
      }
    ],
    afterChange: [
      async ({ req, doc }) => {
        const inviteUrl = `${getServerSideURL()}/accept-invite?token=${doc.token}`;

        await req.payload.sendEmail({
          to: doc.email,
          subject: 'You\'re Invited to Join LiberatorCH!',
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Invitation to LiberatorCH</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                      <!-- Header with Logo -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                          <img src="https://www.liberatorch.com/logo_tagline.svg" alt="LiberatorCH" style="max-width: 280px; height: auto; margin-bottom: 10px;" />
                        </td>
                      </tr>

                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px; color: #ffffff;">
                          <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 600; color: #ffffff; text-align: center;">
                            You're Invited!
                          </h1>
                          <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                            Hello!
                          </p>
                          <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #e0e0e0;">
                            You've been invited to join <strong style="color: #ffffff;">LiberatorCH</strong>. Click the button below to accept your invitation and create your account.
                          </p>

                          <!-- CTA Button -->
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center" style="padding: 20px 0;">
                                <a href="${inviteUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                                  Accept Invitation
                                </a>
                              </td>
                            </tr>
                          </table>

                          <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #a0a0a0;">
                            Or copy and paste this link into your browser:
                          </p>
                          <p style="margin: 10px 0 0 0; font-size: 13px; word-break: break-all; color: #667eea;">
                            <a href="${inviteUrl}" style="color: #667eea; text-decoration: none;">${inviteUrl}</a>
                          </p>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding: 30px; background-color: #0a0a0a; text-align: center; border-top: 1px solid #333333;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center">
                                <img src="https://www.liberatorch.com/favicon.svg" alt="LiberatorCH Icon" style="width: 32px; height: 32px; margin-bottom: 15px;" />
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 13px; color: #808080; line-height: 1.5;">
                                This invitation was sent to <strong style="color: #a0a0a0;">${doc.email}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td style="font-size: 12px; color: #666666; padding-top: 10px;">
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
                          If you didn't expect this invitation, you can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
          text: `
══════════════════════════════════════════
   YOU'RE INVITED TO JOIN LIBERATORCH!
══════════════════════════════════════════

Hello!

You've been invited to join LiberatorCH.

Click the link below to accept your invitation and create your account:

${inviteUrl}

──────────────────────────────────────────

This invitation was sent to: ${doc.email}

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} LiberatorCH. All rights reserved.
          `.trim()
        })
      }
    ]
  }
};
