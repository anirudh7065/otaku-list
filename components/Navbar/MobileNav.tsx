'use client'
import { useState, useEffect } from 'react'
import { Menu } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import { Search } from "lucide-react";
import { useSearchToggle } from '@/context/SearchToggleContext';
import { useTitleLanguageToggle } from '@/context/TitleLanguageContext'



const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const { searchToggle, setSearchToggle } = useSearchToggle();
  const { titleLanguageJP, setTitleLanguageJP } = useTitleLanguageToggle();

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
        <div className='fixed inset-0 z-60 bg-black w-80 h-screen flex flex-col'>

          <div className='flex w-full px-4 bg-black items-center justify-end'>
            <span onClick={() => setOpen(!open)} className=' cursor-pointer rotate-45 text-4xl '>+</span>
          </div>
          <nav
            className=" lg:hidden w-full flex flex-col items-start px-10 gap-7 text-xl font-bold "
            onClick={() => setOpen(false)}
          >
            <Link href="/">
              <div className='flex gap-3 justify-center items-center my-2'>
                <Image src={"/logo/logo-circle.png"} width={6} height={6} alt="logo" className='size-12' />
                <span className='flex flex-col text-2xl text-primary-dark'>OTAKU LIST</span>
              </div>
            </Link>
            <Link href="/">Home</Link>
            <Link href="/season">Season</Link>
            <Link href="/genres">Genres</Link>
            <Link href="/schedules">Schedule</Link>
            <Link href="/mylist">My List</Link>
          </nav>

          <div className="flex items-center justify-center h-7 rounded-2xl bg-zinc-800 overflow-hidden w-18 absolute right-10 bottom-10 ">
            <span className={`${!titleLanguageJP && "bg-primary-hover text-black"} h-full place-content-center px-2 font-extrabold`} onClick={() => {
              setTitleLanguageJP(false)
              setOpen(false)
            }}>EN</span>
            <span className={`${titleLanguageJP && "bg-primary-hover text-black"} h-full place-content-center px-2 font-extrabold`} onClick={() => {
              setTitleLanguageJP(true)
              setOpen(false)
            }}>JP</span>
          </div>

        </div>
      )}
    </main>
  )
}

export default MobileNav
