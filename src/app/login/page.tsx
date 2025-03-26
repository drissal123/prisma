'use client'

import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
} 