const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('📧 Đang test gửi email...\n');
    
    // Kiểm tra cấu hình
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Lỗi: EMAIL_USER hoặc EMAIL_PASS chưa được cấu hình trong .env');
        console.log('\n💡 Hãy tạo file .env với:');
        console.log('EMAIL_HOST=smtp.gmail.com');
        console.log('EMAIL_PORT=587');
        console.log('EMAIL_USER=your-email@gmail.com');
        console.log('EMAIL_PASS=your-app-password');
        return;
    }

    console.log('✅ Đã tìm thấy cấu hình email:');
    console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || 'smtp.gmail.com'}`);
    console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || '587'}`);
    console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}\n`);

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Test kết nối
        console.log('🔍 Đang kiểm tra kết nối SMTP...');
        await transporter.verify();
        console.log('✅ Kết nối SMTP thành công!\n');

        // Gửi test email
        console.log('📤 Đang gửi email test...');
        const info = await transporter.sendMail({
            from: `"MedBooking Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Gửi cho chính mình để test
            subject: 'Test Email từ MedBooking',
            html: `
                <h2>Email test thành công! 🎉</h2>
                <p>Nếu bạn nhận được email này, có nghĩa là cấu hình email đã hoạt động.</p>
                <p>Email được gửi từ: ${process.env.EMAIL_USER}</p>
            `,
        });

        console.log('✅ Email đã được gửi thành công!');
        console.log(`   Message ID: ${info.messageId}`);
        console.log(`   Đã gửi đến: ${process.env.EMAIL_USER}`);
        console.log('\n📬 Vui lòng kiểm tra hộp thư (có thể trong thư mục spam)');

    } catch (error) {
        console.error('\n❌ Lỗi khi gửi email:');
        console.error(`   ${error.message}`);
        
        if (error.code === 'EAUTH') {
            console.error('\n💡 Lỗi xác thực:');
            console.error('   - Kiểm tra lại EMAIL_USER và EMAIL_PASS');
            console.error('   - Đối với Gmail, cần dùng App Password (không phải mật khẩu thông thường)');
        } else if (error.code === 'ECONNECTION') {
            console.error('\n💡 Lỗi kết nối:');
            console.error('   - Kiểm tra kết nối internet');
            console.error('   - Kiểm tra firewall có chặn port 587 không');
        }
    }
}

testEmail();

