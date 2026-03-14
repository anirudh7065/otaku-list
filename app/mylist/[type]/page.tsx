'use client';
import { useParams } from "next/navigation";
import MyListComponent from "@/components/MyListComponent";


export default function MyList() {
    const { type } = useParams();
    return <MyListComponent type={type as "movie" | "ona" | "ova" | "series" | "all" | "special"}/>
}