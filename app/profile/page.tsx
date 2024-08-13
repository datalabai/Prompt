import Profile from "./profile"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function IndexPage() {
  return (
    <div className="container border-0 overflow-y-auto">
      
        <Link href="/home" className="">
          <ArrowLeft />
        </Link>     
        <div className="">
        
          <Profile />
        </div>
    </div>
  )
}
