 import Image from "next/image"
import Profile from "./profile"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function IndexPage() {
  return (
    <div className="container border-0 overflow-y-auto">
      
     
      
      
        <Link href="/prompt" className="">
          <ArrowLeft />
        </Link>     
        <div className="">
        
          <Profile />
        </div>
    </div>
  )
}
