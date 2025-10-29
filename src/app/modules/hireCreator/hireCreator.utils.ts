

export const getDeliveryEmailTemplate = (creatorName: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4CAF50; margin: 0; font-size: 28px;">🎉 Task Successfully Delivered!</h1>
          <div style="height: 3px; background: linear-gradient(90deg, #4CAF50, #45a049); margin: 10px auto; width: 100px;"></div>
        </div>
        
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #333; margin-bottom: 15px;">Hello ${creatorName},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We're excited to inform you that your task has been successfully delivered to the client!
          </p>
        </div>
        
        <!-- Main Content -->
        <div style="background-color: #f8fff8; border-left: 4px solid #4CAF50; padding: 20px; margin: 25px 0; border-radius: 4px;">
          <h3 style="color: #2E7D32; margin-top: 0;">Delivery Confirmed ✅</h3>
          <p style="color: #555; margin: 10px 0; line-height: 1.6;">
            Your hard work has been officially submitted and accepted. The client has reviewed and approved the delivery. You contact to admin and take to payment!.
          </p>
        </div>

        <!-- Appreciation -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px;">
          <p style="color: white; font-size: 18px; margin: 0; font-weight: bold;">
            Thank you for your excellent work and dedication!
          </p>
        </div>
        
        <!-- Contact Support -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 14px;">
            If you have any questions, please contact our support team.
          </p>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">
            Best regards,<br>
            <strong>The Team</strong>
          </p>
        </div>
      </div>
    </div>
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

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2196F3; margin: 0; font-size: 28px;">📊 Project Delivery Report</h1>
          <div style="height: 3px; background: linear-gradient(90deg, #2196F3, #1976D2); margin: 10px auto; width: 120px;"></div>
          <p style="color: #666; margin: 10px 0;">Date: ${currentDate}</p>
        </div>
        
        <!-- Project Summary -->
        <div style="margin-bottom: 25px;">
          <h2 style="color: #333; margin-bottom: 15px;">Project Summary</h2>
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; border-left: 4px solid #2196F3;">
            <p style="margin: 5px 0; color: #555;">
              <strong>Project ID:</strong> ${hireCreatorDetails._id || 'N/A'}
            </p>
            <p style="margin: 5px 0; color: #555;">
              <strong>Status:</strong> <span style="color: #4CAF50; font-weight: bold;">Delivered ✅</span>
            </p>
            <p style="margin: 5px 0; color: #555;">
              <strong>Total Creators:</strong> ${creators.length}
            </p>
          </div>
        </div>
        
        <!-- Creators List -->
        <div style="margin: 25px 0;">
          <h2 style="color: #333; margin-bottom: 15px;">🎯 Creators Involved</h2>
          <div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <th style="padding: 12px 15px; text-align: left; color: white; border-bottom: 1px solid #e0e0e0;">#</th>
                  <th style="padding: 12px 15px; text-align: left; color: white; border-bottom: 1px solid #e0e0e0;">Creator Name</th>
                  <th style="padding: 12px 15px; text-align: left; color: white; border-bottom: 1px solid #e0e0e0;">Email</th>
                  <th style="padding: 12px 15px; text-align: left; color: white; border-bottom: 1px solid #e0e0e0;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${creators
                  .map(
                    (creator, index) => `
                  <tr style="${index % 2 === 0 ? 'background-color: #f9f9f9;' : 'background-color: white;'}">
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #666;">${index + 1}</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #333; font-weight: 500;">${creator.creatorUserId.fullName || 'N/A'}</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0; color: #2196F3;">${creator.creatorUserId.email || 'N/A'}</td>
                    <td style="padding: 12px 15px; border-bottom: 1px solid #e0e0e0;">
                      <span style="color: #4CAF50; font-weight: bold;">Delivered ✅</span>
                    </td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 14px;">
            This is an automated delivery report generated by the system.
          </p>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">
            Best regards,<br>
            <strong>Project Management System</strong>
          </p>
        </div>
      </div>
    </div>
  `;
};