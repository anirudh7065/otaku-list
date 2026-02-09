import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
      <nav className="flex h-16 justify-between items-center py-3 px-6 bg-gradient-to-r from-blak via-red_purple to-blak">
        <div className="logo">
          <Image
            src="/logo/logo-circle.svg"
            alt="logo"
            width={500}
            height={500}
            className="h-10 w-10"
          />
        </div>
        <nav className="flex gap-4 font-bold">
          <Link href={"/"} className="cursor-pointer">Home</Link>
          <Link href={"/season"} className="cursor-pointer">Season</Link>
          <Link href={"/genres"} className="cursor-pointer">Genres</Link>
          <Link href={"/top"} className="cursor-pointer">Top</Link>
          <Link href={"/mylist"} className="cursor-pointer">My List</Link>

        </nav>
      </nav>
    );
};

export default Navbar;
