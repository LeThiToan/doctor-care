"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/app/hooks/useAdminAuth"
import { adminApi } from "@/lib/admin-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table"
import { Users2 } from "lucide-react"

interface Patient {
  id: number
  name: string
  email: string
  created_at: string
}

export default function AdminPatientsPage() {
  const router = useRouter()
  const { isLoggedIn, loading } = useAdminAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/admin/login")
      } else {
        fetchPatients()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isLoggedIn])

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("admin_token")
      if (!token) {
        throw new Error("Không tìm thấy token admin")
      }

      const patientsData = await adminApi.getPatients(token)
      setPatients(patientsData || [])
    } catch (error) {
      console.error("Failed to fetch patients:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (value: string) => {
    if (!value) return "-"
    try {
      return new Date(value).toLocaleDateString("vi-VN")
    } catch {
      return value
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Quản lý Bệnh nhân</h2>
        <p className="text-slate-400">Xem danh sách tất cả bệnh nhân đã đăng ký</p>
      </div>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Users2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-white">Danh sách Bệnh nhân</CardTitle>
              <CardDescription className="text-slate-400">
                Tổng số: {patients.length} bệnh nhân
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-400">Đang tải danh sách bệnh nhân...</div>
          ) : patients.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">Chưa có bệnh nhân nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 bg-slate-900/70">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Tên</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">Ngày tham gia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className="border-slate-800">
                      <TableCell className="font-medium text-white">{patient.id}</TableCell>
                      <TableCell className="font-medium text-white">{patient.name}</TableCell>
                      <TableCell className="text-slate-300">{patient.email}</TableCell>
                      <TableCell className="text-slate-300">{formatDate(patient.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="text-slate-500">
                  Hiển thị tối đa 200 bệnh nhân gần nhất
                </TableCaption>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

