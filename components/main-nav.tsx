"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { RiSparkling2Line } from "react-icons/ri"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/home" className="mr-6 flex items-center space-x-2">
        {/* <Icons.logo className="" /> */}
        {/* <RiSparkling2Line className="h-8 w-8 ml-6 text-blue-500"/> */}
        <img src="./PromptCircle.png " className="h-9 w-9 ml-6"/>
        <span className="font-bold ml-0">
          {siteConfig.name}
        </span>
      </Link>
    </div>
  )
}
