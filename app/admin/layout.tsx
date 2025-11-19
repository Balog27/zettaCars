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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Simple admin check - for now just check if user email is yours
  useEffect(() => {
    if (isLoaded && isMounted) {
      console.log("=== ADMIN DEBUG START ===")
      console.log("isLoaded:", isLoaded)
      console.log("isMounted:", isMounted)  
      console.log("Clerk user:", user)
      console.log("User email:", user?.emailAddresses?.[0]?.emailAddress)
      // Debug public env var values (client-side)
      try {
        console.log('client: NEXT_PUBLIC_ADMIN_EMAILS raw =', process.env.NEXT_PUBLIC_ADMIN_EMAILS)
      } catch (e) {
        console.log('client: cannot read process.env.NEXT_PUBLIC_ADMIN_EMAILS', e)
      }
      console.log("=== ADMIN DEBUG END ===")

      // If no user, redirect
      if (!user) {
        console.log("No user signed in, redirecting...")
        router.push("/")
        return
      }

      // Simple email check for admin (temporary)
      // Prefer using NEXT_PUBLIC_ADMIN_EMAILS so the client list can be configured per deploy.
      const userEmail = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
      const envAdminEmails = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_EMAILS
        ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
        : []

      // Log what the client computed for easier debugging in production
      console.log('client: envAdminEmails =', envAdminEmails)

      // Fallback to a small local/dev list so local dev still works without env vars
      // Keep this fallback list in sync with the server-side middleware defaults.
      const fallbackAdminEmails = [
        "david.balogg27@gmail.com",
        "contact@zettacarrental.com",
        "ancaturcu04@gmail.com",
        "david27balogg@yahoo.com",
      ]
      const adminEmails = envAdminEmails.length > 0 ? envAdminEmails : fallbackAdminEmails

      if (!userEmail || !adminEmails.includes(userEmail)) {
        console.log(`User email "${userEmail}" is not in admin list, redirecting...`)
        router.push("/")
        return
      }

      console.log("✅ Admin access granted based on email!")
    }
  }, [isLoaded, isMounted, user, router])

  // Show loading while checking authentication
  if (!isLoaded || !isMounted) {
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