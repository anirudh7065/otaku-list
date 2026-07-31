const AnimeListLoader = ({ count = 12 }: { count?: number }) => {
    return (
        <div className="cursor-pointer select-none w-screen">
            {/* Title */}
            <div className="py-4 px-15 w-full flex justify-center gap-15 items-center mx-auto">
                <div className="h-10 w-60 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
            </div>

            {/* Cards */}
            <div className="flex flex-wrap justify-center md:gap-6 gap-4 max-w-full mx-auto">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i}>
                        <div className="rounded-2xl border-3 border-primary-dark h-56 w-40 md:w-70 md:h-105 overflow-hidden">
                            {/* Image */}
                            <div className="h-full md:h-84 w-full bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                            {/* Title bar */}
                            <div className="hidden md:flex justify-center items-center border-t-4 border-primary-dark py-3 h-18 px-2">
                                <div className="h-4 w-4/5 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                            </div>
                        </div>

                        {/* Star + members */}
                        <div className="flex justify-center items-center gap-2 mt-1">
                            <div className="h-4 w-20 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimeListLoader;