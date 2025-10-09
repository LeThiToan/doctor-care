import { NextResponse } from "next/server"

export async function POST() {
    try {
        // Với JWT stateless: logout chỉ là để client xoá token.
        // Nếu bạn muốn, có thể trả về token rỗng hoặc success message.
        return NextResponse.json({ message: "Logout successful" })
    } catch (err: any) {
        console.error("Logout error:", err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
