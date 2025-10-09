
"use client"
import { useEffect, useState } from "react"


export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        setIsLoggedIn(!!token)
    }, [])

    return { isLoggedIn }
}
