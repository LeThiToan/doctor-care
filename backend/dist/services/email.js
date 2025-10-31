"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAppointmentConfirmationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Tạo transporter cho email
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ EMAIL_USER và EMAIL_PASS chưa được cấu hình trong .env');
        return null;
    }
    return nodemailer_1.default.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};
// Gửi email xác nhận đặt lịch
const sendAppointmentConfirmationEmail = async (patientEmail, patientName, doctorName, doctorTitle, specialty, appointmentDate, appointmentTime) => {
    try {
        const transporter = createTransporter();
        if (!transporter) {
            console.error('❌ Không thể tạo email transporter - thiếu cấu hình email');
            return { success: false, error: 'Email chưa được cấu hình' };
        }
        const formattedDate = new Date(appointmentDate).toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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
        `;
        const adminEmail = process.env.EMAIL_USER;
        if (!adminEmail) {
            throw new Error('EMAIL_USER chưa được cấu hình');
        }
        const mailOptions = {
            from: `"MedBooking" <${adminEmail}>`,
            to: patientEmail,
            replyTo: adminEmail, // Email reply sẽ về admin
            subject: `✅ Xác nhận đặt lịch khám với ${doctorTitle} ${doctorName}`,
            html: htmlContent,
        };
        console.log(`📧 Đang gửi email từ ${adminEmail} đến ${patientEmail}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log(`   From: ${adminEmail}`);
        console.log(`   To: ${patientEmail}`);
        console.log(`   Message ID: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: error.message };
    }
};
exports.sendAppointmentConfirmationEmail = sendAppointmentConfirmationEmail;
//# sourceMappingURL=email.js.map