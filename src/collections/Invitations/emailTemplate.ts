export const getInvitationEmailHtml = (inviteUrl: string, email: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Newsletter Subscription</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header with logo -->
          <tr>
            <td style="background: #42A5F5; padding: 40px 20px; text-align: center;">
              <img src="https://www.liberatorch.com/logo_tagline_white.webp" alt="Liberatorch" style="max-width: 250px; height: auto; display: block; margin: 0 auto;" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h1 style="margin: 0 0 20px; font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.3;">
                You've Been Invited!
              </h1>

              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                Hello!
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #4a4a4a;">
                You have been invited to join the LiberatorCH. Click the button below to accept your invitation and create your account.
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${inviteUrl}" style="display: inline-block; padding: 16px 40px; background: #42A5F5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 20px; font-size: 14px; line-height: 1.6; color: #6a6a6a;">
                Or copy and paste this link into your browser:
              </p>

              <p style="margin: 0 0 30px; font-size: 14px; line-height: 1.6; color: #60a5fa; word-break: break-all;">
                ${inviteUrl}
              </p>

              <div style="border-top: 1px solid #e5e5e5; padding-top: 30px; margin-top: 30px;">
                <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #9a9a9a;">
                  If you didn't request this subscription, you can safely ignore this email.
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
                    <img src="https://www.liberatorch.com/favicon_white.webp" alt="LiberatorCH Icon" style="width: 32px; height: 32px; margin-bottom: 15px;" />
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #ffffff; line-height: 1.5;">
                    This confirmation was sent to <strong style="color: #ffffff;">${email}</strong>
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
              If you didn't expect this confirmation, you can safely ignore this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
};

export const getInvitationEmailText = (inviteUrl: string, email: string): string => {
  return `
══════════════════════════════════════════
   YOU'RE INVITED TO JOIN LIBERATORCH!
══════════════════════════════════════════

Hello!

You've been invited to join LiberatorCH.

Click the link below to accept your invitation and create your account:

${inviteUrl}

──────────────────────────────────────────

This invitation was sent to: ${email}

If you didn't expect this invitation, you can safely ignore this email.

© ${new Date().getFullYear()} LiberatorCH. All rights reserved.
  `.trim();
};
