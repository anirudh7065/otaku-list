import Image from "next/image";
import logo from "@/public/logo/logo-circle.png";
const Loader = () => {
  return <div className="w-screen min-h-100 flex justify-center items-center">
    <Image
      src={logo}
      alt="Loading..."
      width={100}
      height={100}
      className="rounded-full animate-pulse bg-gray-200 dark:bg-gray-700"
    />
  </div>
};

export default Loader;
