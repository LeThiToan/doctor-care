# Giải thích Code Chức năng: Đặt lịch & Chat với Bác sĩ

Tài liệu này giải thích chi tiết cách viết API ở Backend và cách gọi API ở Frontend cho 2 chức năng chính: **Đặt lịch khám (Booking)** và **Chat với Bác sĩ (Real-time Chat)**.

---

## 1. Chức năng Đặt lịch khám (Booking)

### 1.1. Backend (API Creation)
**File chính:** `backend/src/routes/appointments.ts`

Backend sử dụng **Express Router** để định nghĩa các endpoints. Dưới đây là logic chính của API tạo lịch hẹn:

```typescript
// Định nghĩa router
const router = Router();

// Endpoint: POST /api/appointments
router.post('/', async (req, res) => {
    try {
        // 1. Nhận dữ liệu từ Frontend gửi lên trong req.body
        const {
            user_id, patient_name, doctor_id, 
            appointment_date, appointment_time, ... 
        } = req.body;

        // 2. Validate dữ liệu (Kiểm tra thiếu trường bắt buộc)
        if (!patient_name || !doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // 3. Thực thi câu lệnh SQL INSERT vào database
        await query(
            `INSERT INTO appointments (...) VALUES (?, ..., 'pending')`,
            [user_id, patient_name, doctor_id, ...]
        );

        // 4. Trả về phản hồi thành công (HTTP 201)
        res.status(201).json({ message: "Đặt lịch thành công" });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});
```

### 1.2. Frontend (API Consumption)
**File Service:** `frontend/lib/api.ts`
Frontend không gọi trực tiếp URL trong component mà qua lớp service trung gian để tái sử dụng.

```typescript
// frontend/lib/api.ts
export const api = {
  // Hàm wrapper gọi API tạo lịch hẹn
  createAppointment: async (appointmentData: any) => {
    // Sử dụng fetch chuẩn của JS
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST', // Chỉ định phương thức POST
      headers: {
        'Content-Type': 'application/json', // Báo cho server biết body là JSON
      },
      body: JSON.stringify(appointmentData), // Chuyển object JS thành chuỗi JSON
    })
    return response.json();
  },
  //...
}
```

**File UI (Sử dụng):** `frontend/components/booking-steps/confirmation-step.tsx` (được gọi từ `booking-wizard.tsx`)

```typescript
// Khi người dùng bấm nút "Xác nhận đặt lịch"
const handleConfirm = async () => {
    try {
        // Gọi hàm từ service api
        await api.createAppointment(finalBookingData);
        // Nếu thành công -> Chuyển hướng hoặc hiện thông báo
        router.push('/booking/success');
    } catch (error) {
        alert("Có lỗi xảy ra");
    }
}
```

---

## 2. Chức năng Chat với Bác sĩ (Real-time)

Chức năng này phức tạp hơn vì kết hợp cả **REST API** (để lấy lịch sử tin nhắn) và **Socket.io** (để nhắn tin tức thời).

### 2.1. Backend (API & Socket)
**File API:** `backend/src/routes/chat.ts`

```typescript
// Endpoint: GET /api/chat/rooms/:roomId/messages
// Lấy lịch sử tin nhắn của một phòng chat
router.get('/rooms/:roomId/messages', verifyToken, async (req, res) => {
    const { roomId } = req.params;
    
    // Query Database lấy tin nhắn cũ
    const messages = await query(
        `SELECT * FROM messages WHERE chat_room_id = ? ORDER BY created_at ASC`,
        [roomId]
    );
    
    res.json(messages);
});
```

**Socket.io Event:** (Thường nằm trong `index.ts` hoặc file socket handler riêng)
Ngoài API, Backend lắng nghe sự kiện socket:
*   `socket.on('join_room', roomId)`: Cho user tham gia phòng chat.
*   `socket.on('send_message', data)`: Nhận tin nhắn mới -> Lưu vào DB -> Phát lại (`emit`) cho người kia trong phòng.

### 2.2. Frontend (Socket & API)
**File Service:** `frontend/lib/chat-api.ts`

```typescript
export const chatApi = new ChatAPI();
// Hàm lấy lịch sử tin nhắn
// Gọi GET /api/chat/rooms/{id}/messages
async getMessages(roomId: number) {
    return this.request(`/chat/rooms/${roomId}/messages`);
}
```

**File UI (Chat Window):** `frontend/components/chat/chat-window.tsx`
Component này sử dụng 2 cơ chế song song:

1.  **Lấy lịch sử tin nhắn (REST API):**
    ```typescript
    // Dùng useEffect để lấy tin cũ khi mở cửa sổ chat
    useEffect(() => {
        const loadMessages = async () => {
            const history = await chatApi.getMessages(roomId);
            setMessages(history); // Hiển thị tin cũ
        };
        loadMessages();
    }, [roomId]);
    ```

2.  **Nhắn tin tức thời (Socket.io Hook):**
    ```typescript
    // Sử dụng hook useSocket để kết nối
    const { socket } = useSocket();

    // Lắng nghe tin nhắn mới đến
    useEffect(() => {
        socket.on('new_message', (msg) => {
            // Cập nhật state để hiện tin nhắn mới ngay lập tức
            setMessages(prev => [...prev, msg]); 
        });
    }, [socket]);

    // Gửi tin nhắn
    const handleSendMessage = () => {
        socket.emit('send_message', {
            roomId,
            message: newMessage
        });
        // Không cần gọi API POST, socket server sẽ tự lưu vào DB
    };
    ```

---

## Tóm tắt Mô hình

1.  **Mô hình API (Booking):**
    *   **Client** gửi Request (POST/GET) -> **Server** xử lý Logic & DB -> Trả về Response JSON.
    *   Đây là mô hình **Request-Response** truyền thống, phù hợp cho các tác vụ như đặt lịch, xem danh sách.

2.  **Mô hình Socket (Chat):**
    *   **Client A** gửi Event (qua Socket) -> **Server** -> Phát Event tới **Client B**.
    *   Đây là mô hình **Event-driven**, giúp tin nhắn hiển thị ngay lập tức mà không cần F5 (Real-time).
    *   Tuy nhiên, vẫn dùng API truyền thống để tải lại lịch sử tin nhắn cũ.
