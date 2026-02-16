'use client'
import { useState, useEffect } from 'react'
import { Menu } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

const MobileNav = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <main className='md:hidden'>
      <Menu onClick={() => setOpen(!open)} />

      {open && (
        <nav
          className="fixed inset-0 z-50 w-80 bg-black flex flex-col items-start px-10 pt-12 gap-7 text-xl font-bold"
          onClick={() => setOpen(false)}
        >
          <div className='flex gap-3 justify-center items-center my-2'>
        <Image src={"/logo/logo-circle.svg"} width={40} height={40} alt="logo" className='size-12'/>
              <span className='flex flex-col text-3xl text-purple-800'>OTAKU LIST</span>
          </div>
          <Link href="/">Home</Link>
          <Link href="/season">Season</Link>
          <Link href="/genres">Genres</Link>
          <Link href="/top">Top</Link>
          <Link href="/schedules">Schedule</Link>
          <Link href="/mylist">My List</Link>
        </nav>
      )}
    </main>
  )
}

export default MobileNav
