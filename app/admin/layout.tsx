"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import React, { useEffect, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  // Query Convex for the user's DB profile (contains the authoritative `role`)
  const dbUser = useQuery(api.users.get)
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Simple admin check - prefer authoritative DB role check (convex users.role)
  useEffect(() => {
    if (isLoaded && isMounted) {
      // If no Clerk user, redirect immediately
      if (!user) {
        router.push("/")
        return
      }

      // Wait for Convex query to resolve. `dbUser === undefined` means still loading.
      // The top-level render already shows a loading state while dbUser === undefined.
      if (dbUser === null) {
        // No db user found - ensureUser should normally create one, but treat as non-admin for safety
        router.push("/")
        return
      }

      // If the DB user exists, check the authoritative role field
      if (dbUser && dbUser.role !== "admin") {
        router.push("/")
        return
      }
    }
  }, [isLoaded, isMounted, user, router])

  // Show loading while checking authentication and while Convex query is unresolved
  if (!isLoaded || !isMounted || dbUser === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // If no user is signed in
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Redirecting...</div>
      </div>
    )
  }

  const breadcrumbItems = pathname.split("/").filter(Boolean).map((item, index, array) => {
    const href = "/" + array.slice(0, index + 1).join("/")
    return {
      href,
      label: item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, " "),
    }
  })    

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.href}>
                    <BreadcrumbItem>
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}