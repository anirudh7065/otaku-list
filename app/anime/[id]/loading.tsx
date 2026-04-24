export default function Skeleton() {
    return (
        <main className="min-h-screen py-10">
            {/* Title */}
            <div className="title w-full flex items-center px-18">
                <div className="size-12 max-md:hidden rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                <div className="w-[90%] text-center mx-auto flex flex-col items-center gap-3">
                    <div className="h-7 w-64 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                    <div className="h-7 w-48 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                </div>
            </div>

            {/* Main */}
            <div className="main w-[90%] min-h-96 flex max-md:flex-col justify-center items-start my-10 gap-10 mx-auto">
                {/* Left — image + score */}
                <div className="md:w-[20%] w-full h-full">
                    <div className="w-full aspect-3/4 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                    <div className="h-8 w-full rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s] mt-1" />
                </div>

                {/* Right — info rows */}
                <div className="w-full h-full flex flex-col gap-3">
                    {/* Genre */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="h-6 w-16 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                        <div className="flex gap-2">
                            {[80, 60, 90].map((w, i) => (
                                <div key={i} className="h-7 rounded-2xl bg-gray-700 animate-pulse [animation-duration:0.8s]" style={{ width: w }} />
                            ))}
                        </div>
                    </div>

                    {/* Streaming */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="h-6 w-24 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                        <div className="flex gap-2">
                            {[70, 85].map((w, i) => (
                                <div key={i} className="h-7 rounded-2xl bg-gray-700 animate-pulse [animation-duration:0.8s]" style={{ width: w }} />
                            ))}
                        </div>
                    </div>

                    {/* Simple rows */}
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="h-6 w-20 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                            <div className="h-6 w-40 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Synopsis */}
            <div className="synopsis w-[90%] mx-auto flex flex-col gap-4">
                <div className="h-8 w-36 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-5 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" style={{ width: i === 4 ? "60%" : "100%" }} />
                    ))}
                </div>
            </div>

            {/* Trailer */}
            <div className="md:w-200 md:h-100 w-[90%] h-60 mx-auto my-10 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
        </main>
    );
}