import AnimeStudiosContent from "./AnimeStudiosContent";
import { ProducerType } from "@/types/producertype";
import { notFound } from "next/navigation";
import { Metadata } from "next";

async function getStudio(id:string) {
    const rawId = Number(Array.isArray(id) ? id[0] : id);
    const newId = rawId ?? null;
    if (newId === null || isNaN(newId)) {
        notFound()
    }
    const res = await fetch(
        `${process.env.APP_BASE_URL || "http://localhost:3000"}/api/fetchProducer?id=${newId}`,
        { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    let error = null;
    if (!res.ok) error = new Error(data?.message || "Failed to fetch data");

    if (error?.message === "No Studio found") {
        notFound();
    }
    if (error) {    
        throw error;
    }
    
    return data.data ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const studio: ProducerType = await getStudio(id);
    return {
        title: studio.titles[0].title,
        description: studio?.about?.slice(0, 160) || "",
        openGraph: {
            images: [studio?.images?.jpg?.image_url],
        },
    };
}

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const studio:ProducerType = await getStudio(id);
    return <AnimeStudiosContent studio={studio} />;
}