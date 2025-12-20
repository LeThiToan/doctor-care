import nodemailer from 'nodemailer'

// Tạo transporter cho email
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ EMAIL_USER và EMAIL_PASS chưa được cấu hình trong .env')
        return null
    }

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })
}

// Gửi email xác nhận đặt lịch
export const sendAppointmentConfirmationEmail = async (
    patientEmail: string,
    patientName: string,
    doctorName: string,
    doctorTitle: string,
    specialty: string,
    appointmentDate: string,
    appointmentTime: string
) => {
    try {
        const transporter = createTransporter()
        if (!transporter) {
            console.error('❌ Không thể tạo email transporter - thiếu cấu hình email')
            return { success: false, error: 'Email chưa được cấu hình' }
        }

        const formattedDate = new Date(appointmentDate).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 10px;
                        padding: 30px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                        margin: -30px -30px 30px -30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px 0;
                    }
                    .info-box {
                        background-color: #f0fdf4;
                        border-left: 4px solid #10b981;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    .info-row {
                        display: flex;
                        padding: 10px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        font-weight: bold;
                        width: 150px;
                        color: #374151;
                    }
                    .info-value {
                        flex: 1;
                        color: #1f2937;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Xác nhận đặt lịch thành công</h1>
                    </div>
                    
                    <div class="content">
                        <p>Xin chào <strong>${patientName}</strong>,</p>
                        
                        <p>Cảm ơn bạn đã sử dụng dịch vụ đặt lịch khám của <strong>MedBooking</strong>. 
                        Chúng tôi xác nhận lịch hẹn của bạn đã được đặt thành công!</p>
                        
                        <div class="info-box">
                            <div class="info-row">
                                <div class="info-label">Bác sĩ:</div>
                                <div class="info-value">${doctorTitle} ${doctorName}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Chuyên khoa:</div>
                                <div class="info-value">${specialty}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Ngày khám:</div>
                                <div class="info-value">${formattedDate}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Giờ khám:</div>
                                <div class="info-value">${appointmentTime}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Trạng thái:</div>
                                <div class="info-value">
                                    <span style="background-color: #fef3c7; color: #92400e; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold;">Chờ xác nhận</span>
                                </div>
                            </div>
                        </div>
                        
                        <p><strong>Lưu ý quan trọng:</strong></p>
                        <ul>
                            <li>Vui lòng đến đúng giờ đã đặt</li>
                            <li>Mang theo CMND/CCCD khi đến khám</li>
                            <li>Nếu có thay đổi, vui lòng hủy lịch trước ít nhất 24 giờ</li>
                        </ul>
                    </div>
                    
                    <div class="footer">
                        <p>Trân trọng,<br>
                        <strong>Đội ngũ MedBooking</strong></p>
                    </div>
                </div>
            </body>
            </html>
        `

        const adminEmail = process.env.EMAIL_USER
        if (!adminEmail) {
            throw new Error('EMAIL_USER chưa được cấu hình')
        }

        const mailOptions = {
            from: `"MedBooking" <${adminEmail}>`,
            to: patientEmail,
            replyTo: adminEmail, // Email reply sẽ về admin
            subject: `✅ Xác nhận đặt lịch khám với ${doctorTitle} ${doctorName}`,
            html: htmlContent,
        }

        console.log(`📧 Đang gửi email từ ${adminEmail} đến ${patientEmail}...`)
        const info = await transporter.sendMail(mailOptions)
        console.log('✅ Email sent successfully!')
        console.log(`   From: ${adminEmail}`)
        console.log(`   To: ${patientEmail}`)
        console.log(`   Message ID: ${info.messageId}`)
        return { success: true, messageId: info.messageId }
    } catch (error: any) {
        console.error('❌ Error sending email:', error)
        return { success: false, error: error.message }
    }
}

export const sendPasswordResetEmail = async (
    recipientEmail: string,
    recipientName: string,
    newPassword: string
) => {
    try {
        console.log(`📧 Bắt đầu gửi email reset password đến ${recipientEmail}...`)
        
        const transporter = createTransporter()
        if (!transporter) {
            console.error('❌ Không thể tạo email transporter - thiếu cấu hình email')
            console.error('   Kiểm tra EMAIL_USER và EMAIL_PASS trong file .env')
            return { success: false, error: 'Email chưa được cấu hình. Vui lòng kiểm tra EMAIL_USER và EMAIL_PASS trong file .env' }
        }

        const adminEmail = process.env.EMAIL_USER
        if (!adminEmail) {
            console.error('❌ EMAIL_USER chưa được cấu hình trong .env')
            throw new Error('EMAIL_USER chưa được cấu hình')
        }

        console.log(`   From: ${adminEmail}`)
        console.log(`   To: ${recipientEmail}`)
        console.log(`   Host: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`)
        console.log(`   Port: ${process.env.EMAIL_PORT || '587'}`)

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8" />
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #111827; }
                    .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1); overflow: hidden; }
                    .header { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: #ffffff; padding: 24px 32px; }
                    .header h1 { margin: 0; font-size: 22px; }
                    .content { padding: 24px 32px; line-height: 1.6; }
                    .password-box { margin: 24px 0; padding: 18px 24px; background: #f1f5f9; border-radius: 8px; font-size: 18px; letter-spacing: 2px; font-weight: 600; color: #1d4ed8; text-align: center; border: 1px dashed #2563eb; }
                    .note { margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 10px; border-left: 4px solid #2563eb; font-size: 14px; color: #1e3a8a; }
                    .footer { padding: 16px 32px 24px; background: #f3f4f6; font-size: 13px; color: #6b7280; text-align: center; }
                    a { color: #2563eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Yêu cầu đặt lại mật khẩu</h1>
                    </div>
                    <div class="content">
                        <p>Xin chào <strong>${recipientName || recipientEmail}</strong>,</p>
                        <p>Chúng tôi đã tạo mật khẩu mới cho tài khoản MedBooking của bạn theo yêu cầu quên mật khẩu. Vui lòng sử dụng mật khẩu bên dưới để đăng nhập và đổi lại mật khẩu khi thuận tiện.</p>
                        <div class="password-box">
                            ${newPassword}
                        </div>
                        <div class="note">
                            Nếu bạn không yêu cầu đặt lại mật khẩu, hãy liên hệ ngay với bộ phận hỗ trợ của MedBooking để được giúp đỡ.
                        </div>
                    </div>
                    <div class="footer">
                        Trân trọng,<br />
                        Đội ngũ MedBooking
                    </div>
                </div>
            </body>
            </html>
        `

        const mailOptions = {
            from: `"MedBooking" <${adminEmail}>`,
            to: recipientEmail,
            replyTo: adminEmail,
            subject: '🔑 Mật khẩu mới cho tài khoản MedBooking',
            html: htmlContent,
        }

        console.log('   Đang gửi email...')
        const info = await transporter.sendMail(mailOptions)
        console.log('✅ Email reset password sent successfully!')
        console.log(`   Message ID: ${info.messageId}`)
        console.log(`   Response: ${info.response}`)
        return { success: true, messageId: info.messageId }
    } catch (error: any) {
        console.error('❌ Error sending reset password email:')
        console.error('   Error message:', error.message)
        console.error('   Error code:', error.code)
        if (error.response) {
            console.error('   SMTP Response:', error.response)
        }
        if (error.responseCode) {
            console.error('   Response Code:', error.responseCode)
        }
        return { success: false, error: error.message || 'Không thể gửi email. Vui lòng kiểm tra cấu hình email.' }
    }
}

