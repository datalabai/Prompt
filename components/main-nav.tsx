"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/home" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="" />
        <span className="font-bold ">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  )
}
