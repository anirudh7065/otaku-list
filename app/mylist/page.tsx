import Link from "next/link";

import MyListContent from "@/components/MyListComponent";
export default function Mylist() {
    const type = ["Movie", 'ONA', 'OVA', 'Series', 'All', 'Special'];
    return (
        <main className="w-full min-h-screen mx-auto">
            <h1 className={` w-full font-bold text-center text-4xl py-8`}>
                My List
            </h1>
            <div className="md:w-[80%] w-[95%] py-4 px-2 pb-10 grid grid-cols-2 md:grid-cols-3 gap-4 mx-auto">
                {
                    type.map((val, i) => (
                        <Link key={i} href={`/mylist/${val.toLowerCase()}`} className="border p-4 rounded-lg hover:shadow-lg transition-shadow" >

                            <span className="text-sm md:text-lg font-semibold" >{val}</span>
                        </Link>
                    ))
                }
            </div>
            <MyListContent main={false} type="all"/>
        </main>
    );
}
