'use client';
import { useParams } from "next/navigation";
import MyListComponent from "@/components/MyListComponent";
import { notFound } from "next/navigation";


export default function TopContent() {
  const { type } = useParams();
  if (type !== "movie" && type !== "ona" && type !== "ova" && type !== "series" && type !== "all" && type !== "special") {
    return notFound()
  }
  return <MyListComponent home={true} type={type as "movie" | "ona" | "ova" | "series" | "all" | "special"} />
}