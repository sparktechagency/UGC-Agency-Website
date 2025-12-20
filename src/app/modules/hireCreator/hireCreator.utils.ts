

export const getDeliveryEmailTemplate = (creatorName: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Delivery Accepted</title>

<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

table {
  border-collapse: collapse;
}

h1, h2, h3, p {
  margin: 0;
  padding: 0;
  font-family: "Source Serif 4", serif;
}
</style>
</head>

<body>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">

<!-- EMAIL CONTAINER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

<!-- HEADER -->
<tr>
<td style="background:#b5c4d4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
          DELIVERY<br>ACCEPTED!
        </h1>
      </td>
      <td align="right">
        <div style="width:85px; height:85px; background:#fce8a4; border-radius:50%; text-align:center;">
          <div style="font-size:20px; font-weight:700; padding-top:22px; color:#000;">TSC</div>
          <div style="font-size:7px; font-weight:500; color:#000;">THE SOCIAL CHANCE</div>
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;">
  <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
    Hello ${creatorName},
  </h2>

  <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
    <p style="margin-bottom:15px;">
      Great news! Your delivery for Project ID: cbjscslkcmsömc has been officially accepted by the client.
    </p>
    <p style="margin-bottom:15px;">
      Thank you for your hard work, professionalism, and creativity. The client is very happy with the results.
    </p>
    <p style="margin-bottom:15px;">
      We will contact you shortly to request your bank details so we can process your payment.
    </p>
    <p style="margin-bottom:15px;">
      If you have any questions, feel free to reach out.
    </p>
    <p style="margin-bottom:15px;">
      Keep up the amazing work!
    </p>
    <p style="margin-top:20px;">
      Best Regards,<br>The Social Chance
    </p>
  </div>

  <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
    This is an automated email, do not reply.
  </p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#fce8a4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
          Support email.
        </h3>

        <p style="margin-bottom:5px;">
          <a href="mailto:Shamimnader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Shamimnader@thesocialchance.com
          </a>
        </p>

        <p style="margin-bottom:10px;">
          <a href="mailto:Fareshtanader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Fareshtanader@thesocialchance.com
          </a>
        </p>

        <div style="margin-top:20px;">
          <a href="https://google.com">
            <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.tiktok.com">
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.instagram.com">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://x.com">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20">
          </a>
        </div>
      </td>

      <td align="right" valign="bottom">
        <div style="font-size:90px; opacity:0.7;">📢</div>
      </td>
    </tr>
  </table>
</td>
</tr>

</table>
<!-- END CONTAINER -->

</td>
</tr>
</table>

</body>
</html>
`;
};



export const getAdminNotificationEmailTemplate = (
  creators: any[],
  hireCreatorDetails: any,
) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Delivery Report</title>

<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Source Serif 4", serif;
}

body {
  background-color: #f0f0f0;
  padding: 20px;
}

.report-container {
  width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
}

.header {
  background-color: #b5c4d4;
  padding: 40px;
  color: #ffffff;
}

.header table {
  width: 100%;
}

.header h1 {
  font-size: 42px;
  letter-spacing: 2px;
  line-height: 1;
  font-weight: 700;
}

.logo-circle {
  background-color: #fce8a4;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  text-align: center;
  color: #000;
}

.logo-circle strong {
  display: block;
  font-size: 18px;
  font-weight: 700;
  margin-top: 22px;
  padding-top: 10px;
}

.logo-circle span {
  display: block;
  font-size: 8px;
}

.content {
  padding: 40px;
}

.content h2 {
  font-size: 24px;
  margin-bottom: 25px;
  font-weight: 600;
}

.summary-card {
  background-color: #f1ede4;
  border-radius: 40px;
  padding: 40px;
}

.project-info p {
  font-size: 14px;
  margin-bottom: 8px;
}

.creator-table {
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
}

.creator-table th {
  text-align: left;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
  font-size: 14px;
}

.creator-table td {
  padding: 12px 0;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
}

.creator-table a {
  color:  #222222;
  text-decoration: none;
}

.automated-note {
  margin-top: 30px;
  font-size: 12px;
  color: #888;
  text-align: center;
}

.footer {
  background-color: #fce8a4;
  padding: 40px;
}

.footer table {
  width: 100%;
}

.footer h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.footer p {
  font-size: 13px;
  margin-bottom: 5px;
  color: #222222;
}

.illustration {
  font-size: 90px;
  text-align: right;
}
</style>
</head>

<body>

<div class="report-container">

  <div class="header">
    <table>
      <tr>
        <td align="left">
          <h1>DELIVERY<br>REPORT</h1>
        </td>
        <td align="right">
          <div class="logo-circle">
            <strong>TSC</strong>
            <span>THE SOCIAL CHANCE</span>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <div class="content">
    <h2>Project summary</h2>

    <div class="summary-card">
      <div class="project-info">
        <p><strong>Project ID :</strong> ${hireCreatorDetails._id}</p>
        <p><strong>Status :</strong> Delivered</p>
        <p><strong>Total Creators :</strong> ${creators.length}</p>
      </div>

      <table class="creator-table">
        <thead>
          <tr>
            <th>Creator name</th>
            <th>Creator Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        ${creators
          .map(
            (creator) => `
                <tr>
                  <td>${creator.creatorUserId.fullName}</td>
                  <td><a href="mailto:${creator.creatorUserId.email}">${creator.creatorUserId.email}</a></td>
                  <td>Delivered</td>
                </tr>
              `,
          )
          .join('')}
        </tbody>
      </table>
    </div>

    <p class="automated-note">This is an automated email, do not reply.</p>
  </div>

  <div class="footer">
    <table>
      <tr>
        <td align="left">
          <h3>Support email.</h3>
         
          <p>
  <a
    href="mailto:Shamimnader@thesocialchance.com"
    style="color:#000000; text-decoration:none; font-weight:500;"
  >
    Shamimnader@thesocialchance.com
  </a>
</p>

<p>
  <a
    href="mailto:Fareshtanader@thesocialchance.com"
    style="color:#000000; text-decoration:none; font-weight:500;"
  >
    Fareshtanader@thesocialchance.com
  </a>
</p>


          <div style="margin-top:20px;">
            <a href="https://google.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" alt="Website" style="margin-right:12px; vertical-align:middle;">
            </a>

            <a href="https://www.tiktok.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" alt="TikTok" style="margin-right:12px; vertical-align:middle;">
            </a>

            <a href="https://www.instagram.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" alt="Instagram" style="margin-right:12px; vertical-align:middle;">
            </a>

            <a href="https://x.com" target="_blank">
              <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20" alt="X" style="vertical-align:middle;">
            </a>
          </div>
        </td>

        <td align="right" valign="bottom">
          <div class="illustration">📢</div>
        </td>
      </tr>
    </table>
  </div>

</div>

</body>
</html>`;
};



