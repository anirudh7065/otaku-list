const AnimeScheduleLoader = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <main className="pt-10 pb-20">
            <h1 className="w-full text-4xl font-bold text-center">Schedule</h1>

            {days.map((day) => (
                <div key={day} className="cursor-pointer select-none w-screen">
                    {/* Day title */}
                    <div className="py-4 w-full flex justify-center items-center mx-auto">
                        <div className="text-2xl my-6 bg-purple-900 py-2 w-full text-center font-bold">{day}</div>
                    </div>

                    {/* Cards */}
                    <div className="flex flex-wrap justify-center md:gap-6 gap-4 max-w-full mx-auto">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i}>
                                <div className="rounded-2xl border-3 border-purple-900 h-56 w-40 md:w-70 md:h-105 overflow-hidden">
                                    <div className="h-full md:h-84 w-full bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                                    <div className="hidden md:flex justify-center items-center border-t-4 border-purple-700 py-3 h-18 px-2">
                                        <div className="h-4 w-4/5 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-2 mt-1">
                                    <div className="h-4 w-20 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                                </div>
                                {/* Countdown */}
                                <div className="flex justify-center mt-1">
                                    <div className="h-4 w-24 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </main>
    );
};

export default AnimeScheduleLoader;