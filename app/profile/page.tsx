 import Image from "next/image"
import Profile from "./profile"
import Link from "next/link"
import { House } from "lucide-react"

export default function IndexPage() {
  return (
    <div className="container relative">
      
     
      {/* <section className="overflow-hidden rounded-lg border bg-background shadow-md md:hidden md:shadow-xl">
        <Image
          src="/mobileview.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/mobileview.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </section> */}
      <section>
        <div className="flex overflow-hidden rounded-lg border bg-background shadow">
        <Link href="/" className="p-4 ">
          <House />
        </Link>     
          <Profile />
        </div>
      </section>
    </div>
  )
}