export const getRevisionEmailTemplate = (payload: any) => {
  const { hireCreatorId, brandCreatorName, brandCreatorEmail } = payload;

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
      <tr>
        <td style="padding: 20px;">

          <h2 style="margin-bottom: 16px;">Revision Request Received</h2>

          <p>Hello Admin,</p>

          <p>A creator has requested a revision on one of their projects. Details are below:</p>

          <table style="margin: 20px 0; padding: 15px; background: #f7f7f7; border-radius: 6px;">
            <tr><td><strong>Hire Creator ID:</strong> ${hireCreatorId}</td></tr>
            <tr><td><strong>Brand Creator Name:</strong> ${brandCreatorName}</td></tr>
            <tr><td><strong>Brand Creator Email:</strong> ${brandCreatorEmail}</td></tr>
          </table>

          <p>Please check the dashboard to review and respond.</p>

          <p style="margin-top: 25px;">
            Regards,<br/>
            Lunq Team
          </p>
        </td>
      </tr>
    </table>
  `;
};



export const getScriptBrandCreatorEmailTemplate = (hireCreatorName: string) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Delivery Accepted</title>

<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

table {
  border-collapse: collapse;
}

h1, h2, h3, p {
  margin: 0;
  padding: 0;
  font-family: "Source Serif 4", serif;
}
</style>
</head>

<body>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">

<!-- EMAIL CONTAINER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

<!-- HEADER -->
<tr>
<td style="background:#b5c4d4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
          SCRIPT<br>DELIVERY!
        </h1>
      </td>
      <td align="right">
        <div style="width:85px; height:85px; background:#fce8a4; border-radius:50%; text-align:center;">
          <div style="font-size:20px; font-weight:700; padding-top:22px; color:#000;">TSC</div>
          <div style="font-size:7px; font-weight:500; color:#000;">THE SOCIAL CHANCE</div>
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;">
  <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
    Hello ${hireCreatorName},
  </h2>

  <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
    <p style="margin-bottom:15px;">
      Since no script was provided for the Project ID: hfcnsncnc, our admin has uploaded a suggested script to keep everything moving forward. You can find the script in your user account under the Order.
    </p>
    <p style="margin-bottom:15px;">
      Please review and confirm the script at your earliest convenience. If you would like to request changes,please note that you can request one revision only. After that, the script will be finalized so production can begin.
    </p>
    <p style="margin-bottom:15px;">
      We will contact you shortly to request your bank details so we can process your payment.
    </p>
    <p style="margin-top:20px;">
      Best Regards,<br>The Social Chance
    </p>
  </div>

  <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
    This is an automated email, do not reply.
  </p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#fce8a4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
          Support email.
        </h3>

        <p style="margin-bottom:5px;">
          <a href="mailto:Shamimnader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Shamimnader@thesocialchance.com
          </a>
        </p>

        <p style="margin-bottom:10px;">
          <a href="mailto:Fareshtanader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Fareshtanader@thesocialchance.com
          </a>
        </p>

        <div style="margin-top:20px;">
          <a href="https://google.com">
            <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.tiktok.com">
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.instagram.com">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://x.com">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20">
          </a>
        </div>
      </td>

      <td align="right" valign="bottom">
        <div style="font-size:90px; opacity:0.7;">📢</div>
      </td>
    </tr>
  </table>
</td>
</tr>

</table>
<!-- END CONTAINER -->

</td>
</tr>
</table>

</body>
</html>

  `;
};


