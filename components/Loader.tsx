import Image from 'next/image';

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Image
        src="./loading-circle.svg"
        alt="Loading..."
        width={150}
        height={150}
      />
    </div>
  );
};

export default Loader;
