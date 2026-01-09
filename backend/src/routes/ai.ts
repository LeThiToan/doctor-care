import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

// Initialize Gemini AI if API key is provided
const geminiApiKey = process.env.GEMINI_API_KEY
let genAI: GoogleGenerativeAI | null = null
let model: any = null

// Check if API key exists and is valid (not empty and not placeholder)
const isValidApiKey = geminiApiKey &&
    typeof geminiApiKey === 'string' &&
    geminiApiKey.trim() !== '' &&
    !geminiApiKey.trim().includes('your_gemini_api_key')

if (isValidApiKey) {
    try {
        genAI = new GoogleGenerativeAI(geminiApiKey)
        // Use gemini-2.0-flash (fast and available) or gemini-2.5-flash
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
        console.log('✅ Gemini AI initialized successfully with gemini-2.0-flash')
    } catch (error) {
        console.error('❌ Error initializing Gemini AI:', error)
        model = null
    }
} else {
    console.log('⚠️  GEMINI_API_KEY not found or invalid. AI chatbox requires Gemini API key to function.')
    model = null
}

// System prompt for MedBooking AI Assistant
const SYSTEM_PROMPT = `Bạn là trợ lý AI thông minh của MedBooking - hệ thống đặt lịch khám bệnh trực tuyến.

NHIỆM VỤ CỦA BẠN:
1. Hỗ trợ người dùng đặt lịch khám bệnh
2. Tư vấn chuyên khoa phù hợp dựa trên triệu chứng
3. Hướng dẫn sử dụng hệ thống MedBooking
4. Trả lời câu hỏi về dịch vụ y tế


THÔNG TIN VỀ MEDBOOKING:
- MedBooking là hệ thống đặt lịch khám bệnh trực tuyến
- Website chính thức: https://vermillion-kulfi-ea1332.netlify.app
- Có nhiều chuyên khoa: Nội khoa, Ngoại khoa, Nhi khoa, Sản phụ khoa, Tim mạch, Thần kinh, Da liễu, Mắt, Tai mũi họng, Răng hàm mặt
- Người dùng có thể đặt lịch, tìm bác sĩ, xem lịch hẹn của mình
- Không có chức năng thanh toán
- Để nhắn tin với bác sĩ, vào xem chi tiết bác sĩ và có nút nhắn tin 


THÔNG TIN LIÊN HỆ:
Khi người dùng hỏi về thông tin liên hệ, số điện thoại, Facebook, Zalo, hoặc cách liên hệ, bạn PHẢI trả lời với thông tin sau:
"Bạn có thể liên hệ chúng tôi qua:

Facebook: https://www.facebook.com/v.toan14/

Zalo/SĐT: 0385597210"

QUY TẮC:
- Luôn trả lời bằng tiếng Việt
- Thân thiện, chuyên nghiệp, dễ hiểu
- Khi người dùng mô tả triệu chứng, đề xuất chuyên khoa phù hợp
- Không chẩn đoán bệnh, chỉ tư vấn nên khám chuyên khoa nào
- Nếu triệu chứng nghiêm trọng, khuyên đến cấp cứu ngay
- Hướng dẫn cách đặt lịch trên website khi cần
- Khi được hỏi về liên hệ, Facebook, Zalo, số điện thoại, hotline → LUÔN trả lời với thông tin liên hệ ở trên
- Sử dụng emoji phù hợp để làm câu trả lời thân thiện hơn

Hãy trả lời câu hỏi của người dùng một cách hữu ích và chính xác.`

// Function to call Gemini API
async function getGeminiResponse(message: string, conversationHistory: any[]): Promise<string | null> {
    if (!model) {
        return null
    }

    try {
        // Build conversation history for context
        const history = conversationHistory.slice(-10)
        let fullPrompt = SYSTEM_PROMPT + '\n\n'

        // Add conversation history
        if (history.length > 0) {
            fullPrompt += 'Lịch sử hội thoại:\n'
            history.forEach((msg: any) => {
                fullPrompt += `${msg.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${msg.content}\n`
            })
            fullPrompt += '\n'
        }

        fullPrompt += `Người dùng: ${message}\nTrợ lý:`

        // Use generateContent directly instead of chat
        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()

        return text
    } catch (error: any) {
        // Log error without exposing sensitive information
        const errorInfo: any = {
            status: error.status,
            message: error.message ? error.message.substring(0, 200) : 'Unknown error'
        }

        // Only log safe error information (no API keys or sensitive data)
        console.error('Error calling Gemini API:', {
            status: errorInfo.status,
            message: errorInfo.message
        })

        // Handle specific error cases
        if (error.status === 429) {
            return 'Xin lỗi, tôi đã vượt quá giới hạn sử dụng API. Vui lòng thử lại sau một chút, hoặc kiểm tra quota và billing tại https://ai.dev/usage?tab=rate-limit'
        }

        // Handle leaked API key error (403 Forbidden)
        if (error.status === 403 && error.message && error.message.includes('leaked')) {
            return '⚠️ API key đã bị báo là rò rỉ (leaked). Vui lòng tạo API key mới tại https://aistudio.google.com/apikey và cập nhật GEMINI_API_KEY trong file .env của backend. Sau đó khởi động lại server.'
        }

        // Handle other 403 errors
        if (error.status === 403) {
            return '⚠️ API key không hợp lệ hoặc không có quyền truy cập. Vui lòng kiểm tra lại GEMINI_API_KEY trong file .env hoặc tạo API key mới tại https://aistudio.google.com/apikey'
        }

        return null
    }
}


router.post('/chat', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: "Vui lòng cung cấp tin nhắn hợp lệ"
            })
        }

        // Check if Gemini API is configured
        if (!model) {
            return res.status(503).json({
                success: false,
                error: "AI chatbox chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào file .env để sử dụng tính năng này."
            })
        }

        // Use Gemini AI
        const geminiResponse = await getGeminiResponse(message, conversationHistory || [])

        if (!geminiResponse) {
            return res.status(500).json({
                success: false,
                error: "Không thể kết nối với AI service. Vui lòng thử lại sau."
            })
        }

        // Check if response is an error message (quota exceeded, leaked API key, or other API errors)
        if (geminiResponse.includes('vượt quá giới hạn') ||
            geminiResponse.includes('quota') ||
            geminiResponse.includes('API key') ||
            geminiResponse.includes('⚠️')) {
            // Return as success but with error message in response so user can see it
            return res.status(200).json({
                success: true,
                response: geminiResponse
            })
        }

        res.json({
            success: true,
            response: geminiResponse
        })
    } catch (error) {
        console.error("Error processing AI chat:", error)
        res.status(500).json({
            success: false,
            error: "Đã có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại sau."
        })
    }
})

export default router
