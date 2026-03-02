'use client';
import Link from "next/link";
import { useEffect } from "react";
import { clientLog } from "@/lib/clientLogger";

export default function Error({
    error,
}: {
    error: Error;
    }) {
    
    useEffect(() => {
        clientLog('error', error.message)
    }, [error])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-6xl text-purple-700 text-center">Something went wrong!</h2>
            <p className="text-2xl text-purple-300">{error.message.slice(7) }</p>
            <p className="text-2xl text-purple-300">500</p>

            <Link
                href="/"
                className="px-4 py-2 border-2 border-purple-500 text-xl text-white rounded-3xl"
            >
                Back to Home
            </Link>
        </div>
    );
}
