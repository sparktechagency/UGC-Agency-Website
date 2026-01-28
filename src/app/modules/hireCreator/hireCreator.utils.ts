

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
        <!-- Replace circular logo with image -->
        <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;">
          <img src="https://thesocialchangebucket.s3.eu-central-1.amazonaws.com/UGC.png" 
               alt="The Social Chance Logo"
               width="85" 
               height="85"
               style="object-fit:cover; display:block;">
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
      Great news! Your delivery for Project  has been officially accepted by the client.
    </p>
    <p style="margin-bottom:15px;">
      Thank you for your hard work, professionalism, and creativity. The client is very happy with the results.
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
        <!-- Replace circular logo with image -->
        <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;">
          <img src="https://thesocialchangebucket.s3.eu-central-1.amazonaws.com/UGC.png" 
               alt="The Social Chance Logo"
               width="85" 
               height="85"
               style="object-fit:cover; display:block;">
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



export const getRevisionEmailTemplate = (hireCreatorId: string, name: any) => {

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
      <tr>
        <td style="padding: 20px;">

          <h2 style="margin-bottom: 16px;">Revision Request Received</h2>

          <p>Hello Admin,</p>

          <p>A creator has requested a revision on one of their projects. Details are below:</p>

          <table style="margin: 20px 0; padding: 15px; background: #f7f7f7; border-radius: 6px;">
            <tr><td><strong>Hire Creator ID:</strong> ${hireCreatorId}</td></tr>
            <tr><td><strong>Brand Creator Name:</strong> ${name}</td></tr>
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


export const getScriptBrandCreatorEmailTemplate = (hireCreatorName: string, hireCreatorId: string) => {
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
        <!-- Replace circular logo with image -->
        <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;">
          <img src="https://thesocialchangebucket.s3.eu-central-1.amazonaws.com/UGC.png" 
               alt="The Social Chance Logo"
               width="85" 
               height="85"
               style="object-fit:cover; display:block;">
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
      Since no script was provided for the Project ID: ${hireCreatorId}, our admin has uploaded a suggested script to keep everything moving forward. You can find the script in your user account under the Order.
    </p>
    <p style="margin-bottom:15px;">
      Please review and confirm the script at your earliest convenience. If you would like to request changes,please note that you can request one revision only. After that, the script will be finalized so production can begin.
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
        <!-- Replace circular logo with image -->
        <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;">
          <img src="https://thesocialchangebucket.s3.eu-central-1.amazonaws.com/UGC.png" 
               alt="The Social Chance Logo"
               width="85" 
               height="85"
               style="object-fit:cover; display:block;">
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

// export const getMailAdminFromHireCreatorForVideoRevision = (
//   hirecreatorId: any, hireCreatorname: any
// ) => {

//     return `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>Delivery Accepted</title>

// <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

// <style>
// body {
//   margin: 0;
//   padding: 0;
//   background-color: #f4f4f4;
// }

// table {
//   border-collapse: collapse;
// }

// h1, h2, h3, p {
//   margin: 0;
//   padding: 0;
//   font-family: "Source Serif 4", serif;
// }
// </style>
// </head>

// <body>

// <table width="100%" cellpadding="0" cellspacing="0">
// <tr>
// <td align="center" style="padding:20px 0;">

// <!-- EMAIL CONTAINER -->
// <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

// <!-- HEADER -->
// <tr>
// <td style="background:#b5c4d4; padding:40px;">
//   <table width="100%">
//     <tr>
//       <td align="left">
//         <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
//           ORDER<br>REVISION!
//         </h1>
//       </td>
//       <td align="right">
//         <div style="width:85px; height:85px; background:#fce8a4; border-radius:50%; text-align:center;">
//           <div style="font-size:20px; font-weight:700; padding-top:22px; color:#000;">TSC</div>
//           <div style="font-size:7px; font-weight:500; color:#000;">THE SOCIAL CHANCE</div>
//         </div>
//       </td>
//     </tr>
//   </table>
// </td>
// </tr>

// <!-- CONTENT -->
// <tr>
// <td style="padding:40px;">
//   <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
//     Hello Admin,
//   </h2>

//   <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
//     <p style="margin-bottom:15px;">
//       Great news! Your delivery for Project ID: cbjscslkcmsömc has been officially accepted by the client.
//     </p>
//     <p style="margin-bottom:15px;">
//       Thank you for your hard work, professionalism, and creativity. The client is very happy with the results.
//     </p>
//     <p style="margin-bottom:15px;">
//       We will contact you shortly to request your bank details so we can process your payment.
//     </p>
//     <p style="margin-bottom:15px;">
//       If you have any questions, feel free to reach out.
//     </p>
//     <p style="margin-bottom:15px;">
//       Keep up the amazing work!
//     </p>
//     <p style="margin-top:20px;">
//       Best Regards,<br>The Social Chance
//     </p>
//   </div>

//   <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
//     This is an automated email, do not reply.
//   </p>
// </td>
// </tr>

// <!-- FOOTER -->
// <tr>
// <td style="background:#fce8a4; padding:40px;">
//   <table width="100%">
//     <tr>
//       <td align="left">
//         <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
//           Support email.
//         </h3>

//         <p style="margin-bottom:5px;">
//           <a href="mailto:Shamimnader@thesocialchance.com"
//              style="color:#000000; text-decoration:none; font-size:14px;">
//             Shamimnader@thesocialchance.com
//           </a>
//         </p>

//         <p style="margin-bottom:10px;">
//           <a href="mailto:Fareshtanader@thesocialchance.com"
//              style="color:#000000; text-decoration:none; font-size:14px;">
//             Fareshtanader@thesocialchance.com
//           </a>
//         </p>

//         <div style="margin-top:20px;">
//           <a href="https://google.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" style="margin-right:12px;">
//           </a>
//           <a href="https://www.tiktok.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" style="margin-right:12px;">
//           </a>
//           <a href="https://www.instagram.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="margin-right:12px;">
//           </a>
//           <a href="https://x.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20">
//           </a>
//         </div>
//       </td>

//       <td align="right" valign="bottom">
//         <div style="font-size:90px; opacity:0.7;">📢</div>
//       </td>
//     </tr>
//   </table>
// </td>
// </tr>

// </table>
// <!-- END CONTAINER -->

// </td>
// </tr>
// </table>

// </body>
// </html>
// `;
  
// };


// export const getMailAdminFromHireCreatorForVideoRevision = (
//   hirecreatorId: any,
//   hireCreatorname: any,
//   creatorsList: any
// ) => {

//    return `<!DOCTYPE html>
// <html lang="en">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <title>Delivery Accepted</title>

// <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

// <style>
// body {
//   margin: 0;
//   padding: 0;
//   background-color: #f4f4f4;
// }

// table {
//   border-collapse: collapse;
// }

// h1, h2, h3, p {
//   margin: 0;
//   padding: 0;
//   font-family: "Source Serif 4", serif;
// }
// </style>
// </head>

// <body>

// <table width="100%" cellpadding="0" cellspacing="0">
// <tr>
// <td align="center" style="padding:20px 0;">

// <!-- EMAIL CONTAINER -->
// <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

// <!-- HEADER -->
// <tr>
// <td style="background:#b5c4d4; padding:40px;">
//   <table width="100%">
//     <tr>
//       <td align="left">
//         <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
//           VIDEO REVISION<br>REQUEST!
//         </h1>
//       </td>
//       <td align="right">
//         <!-- Replace circular logo with image -->
//         <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;">
//           <img src="https://thesocialchangebucket.s3.eu-central-1.amazonaws.com/UGC.png" 
//                alt="The Social Chance Logo"
//                width="85" 
//                height="85"
//                style="object-fit:cover; display:block;">
//         </div>
//       </td>
//     </tr>
//   </table>
// </td>
// </tr>

// <!-- CONTENT -->
// <tr>
// <td style="padding:40px;">
//   <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
//     Hello Admin,
//   </h2>

//   <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
//     <p style="margin-bottom:15px;">
//       Great news! Your delivery for Project ID: cbjscslkcmsömc has been officially accepted by the client.
//     </p>
//     <p style="margin-bottom:15px;">
//       Thank you for your hard work, professionalism, and creativity. The client is very happy with the results.
//     </p>
//     <p style="margin-bottom:15px;">
//       We will contact you shortly to request your bank details so we can process your payment.
//     </p>
//     <p style="margin-bottom:15px;">
//       If you have any questions, feel free to reach out.
//     </p>
//     <p style="margin-bottom:15px;">
//       Keep up the amazing work!
//     </p>
//     <p style="margin-top:20px;">
//       Best Regards,<br>The Social Chance
//     </p>
//   </div>

//   <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
//     This is an automated email, do not reply.
//   </p>
// </td>
// </tr>

// <!-- FOOTER -->
// <tr>
// <td style="background:#fce8a4; padding:40px;">
//   <table width="100%">
//     <tr>
//       <td align="left">
//         <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
//           Support email.
//         </h3>

//         <p style="margin-bottom:5px;">
//           <a href="mailto:Shamimnader@thesocialchance.com"
//              style="color:#000000; text-decoration:none; font-size:14px;">
//             Shamimnader@thesocialchance.com
//           </a>
//         </p>

//         <p style="margin-bottom:10px;">
//           <a href="mailto:Fareshtanader@thesocialchance.com"
//              style="color:#000000; text-decoration:none; font-size:14px;">
//             Fareshtanader@thesocialchance.com
//           </a>
//         </p>

//         <div style="margin-top:20px;">
//           <a href="https://google.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" style="margin-right:12px;">
//           </a>
//           <a href="https://www.tiktok.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" style="margin-right:12px;">
//           </a>
//           <a href="https://www.instagram.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" style="margin-right:12px;">
//           </a>
//           <a href="https://x.com">
//             <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20">
//           </a>
//         </div>
//       </td>

//       <td align="right" valign="bottom">
//         <div style="font-size:90px; opacity:0.7;">📢</div>
//       </td>
//     </tr>
//   </table>
// </td>
// </tr>

// </table>
// <!-- END CONTAINER -->

// </td>
// </tr>
// </table>

// </body>
// </html>
// `;
// //   return `<!DOCTYPE html>
// // <html lang="en">
// // <head>
// // <meta charset="UTF-8">
// // <meta name="viewport" content="width=device-width, initial-scale=1.0">
// // <title>Video Revision Request</title>

// // <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

// // <style>
// // body {
// //   margin: 0;
// //   padding: 0;
// //   background-color: #f4f4f4;
// // }

// // table {
// //   border-collapse: collapse;
// // }

// // h1, h2, h3, p {
// //   margin: 0;
// //   padding: 0;
// //   font-family: "Source Serif 4", serif;
// // }

// // img {
// //   display: block;
// //   max-width: 100%;
// // }
// // </style>
// // </head>

// // <body>

// // <table width="100%" cellpadding="0" cellspacing="0">
// // <tr>
// // <td align="center" style="padding:20px 0;">

// // <!-- EMAIL CONTAINER -->
// // <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

// // <!-- HEADER -->
// // <tr>
// // <td style="background:#b5c4d4; padding:40px;">
// //   <table width="100%">
// //     <tr>
// //       <td align="left">
// //         <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;">
// //           VIDEO<br>REVISION REQUEST
// //         </h1>
// //       </td>
// //       <td align="right">
// //         <!-- Replace circular logo with image -->
// //         <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;">
// //           <img src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg" 
// //                alt="The Social Chance Logo"
// //                width="85" 
// //                height="85"
// //                style="object-fit:cover; display:block;">
// //         </div>
// //       </td>
// //     </tr>
// //   </table>
// // </td>
// // </tr>

// // <!-- CONTENT -->
// // <tr>
// // <td style="padding:40px;">
// //   <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;">
// //     Attention: Admin Team
// //   </h2>

// //   <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;">
// //     <p style="margin-bottom:15px; font-weight:600;">
// //       📋 <strong>Video Revision Required</strong>
// //     </p>
    
// //     <p style="margin-bottom:15px;">
// //       This is to inform you that the client <strong>${hireCreatorname}</strong> has requested revisions for their video project.
// //     </p>
    
// //     <p style="margin-bottom:15px;">
// //       <strong>Project Details:</strong><br>
// //       • Creator Name: ${hireCreatorname}<br>
// //       • Project ID: ${hirecreatorId}<br>
// //       • Status: Revision Requested
// //     </p>
    
// //     <p style="margin-bottom:20px; background:#fff9e6; padding:15px; border-left:4px solid #ffcc00; border-radius:8px;">
// //       <strong>⚠️ Action Required:</strong><br>
// //       Please review the revision request and coordinate with the creator to address the client's feedback. Ensure all revision notes are clearly communicated.
// //     </p>
    
// //     <p style="margin-bottom:15px;">
// //       <strong>Next Steps:</strong><br>
// //       1. Review the client's feedback<br>
// //       2. Contact creator for revision timeline<br>
// //       3. Update project status in system<br>
// //       4. Ensure quality check after revisions
// //     </p>
    
// //     <p style="margin-bottom:15px;">
// //       Please monitor this project closely to ensure timely delivery of the revised video while maintaining quality standards.
// //     </p>
    
// //     <p style="margin-top:25px; font-weight:600;">
// //       Best Regards,<br>
// //       <span style="color:#2c5282;">The Social Chance Team</span>
// //     </p>
// //   </div>

// //   <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
// //     This is an automated notification. Please check the project management system for details.
// //   </p>
// // </td>
// // </tr>

// // <!-- FOOTER -->
// // <tr>
// // <td style="background:#fce8a4; padding:40px;">
// //   <table width="100%">
// //     <tr>
// //       <td align="left">
// //         <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
// //           Need Assistance?
// //         </h3>

// //         <p style="margin-bottom:5px; font-size:14px;">
// //           <strong>Project Manager:</strong><br>
// //           <a href="mailto:Shamimnader@thesocialchance.com"
// //              style="color:#000000; text-decoration:none;">
// //             Shamim Nader
// //           </a>
// //         </p>

// //         <p style="margin-bottom:15px; font-size:14px;">
// //           <strong>Support Lead:</strong><br>
// //           <a href="mailto:Fareshtanader@thesocialchance.com"
// //              style="color:#000000; text-decoration:none;">
// //             Fareshta Nader
// //           </a>
// //         </p>

// //         <div style="margin-top:25px;">
// //           <a href="https://facebook.com/thesocialchance" style="text-decoration:none; margin-right:12px;">
// //             <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" alt="Facebook">
// //           </a>
// //           <a href="https://tiktok.com/@thesocialchance" style="text-decoration:none; margin-right:12px;">
// //             <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" alt="TikTok">
// //           </a>
// //           <a href="https://instagram.com/thesocialchance" style="text-decoration:none; margin-right:12px;">
// //             <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" alt="Instagram">
// //           </a>
// //           <a href="https://twitter.com/thesocialchance" style="text-decoration:none;">
// //             <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20" alt="Twitter">
// //           </a>
// //         </div>
// //       </td>

// //       <td align="right" valign="bottom">
// //         <div style="font-size:90px; opacity:0.7;">🎬</div>
// //       </td>
// //     </tr>
// //   </table>
// // </td>
// // </tr>

// // </table>
// // <!-- END CONTAINER -->

// // </td>
// // </tr>
// // </table>

// // </body>
// // </html>
// // `;
// };


export const getMailAdminFromHireCreatorForVideoRevision = (
  hirecreatorId: any,
  hireCreatorname: any,
  creatorsList: any,
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Video Revision Request</title>

<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">

<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    font-family: "Source Serif 4", serif;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  table {
    border-collapse: collapse;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
  }
  
  img {
    border: 0;
    height: auto;
    line-height: 100%;
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
  }
  
  h1, h2, h3, p {
    margin: 0;
    padding: 0;
    font-family: "Source Serif 4", serif;
  }
  
  @media only screen and (max-width: 600px) {
    .container {
      width: 100% !important;
    }
    
    .header h1 {
      font-size: 28px !important;
      line-height: 1.2 !important;
    }
    
    .content-box {
      padding: 25px !important;
      border-radius: 20px !important;
    }
    
    .logo-container {
      width: 65px !important;
      height: 65px !important;
    }
    
    .logo-img {
      width: 65px !important;
      height: 65px !important;
    }
    
    .main-heading {
      font-size: 26px !important;
      margin-bottom: 20px !important;
    }
    
    .creator-table th,
    .creator-table td {
      padding: 8px 10px !important;
      font-size: 12px !important;
    }
    
    .footer-emoji {
      font-size: 60px !important;
    }
    
    .social-icons img {
      width: 18px !important;
      height: 18px !important;
      margin-right: 8px !important;
    }
    
    .mobile-stack {
      display: block !important;
      width: 100% !important;
    }
    
    .mobile-center {
      text-align: center !important;
    }
    
    .mobile-padding {
      padding: 20px !important;
    }
    
    .mobile-spacing {
      margin-bottom: 15px !important;
    }
  }
</style>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4;">

<!--[if mso]>
<style type="text/css">
body, table, td {font-family: 'Source Serif 4', Georgia, serif !important;}
</style>
<![endif]-->

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
<tr>
<td align="center" style="padding:20px 0;">

<!-- EMAIL CONTAINER -->
<table width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="max-width:600px; width:100%; background:#ffffff;">
<tbody>

<!-- HEADER -->
<tr>
<td style="background:#b5c4d4; padding:40px;" class="mobile-padding">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="left" class="mobile-center" style="vertical-align:middle;">
        <h1 style="font-size:38px; color:#ffffff; font-weight:700; line-height:1.1;" class="header">
          VIDEO REVISION<br>REQUEST!
        </h1>
      </td>
      <td align="right" width="85" class="mobile-stack mobile-center" style="vertical-align:middle; padding-top:20px;">
        <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;" class="logo-container">
          <img src="https://thesocialchangebucket.s3.eu-central-1.amazonaws.com/UGC.png" 
               alt="The Social Chance Logo"
               width="85" 
               height="85"
               style="object-fit:cover; display:block; border-radius:50%;" class="logo-img">
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:40px;" class="mobile-padding">
  <h2 style="font-size:26px; font-weight:700; margin-bottom:25px;" class="main-heading">
    Attention: Admin Team
  </h2>

  <div style="background:#f1ede4; border-radius:40px; padding:40px; font-size:14px; color:#333; line-height:1.6;" class="content-box">
    
    <!-- New Revision Request -->
    <div style="margin-bottom:25px; padding-bottom:20px; border-bottom:2px dashed #d4c9b4;">
      <p style="margin-bottom:10px; font-size:16px; font-weight:600; color:#2c3e50;">
        📋 <strong>New Revision Request Received</strong>
      </p>
      <p style="margin-bottom:15px;">
        The client <strong>${hireCreatorname}</strong> has requested revisions for their video order.
      </p>
    </div>
    
    <!-- Project Details -->
    <div style="margin-bottom:25px;" class="mobile-spacing">
      <p style="margin-bottom:15px; font-weight:600; color:#2c3e50;">
        📄 Project Details:
      </p>
      <div style="background:#ffffff; padding:15px; border-radius:10px; margin-bottom:20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:8px 0; width:40%;"><strong>Client Name:</strong></td>
            <td style="padding:8px 0;">${hireCreatorname}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;"><strong>Order/Project ID:</strong></td>
            <td style="padding:8px 0;">${hirecreatorId}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;"><strong>Status:</strong></td>
            <td style="padding:8px 0;">
              <span style="background:#fff3cd; color:#856404; padding:4px 12px; border-radius:20px; font-size:12px; display:inline-block;">
                ⚠️ Revision Required
              </span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    
    <!-- Creators List -->
    ${
      creatorsList && creatorsList.length > 0
        ? `
    <div style="margin-bottom:25px;" class="mobile-spacing">
      <p style="margin-bottom:15px; font-weight:600; color:#2c3e50;">
        👥 Assigned Creators:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
        <thead>
          <tr>
            <th style="background:#b5c4d4; color:white; padding:12px 15px; text-align:left; font-weight:600;">Creator Name</th>
            <th style="background:#b5c4d4; color:white; padding:12px 15px; text-align:left; font-weight:600;">Email</th>
          </tr>
        </thead>
        <tbody>
          ${creatorsList
            .map(
              (creator: any) => `
          <tr>
            <td style="padding:12px 15px; border-bottom:1px solid #eaeaea;">${creator.creatorUserId.fullName || 'N/A'}</td>
            <td style="padding:12px 15px; border-bottom:1px solid #eaeaea;">
              <a href="mailto:${creator.creatorUserId.email}" 
                 style="color:#3498db; text-decoration:none; word-break:break-all;">
                ${creator.creatorUserId.email || 'N/A'}
              </a>
            </td>
          </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
      <p style="margin-top:10px; font-size:12px; color:#666;">
        Total Creators Assigned: ${creatorsList.length}
      </p>
    </div>
    `
        : `
    <div style="margin-bottom:25px; background:#f8d7da; color:#721c24; padding:15px; border-radius:10px;" class="mobile-spacing">
      <p style="margin:0; font-weight:600;">
        ⚠️ No creators assigned to this project yet.
      </p>
    </div>
    `
    }

    
    <!-- Footer Message -->
    <div style="margin-top:30px; padding-top:20px; border-top:2px solid #d4c9b4;">
      <p style="margin-bottom:10px;">
        Please log into the admin dashboard to view complete project details and client feedback.
      </p>
    </div>
  </div>

  <p style="text-align:center; font-size:13px; color:#888; margin-top:40px;">
    This is an automated notification. Please log into the admin panel for more details.
  </p>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#fce8a4; padding:40px;" class="mobile-padding">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="left" class="mobile-stack mobile-center" style="vertical-align:top;">
        <div style="margin-bottom:20px;">
          <h3 style="font-size:16px; font-weight:700; margin-bottom:10px;">
            Need Assistance?
          </h3>

          <p style="margin-bottom:5px;">
            <a href="mailto:Shamimnader@thesocialchance.com"
               style="color:#000000; text-decoration:none; font-size:14px; word-break:break-all;">
              Shamimnader@thesocialchance.com
            </a>
          </p>

          <p style="margin-bottom:15px;">
            <a href="mailto:Fareshtanader@thesocialchance.com"
               style="color:#000000; text-decoration:none; font-size:14px; word-break:break-all;">
              Fareshtanader@thesocialchance.com
            </a>
          </p>

          <div style="margin-top:20px;" class="social-icons">
            <a href="https://facebook.com/thesocialchance" style="text-decoration:none; display:inline-block; margin-right:12px;">
              <img src="https://cdn-icons-png.flaticon.com/512/44/44386.png" width="20" height="20" alt="Facebook" style="display:block;">
            </a>
            <a href="https://tiktok.com/@thesocialchance" style="text-decoration:none; display:inline-block; margin-right:12px;">
              <img src="https://cdn-icons-png.flaticon.com/512/3046/3046126.png" width="20" height="20" alt="TikTok" style="display:block;">
            </a>
            <a href="https://instagram.com/thesocialchance" style="text-decoration:none; display:inline-block; margin-right:12px;">
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" height="20" alt="Instagram" style="display:block;">
            </a>
            <a href="https://twitter.com/thesocialchance" style="text-decoration:none; display:inline-block;">
              <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width="20" height="20" alt="Twitter" style="display:block;">
            </a>
          </div>
        </div>
      </td>
      
      <td align="right" width="100" class="mobile-stack mobile-center" style="vertical-align:bottom;">
        <div style="font-size:90px; opacity:0.7;" class="footer-emoji">
          📢
        </div>
      </td>
    </tr>
  </table>
</td>
</tr>

</tbody>
</table>
<!-- END CONTAINER -->

</td>
</tr>
</table>

</body>
</html>
`;
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
        <!-- Replace circular logo with image -->
        <div style="width:85px; height:85px; overflow:hidden; border-radius:50%;">
          <img src="https://thesocialchangebucket.s3.eu-central-1.amazonaws.com/UGC.png" 
               alt="The Social Chance Logo"
               width="85" 
               height="85"
               style="object-fit:cover; display:block;">
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



