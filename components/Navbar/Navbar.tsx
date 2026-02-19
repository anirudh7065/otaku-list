import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import AnimeSearchDesktopWrapper from "../AnimeList/AnimeSearchDesktopWrapper";
import AnimeSearchMobileWrapper from "../AnimeList/AnimeSearchMobileWrapper";
const Navbar = () => {
  
    return (
      <main className="flex h-16 justify-between items-center py-3 px-6 bg-linear-to-r from-black via-purple-900 to-black

">
        <div className="logo">
          <Image
            src="/logo/logo-circle.png"
            alt="logo"
            width={500}
            height={500}
            className="h-10 w-10"
          />
        </div>
        <AnimeSearchMobileWrapper />
        <AnimeSearchDesktopWrapper />
        
        <nav className="flex gap-4 font-bold max-lg:hidden">
          <Link href={"/"} className="cursor-pointer">Home</Link>
          <Link href={"/season"} className="cursor-pointer">Season</Link>
          <Link href={"/genres"} className="cursor-pointer">Genres</Link>
          <Link href={"/top"} className="cursor-pointer">Top</Link>
          <Link href={"/schedules"} className="cursor-pointer">Schedule</Link>
          <Link href={"/mylist"} className="cursor-pointer">My List</Link>

        </nav>
        <MobileNav />
        
      </main>
    );
};

export default Navbar;
