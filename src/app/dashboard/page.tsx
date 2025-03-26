"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"

interface User {
  id: number
  email: string
  name: string | null
  role: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Log session state before fetch
      console.log("Current session state:", {
        status,
        session,
        isAuthenticated: status === "authenticated",
      })

      const response = await fetch("/api/users", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(
        error instanceof Error 
          ? error.message 
          : "Failed to load users. Please try again later."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchUsers()
    } else if (status !== "loading") {
      setLoading(false)
    }
  }, [status, session])

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <main className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            <span>Checking authentication...</span>
          </CardContent>
        </Card>
      </main>
    )
  }

  // Show loading state while fetching users
  if (loading && status === "authenticated") {
    return (
      <main className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6 flex items-center justify-center">
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            <span>Loading users...</span>
          </CardContent>
        </Card>
      </main>
    )
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login")
    return (
      <main className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6">
            <Alert>
              <AlertTitle>Not Authenticated</AlertTitle>
              <AlertDescription>
                Please log in to access this page. Redirecting to login...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    )
  }

  // Show access denied for non-admin users
  if (session?.user?.role !== "ADMIN") {
    return (
      <main className="container mx-auto py-10">
        <Card>
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You do not have permission to access this page. Please contact an administrator if you believe this is a mistake.
                <div className="mt-2 text-sm text-muted-foreground">
                  Current role: {session?.user?.role || "No role assigned"}
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Logged in as: {session.user.email}
            </div>
            <Button
              onClick={fetchUsers}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex flex-col gap-2">
                <p>{error}</p>
                <Button
                  onClick={fetchUsers}
                  variant="outline"
                  size="sm"
                  className="w-fit"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name || "-"}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  )
} 