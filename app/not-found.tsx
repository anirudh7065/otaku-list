'use client'
import Link from "next/link"
import { useEffect } from "react"
import { clientLog } from "@/lib/clientLogger"

export default function NotFound() {
      useEffect(() => {
          clientLog('error', '404 page not found')
      }, [])
  return (
    <main className='w-full h-[calc(100vh-80px)] flex flex-col justify-center items-center gap-5'>

      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m15 9-6 6" /><path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" /><path d="m9 9 6 6" /></svg>
      <h2 className='text-8xl text-purple-800 '>404</h2>
      <h2 className='text-4xl text-purple-300 '>Page Not Found</h2>
      <p className='md:text-4xl text-2xl text-purple-700 '>Could not find requested resource</p>
      <Link href="/" className='text-xl py-2 px-4 border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white rounded-2xl '>Return Home</Link>
    </main>
  )
}