export const getScriptAcceptFromHireCreatorEmailTemplate = (
  payload: any
) => {
  const {  hireCreatorID } = payload;


    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Delivery Accepted</title>

<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

table {
  border-collapse: collapse;
}

h1, h2, h3, p {
  margin: 0;
  padding: 0;
  font-family: "Source Serif 4", serif;
}
</style>
</head>

<body>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">

<!-- EMAIL CONTAINER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

<!-- HEADER -->
<tr>
<td style="background:#b5c4d4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
          SCRIPT<br>ACCEPTED!
        </h1>
      </td>
      <td align="right">
        <div style="width:85px; height:85px; background:#fce8a4; border-radius:50%; text-align:center;">
          <div style="font-size:20px; font-weight:700; padding-top:22px; color:#000;">TSC</div>
          <div style="font-size:7px; font-weight:500; color:#000;">THE SOCIAL CHANCE</div>
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;">
  <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
    Hello Admin,
  </h2>

  <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
    <p style="margin-bottom:15px;">
      The user has accepted the script added by the admin for Project ID: ${hireCreatorID}
    </p>
    <p style="margin-bottom:15px;">
      Please check the dashboard for more details and proceed with the next steps.
    </p>
    <p style="margin-top:20px;">
      Best Regards,<br>The Social Chance
    </p>
  </div>

  <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
    This is an automated email, do not reply.
  </p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#fce8a4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
          Support email.
        </h3>

        <p style="margin-bottom:5px;">
          <a href="mailto:Shamimnader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Shamimnader@thesocialchance.com
          </a>
        </p>

        <p style="margin-bottom:10px;">
          <a href="mailto:Fareshtanader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Fareshtanader@thesocialchance.com
          </a>
        </p>

        <div style="margin-top:20px;">
          <a href="https://google.com">
            <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.tiktok.com">
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.instagram.com">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://x.com">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20">
          </a>
        </div>
      </td>

      <td align="right" valign="bottom">
        <div style="font-size:90px; opacity:0.7;">📢</div>
      </td>
    </tr>
  </table>
</td>
</tr>

</table>
<!-- END CONTAINER -->

</td>
</tr>
</table>

</body>
</html>`;
  
};


export const getScriptCanceledFromHireCreatorEmailTemplate = (
  payload: any
) => {
  const {  hireCreatorID } = payload;


    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Delivery Accepted</title>

<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

table {
  border-collapse: collapse;
}

h1, h2, h3, p {
  margin: 0;
  padding: 0;
  font-family: "Source Serif 4", serif;
}
</style>
</head>

<body>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:20px 0;">

<!-- EMAIL CONTAINER -->
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

<!-- HEADER -->
<tr>
<td style="background:#b5c4d4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
          SCRIPT<br>REJECTED!
        </h1>
      </td>
      <td align="right">
        <div style="width:85px; height:85px; background:#fce8a4; border-radius:50%; text-align:center;">
          <div style="font-size:20px; font-weight:700; padding-top:22px; color:#000;">TSC</div>
          <div style="font-size:7px; font-weight:500; color:#000;">THE SOCIAL CHANCE</div>
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;">
  <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
    Hello Admin,
  </h2>

  <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
    <p style="margin-bottom:15px;">
      The user has reviewed the script added by the admin for Project ID: ${hireCreatorID} and has rejected it.
    </p>
    <p style="margin-bottom:15px;">
      Please check the dashboard for more details and proceed with the next steps.
    </p>
    <p style="margin-top:20px;">
      Best Regards,<br>The Social Chance
    </p>
  </div>

  <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
    This is an automated email, do not reply.
  </p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#fce8a4; padding:40px;">
  <table width="100%">
    <tr>
      <td align="left">
        <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
          Support email.
        </h3>

        <p style="margin-bottom:5px;">
          <a href="mailto:Shamimnader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Shamimnader@thesocialchance.com
          </a>
        </p>

        <p style="margin-bottom:10px;">
          <a href="mailto:Fareshtanader@thesocialchance.com"
             style="color:#000000; text-decoration:none; font-size:14px;">
            Fareshtanader@thesocialchance.com
          </a>
        </p>

        <div style="margin-top:20px;">
          <a href="https://google.com">
            <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.tiktok.com">
            <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://www.instagram.com">
            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="margin-right:12px;">
          </a>
          <a href="https://x.com">
            <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20">
          </a>
        </div>
      </td>

      <td align="right" valign="bottom">
        <div style="font-size:90px; opacity:0.7;">📢</div>
      </td>
    </tr>
  </table>
</td>
</tr>

</table>
<!-- END CONTAINER -->

</td>
</tr>
</table>

</body>
</html>`;
  
};



