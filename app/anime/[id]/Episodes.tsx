import { usePageQuery } from '@/hooks/usePageQuery';
import useGetData from '@/hooks/useGetData';
import type { Episode } from '@/types/newPost';

const EpisodesLoader = () => {
    return (
        <div className="w-[95vw] mx-auto my-3 border pb-2 rounded-2xl select-none">
            <div className="w-full border-b flex justify-between">
                <div className="h-7 w-24 m-4 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                <div className="h-7 w-28 m-4 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
            </div>
            <div className="w-full h-100 overflow-hidden">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 border-b">
                        <div className="h-5 w-5 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                        <div className="h-5 w-45 rounded-md bg-gray-700 animate-pulse [animation-duration:0.8s]" />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Episodes = ({ id, initialData }: { id: number; initialData?: { episodes: Episode[]; maxPage: number } | null }) => {
    const { page, setPage } = usePageQuery();

    const enabled = !initialData || page !== 1;
    const { anime: fetchedEpisodes, maxPages: fetchedMaxPages, loading: episodesLoading, error: episodesError } = useGetData({
        url: "/api/fetchAnimeEpisode",
        id,
        page,
        enabled,
    });

    const episodes: Episode[] =
        initialData && page === 1 ? initialData.episodes : (fetchedEpisodes as Episode[]);
    const maxPages = initialData && page === 1 ? initialData.maxPage : fetchedMaxPages;

    if (episodesError) {
        throw new Error(episodesError);
    }

    if (episodesLoading) {
        return <EpisodesLoader />;
    }

    return (
        <>{
            episodes?.length > 0 && <div className="w-[95vw] mx-auto my-3 border pb-2 rounded-2xl ">
                <div className="w-full border-b flex justify-between">
                    <h1 className="font-bold p-4 text-xl">Episodes</h1>
                    <div className="inline font-bold p-4">
                        {page > 1 && <button onClick={() => setPage(page - 1)}>{"<"}</button>}
                        <span className=" px-1">
                            {episodes[0].mal_id} - {episodes.length + episodes[0].mal_id - 1}
                        </span>
                        {page < maxPages && <button onClick={() => setPage(page + 1)}>{">"}</button>}
                    </div>
                </div>
                <div className="w-full h-100 overflow-x-hidden overflow-scroll scrollbar-custom">
                    {episodes.map((episode: Episode, index: number) => (
                        <div key={episode?.mal_id} className={`w-full flex items-center gap-3 p-4 ${index !== episodes.length - 1 && "border-b"}`}>
                            <span className="text-primary">{episode?.mal_id}</span>
                            <div className='md:inline flex flex-col'>

                                <span className="">{episode?.title} </span>
                                <span className="">{" [ "} {episode?.title_japanese}{" ]"} </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div >
        }</>
    )
}

export default Episodes