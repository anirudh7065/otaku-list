const AnimeSearchLoader = () => {
    return (
        <ul className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl max-h-100 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 p-3">
                    <div className="w-10 h-14 rounded bg-zinc-700 animate-pulse [animation-duration:0.8s] shrink-0" />
                    <div className="h-4 w-48 rounded-md bg-zinc-700 animate-pulse [animation-duration:0.8s]" />
                </li>
            ))}
        </ul>
    );
};

export default AnimeSearchLoader;