/**
 * Script migration để hash các password hiện có trong bảng doctor_account
 * 
 * Chạy script này một lần để chuyển đổi tất cả password từ plain text sang hash
 * 
 * Cách chạy:
 *   npx ts-node scripts/migrate-doctor-passwords.ts
 * 
 * Hoặc sau khi build:
 *   node dist/scripts/migrate-doctor-passwords.js
 */

import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { query } from '../src/config/database'

dotenv.config()

async function migrateDoctorPasswords() {
    try {
        console.log('🔍 Đang kiểm tra các password cần hash...')

        // Lấy tất cả các doctor accounts
        const accounts = await query(
            'SELECT id, email, password FROM doctor_account',
            []
        ) as any[]

        if (accounts.length === 0) {
            console.log('✅ Không có doctor account nào trong database')
            return
        }

        console.log(`📊 Tìm thấy ${accounts.length} doctor account(s)`)

        let hashedCount = 0
        let skippedCount = 0

        for (const account of accounts) {
            const password = account.password

            // Kiểm tra xem password đã được hash chưa
            // bcrypt hash thường bắt đầu với $2a$, $2b$, hoặc $2y$ và có độ dài 60 ký tự
            const isAlreadyHashed = password && 
                password.startsWith('$2') && 
                password.length >= 60

            if (isAlreadyHashed) {
                console.log(`⏭️  Account ${account.email} đã được hash, bỏ qua`)
                skippedCount++
                continue
            }

            // Hash password mới
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password || 'defaultpassword', saltRounds)

            // Cập nhật password đã hash
            await query(
                'UPDATE doctor_account SET password = ? WHERE id = ?',
                [passwordHash, account.id]
            )

            console.log(`✅ Đã hash password cho account: ${account.email}`)
            hashedCount++
        }

        console.log('\n📈 Kết quả migration:')
        console.log(`   - Đã hash: ${hashedCount} account(s)`)
        console.log(`   - Đã bỏ qua: ${skippedCount} account(s)`)
        console.log(`   - Tổng cộng: ${accounts.length} account(s)`)
        console.log('\n✅ Migration hoàn tất!')

    } catch (error) {
        console.error('❌ Lỗi khi migration:', error)
        process.exit(1)
    } finally {
        // Đóng connection pool
        process.exit(0)
    }
}

// Chạy migration
migrateDoctorPasswords()