// Gửi email thông báo hủy lịch hẹn
export const sendAppointmentCancellationEmail = async (
    patientEmail: string,
    patientName: string,
    doctorName: string,
    doctorTitle: string,
    specialty: string,
    appointmentDate: string,
    appointmentTime: string,
    cancelReason?: string | null
) => {
    try {
        const transporter = createTransporter()
        if (!transporter) {
            console.error('❌ Không thể tạo email transporter - thiếu cấu hình email')
            return { success: false, error: 'Email chưa được cấu hình' }
        }

        const formattedDate = new Date(appointmentDate).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 10px;
                        padding: 30px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                        color: white;
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                        margin: -30px -30px 30px -30px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px 0;
                    }
                    .info-box {
                        background-color: #fef2f2;
                        border-left: 4px solid #ef4444;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    .info-row {
                        display: flex;
                        padding: 10px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        font-weight: bold;
                        width: 150px;
                        color: #374151;
                    }
                    .info-value {
                        flex: 1;
                        color: #1f2937;
                    }
                    .warning-box {
                        background-color: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>❌ Thông báo hủy lịch hẹn</h1>
                    </div>
                    
                    <div class="content">
                        <p>Xin chào <strong>${patientName}</strong>,</p>
                        
                        <p>Chúng tôi rất tiếc phải thông báo rằng lịch hẹn khám của bạn đã bị hủy bởi bác sĩ.</p>
                        
                        <div class="info-box">
                            <div class="info-row">
                                <div class="info-label">Bác sĩ:</div>
                                <div class="info-value">${doctorTitle} ${doctorName}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Chuyên khoa:</div>
                                <div class="info-value">${specialty}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Ngày khám:</div>
                                <div class="info-value">${formattedDate}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Giờ khám:</div>
                                <div class="info-value">${appointmentTime}</div>
                            </div>
                            <div class="info-row">
                                <div class="info-label">Trạng thái:</div>
                                <div class="info-value">
                                    <span style="background-color: #fee2e2; color: #991b1b; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold;">Đã hủy</span>
                                </div>
                            </div>
                        </div>
                        
                        ${cancelReason ? `
                        <div class="info-box" style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9;">
                            <p style="margin: 0 0 10px 0; font-weight: bold; color: #0c4a6e;">Lý do hủy lịch:</p>
                            <p style="margin: 0; color: #075985;">${cancelReason}</p>
                        </div>
                        ` : ''}
                        
                        <div class="warning-box">
                            <p><strong>Lưu ý:</strong></p>
                            <ul>
                                <li>Lịch hẹn này đã bị hủy và không còn hiệu lực</li>
                                <li>Nếu bạn vẫn muốn khám với bác sĩ này, vui lòng đặt lịch hẹn mới</li>
                                <li>Nếu có thắc mắc, vui lòng liên hệ với chúng tôi qua form liên hệ trên website</li>
                            </ul>
                        </div>
                        
                        <p>Chúng tôi xin lỗi vì sự bất tiện này và mong được phục vụ bạn trong tương lai.</p>
                    </div>
                    
                    <div class="footer">
                        <p>Trân trọng,<br>
                        <strong>Đội ngũ MedBooking</strong></p>
                    </div>
                </div>
            </body>
            </html>
        `

        const adminEmail = process.env.EMAIL_USER
        if (!adminEmail) {
            throw new Error('EMAIL_USER chưa được cấu hình')
        }

        const mailOptions = {
            from: `"MedBooking" <${adminEmail}>`,
            to: patientEmail,
            replyTo: adminEmail,
            subject: `❌ Thông báo hủy lịch hẹn với ${doctorTitle} ${doctorName}`,
            html: htmlContent,
        }

        console.log(`📧 Đang gửi email hủy lịch từ ${adminEmail} đến ${patientEmail}...`)
        const info = await transporter.sendMail(mailOptions)
        console.log('✅ Cancellation email sent successfully!')
        console.log(`   From: ${adminEmail}`)
        console.log(`   To: ${patientEmail}`)
        console.log(`   Message ID: ${info.messageId}`)
        return { success: true, messageId: info.messageId }
    } catch (error: any) {
        console.error('❌ Error sending cancellation email:', error)
        return { success: false, error: error.message }
    }
}

