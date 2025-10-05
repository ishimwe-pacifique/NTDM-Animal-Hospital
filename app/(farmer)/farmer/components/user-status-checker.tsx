"use client"

import { useUserStatus } from "@/hooks/useUserStatus"

export default function UserStatusChecker() {
  const statusModal = useUserStatus()
  return statusModal
}