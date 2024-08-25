
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ExpertChat from "./chart"

export default function IndexPage() {
  return (
    <div className="container border-0 overflow-y-auto">
      
        <Link href="/home" className="">
          <ArrowLeft />
        </Link>     
        <div className="">
        
          <ExpertChat />
        </div>
    </div>
  )
}
