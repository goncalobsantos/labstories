interface EnquiryData {
  firstName: string;
  lastName: string;
  email: string;
  services: string[];
  message: string;
}

export function buildEnquiryEmail(data: EnquiryData): string {
  const servicesList = data.services
    .map(
      (s) =>
        `<span style="display:inline-block;padding:4px 14px;margin:0 6px 6px 0;border:1px solid #D4CFC9;border-radius:20px;font-size:12px;color:#1A1A1A;letter-spacing:0.05em;text-transform:uppercase;">${s}</span>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#FAF8F5;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border:1px solid #E8E4DF;">
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;border-bottom:1px solid #E8E4DF;">
              <h1 style="margin:0;font-size:24px;font-weight:normal;color:#1A1A1A;letter-spacing:0.02em;">
                LabStories
              </h1>
              <p style="margin:8px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#8B7E74;font-family:Arial,Helvetica,sans-serif;">
                New Enquiry
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <!-- Name -->
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8B7E74;font-family:Arial,Helvetica,sans-serif;">
                Name
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#1A1A1A;">
                ${data.firstName} ${data.lastName}
              </p>

              <!-- Email -->
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8B7E74;font-family:Arial,Helvetica,sans-serif;">
                Email
              </p>
              <p style="margin:0 0 24px;font-size:16px;color:#1A1A1A;">
                <a href="mailto:${data.email}" style="color:#1A1A1A;text-decoration:underline;">${data.email}</a>
              </p>

              <!-- Services -->
              <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8B7E74;font-family:Arial,Helvetica,sans-serif;">
                Services
              </p>
              <div style="margin:0 0 24px;">
                ${servicesList}
              </div>

              <!-- Message -->
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#8B7E74;font-family:Arial,Helvetica,sans-serif;">
                Message
              </p>
              <p style="margin:0;font-size:15px;color:#2E2E2E;line-height:1.7;white-space:pre-wrap;">
                ${data.message}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #E8E4DF;text-align:center;">
              <p style="margin:0;font-size:11px;color:#A89F97;letter-spacing:0.1em;font-family:Arial,Helvetica,sans-serif;">
                Sent from labstories.pt
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
