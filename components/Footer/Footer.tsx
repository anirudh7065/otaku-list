const Footer = () => {
  return (
    <footer className="
  text-center flex items-center justify-center gap-5 text-sm 
  bg-linear-to-r from-black via-purple-700 to-black py-2
  md:fixed md:bottom-0 md:left-0 md:right-0 max-md:flex-col
  z-50
">


      <p>Copyright © 2024 OtakuList. All rights reserved.</p>
      <span>
      Powered by{" "}
      <a href="https://jikan.moe" target="_blank" className="hover:underline" rel="noopener noreferrer">
        Jikan API
      </a>{" "}
      (MyAnimeList)
      </span>

    </footer>
  );
}

export default Footer