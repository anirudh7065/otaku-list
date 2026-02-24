'use client'
import { useState, useEffect } from 'react'
import { Menu } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { Search } from "lucide-react";
import { useSearchToggle } from '@/context/SearchToggleContext';



const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const { searchToggle, setSearchToggle } = useSearchToggle();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <main className='lg:hidden flex gap-2'>
      {!searchToggle && <Search className="size-6 cursor-pointer lg:hidden" onClick={() => setSearchToggle(v => !v)} />}
      <Menu className="size-6 cursor-pointer lg:hidden" onClick={() => setOpen(!open)} />

      {open && (
        <nav
          className="fixed lg:hidden inset-0 z-50 w-80 bg-black flex flex-col items-start px-10 pt-12 gap-7 text-xl font-bold"
          onClick={() => setOpen(false)}
        >
          <Link href="/">
            <div className='flex gap-3 justify-center items-center my-2'>
              <Image src={"/logo/logo-circle.png"} width={10} height={10} alt="logo" className='size-12' />
              <span className='flex flex-col text-3xl text-purple-800'>OTAKU LIST</span>
            </div>
          </Link>
          <Link href="/">Home</Link>
          <Link href="/season">Season</Link>
          <Link href="/genres">Genres</Link>
          <Link href="/schedules">Schedule</Link>
          <Link href="/mylist">My List</Link>
        </nav>
      )}
    </main>
  )
}

export default MobileNav
